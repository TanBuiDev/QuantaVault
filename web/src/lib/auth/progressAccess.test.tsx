import { act, renderHook } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it } from "vitest";
import type { PropsWithChildren } from "react";
import { setLearningSessionActive } from "./progressAccess";
import { useInterviewProgress } from "../interview/progress";
import { useCourseProgress } from "../courses/useCourseProgress";
import { ProgressProvider, useProgress } from "../progress/provider";
import { PROGRESS_STORAGE_KEY } from "../progress";

const INTERVIEW_KEY="interview-prep-progress-v1";
const COURSE_KEY="quantavault-course-progress:v1";

describe("Google-only progress editing; preserve browser data on logout",()=>{
  beforeEach(()=>{
    setLearningSessionActive(false);
    localStorage.clear();
  });
  afterEach(()=>setLearningSessionActive(false));

  it("blocks anonymous interview marks, reviews and bookmarks, even via hook callbacks",()=>{
    const {result}=renderHook(()=>useInterviewProgress());
    act(()=>{
      result.current.toggleLearned("q-013");
      result.current.toggleReview("q-013");
      result.current.toggleBookmark("q-013");
    });
    expect(localStorage.getItem(INTERVIEW_KEY)).toBeNull();
    expect(result.current.isLearned("q-013")).toBe(false);
    expect(result.current.canTrackProgress).toBe(false);
  });

  it("masks but does not delete stored interview progress on logout; re-login restores it",()=>{
    localStorage.setItem(INTERVIEW_KEY,JSON.stringify({
      learned:{"q-013":true},review:{},bookmarks:{},
    }));
    const {result}=renderHook(()=>useInterviewProgress());
    expect(result.current.isLearned("q-013")).toBe(false);
    act(()=>setLearningSessionActive(true));
    expect(result.current.isLearned("q-013")).toBe(true);
    act(()=>result.current.toggleReview("q-013"));
    expect(result.current.isReview("q-013")).toBe(true);
    const saved=localStorage.getItem(INTERVIEW_KEY);
    act(()=>setLearningSessionActive(false));
    expect(result.current.isReview("q-013")).toBe(false);
    act(()=>result.current.toggleLearned("q-013"));
    expect(localStorage.getItem(INTERVIEW_KEY)).toBe(saved);
    act(()=>setLearningSessionActive(true));
    expect(result.current.isReview("q-013")).toBe(true);
  });

  it("blocks anonymous course completion and automatic last-visited writes",()=>{
    const {result}=renderHook(()=>useCourseProgress());
    act(()=>{
      result.current.toggleLessonCompleted("java","lesson-1");
      result.current.recordLastAccessed("java","lesson-1");
    });
    expect(localStorage.getItem(COURSE_KEY)).toBeNull();
    act(()=>setLearningSessionActive(true));
    act(()=>result.current.toggleLessonCompleted("java","lesson-1"));
    expect(result.current.isLessonCompleted("java","lesson-1")).toBe(true);
    const before=localStorage.getItem(COURSE_KEY);
    act(()=>setLearningSessionActive(false));
    expect(result.current.isLessonCompleted("java","lesson-1")).toBe(false);
    act(()=>result.current.toggleLessonCompleted("java","lesson-1"));
    expect(localStorage.getItem(COURSE_KEY)).toBe(before);
  });

  it("blocks anonymous Top150 updates and clears while retaining the prior saved record",()=>{
    const wrapper=({children}:PropsWithChildren)=><ProgressProvider>{children}</ProgressProvider>;
    const {result}=renderHook(()=>useProgress(),{wrapper});
    act(()=>result.current.updateProblem(121,{status:"solved"}));
    expect(localStorage.getItem(PROGRESS_STORAGE_KEY)).toBeNull();
    act(()=>setLearningSessionActive(true));
    act(()=>result.current.updateProblem(121,{status:"solved"}));
    expect(result.current.getProgress(121)?.status).toBe("solved");
    const before=localStorage.getItem(PROGRESS_STORAGE_KEY);
    act(()=>setLearningSessionActive(false));
    expect(result.current.getProgress(121)).toBeNull();
    act(()=>{
      result.current.updateProblem(121,{status:"review"});
      result.current.clearProblem(121);
    });
    expect(localStorage.getItem(PROGRESS_STORAGE_KEY)).toBe(before);
    act(()=>setLearningSessionActive(true));
    expect(result.current.getProgress(121)?.status).toBe("solved");
  });
});
