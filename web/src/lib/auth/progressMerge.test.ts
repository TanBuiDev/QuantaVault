import { describe, expect, it } from "vitest";
import { mergeInterviewProgress, mergeLearningProgress } from "./progressMerge";
import type { InterviewProgressState } from "../interview/types";

const interview=(learned:string[]=[],review:string[]=[],bookmarks:string[]=[]):InterviewProgressState=>({
  learned:Object.fromEntries(learned.map(id=>[id,true])),
  review:Object.fromEntries(review.map(id=>[id,true])),
  bookmarks:Object.fromEntries(bookmarks.map(id=>[id,true])),
});
const course=(lessons:string[],last="a",at="2026-11-13T00:00:00Z")=>({
  completedLessonIds:lessons,lastAccessedLessonId:last,updatedAt:at,
});
const problem=(status:string,notes="")=>({
  problemId:1,status,bookmarked:false,confidence:null,revealedHints:0,
  solutionViewed:false,interviewViewed:false,notes,updatedAt:"2026-11-13T00:00:00Z",
});
describe("Safe three-way merge of personal learning progress",()=>{
  it("combines disjoint interview edits and bookmarks",()=>{
    const merged=mergeInterviewProgress(interview(["q1"]),interview(["q1","q2"],[],["q5"]),interview(["q1"],["q3"],["q6"]));
    expect(merged).toEqual(interview(["q1","q2"],["q3"],["q5","q6"]));
  });
  it("preserves an intentional unmark instead of blindly unioning learned flags",()=>{
    const merged=mergeInterviewProgress(interview(["q1"]),interview(),interview(["q1"],["q2"]));
    expect(merged).toEqual(interview([],["q2"]));
  });
  it("requires review for genuinely contradictory interview statuses",()=>{
    expect(mergeInterviewProgress(interview(),interview(["q1"]),interview([],["q1"]))).toBeNull();
  });
  it("unions separate completed lessons inside one course",()=>{
    const base={version:1,courses:{java:course(["l1"])}};
    const local={version:1,courses:{java:course(["l1","l2"],"l2","2026-11-13T01:00:00Z")}};
    const remote={version:1,courses:{java:course(["l1","l3"],"l3","2026-11-13T02:00:00Z")}};
    const merged=mergeLearningProgress("courses",base,local,remote);
    expect((merged?.courses as Record<string,{completedLessonIds:string[]}>).java.completedLessonIds.sort()).toEqual(["l1","l2","l3"]);
    expect((merged?.courses as Record<string,{lastAccessedLessonId:string}>).java.lastAccessedLessonId).toBe("l3");
  });
  it("does not resurrect an intentionally removed completed lesson",()=>{
    const base={version:1,courses:{java:course(["l1","l2"])}};
    const local={version:1,courses:{java:course(["l2"],"l2","2026-11-13T01:00:00Z")}};
    const remote={version:1,courses:{java:course(["l1","l2","l3"],"l3","2026-11-13T02:00:00Z")}};
    const merged=mergeLearningProgress("courses",base,local,remote);
    expect((merged?.courses as Record<string,{completedLessonIds:string[]}>).java.completedLessonIds.sort()).toEqual(["l2","l3"]);
  });
  it("combines distinct fields on the same Top150 question when safe",()=>{
    const b=problem("in-progress");
    const l={...b,notes:"Use HashMap"};
    const r={...b,bookmarked:true};
    const merged=mergeLearningProgress("top150",
      {version:1,problems:{"1":b}},{version:1,problems:{"1":l}},{version:1,problems:{"1":r}});
    expect((merged?.problems as Record<string,{notes:string;bookmarked:boolean}>)["1"]).toMatchObject({notes:"Use HashMap",bookmarked:true});
  });
  it("refuses conflicting notes or statuses on the same Top150 question",()=>{
    const b=problem("in-progress");
    expect(mergeLearningProgress("top150",
      {version:1,problems:{"1":b}},
      {version:1,problems:{"1":{...b,status:"solved"}}},
      {version:1,problems:{"1":{...b,status:"review"}}})).toBeNull();
    expect(mergeLearningProgress("top150",
      {version:1,problems:{"1":b}},
      {version:1,problems:{"1":{...b,notes:"first"}}},
      {version:1,problems:{"1":{...b,notes:"second"}}})).toBeNull();
  });
});
