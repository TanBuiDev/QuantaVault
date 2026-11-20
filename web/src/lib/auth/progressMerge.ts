import type { InterviewProgressState } from "../interview/types";
type ProgressKind = "courses" | "top150";
type AnyState = Record<string, unknown>;
type Decision<T> = { ok: true; value: T } | { ok: false };
const same = (a:unknown,b:unknown) => JSON.stringify(a) === JSON.stringify(b);
function pick<T>(base:T,local:T,remote:T):Decision<T> {
  if(same(local,remote))return {ok:true,value:local};
  if(same(local,base))return {ok:true,value:remote};
  if(same(remote,base))return {ok:true,value:local};
  return {ok:false};
}
const keys=(...maps:Array<Record<string,unknown>>) => new Set(maps.flatMap(m=>Object.keys(m)));
const interviewStatus=(s:InterviewProgressState,id:string) =>
  s.review[id] ? "review" : s.learned[id] ? "learned" : "none";

/** Three-way merge using the last acknowledged state, not a blind union.
 * A changed status can also be explicitly cleared. Never resurrect it accidentally. */
export function mergeInterviewProgress(
  base:InterviewProgressState, local:InterviewProgressState, remote:InterviewProgressState
):InterviewProgressState|null {
  const result:InterviewProgressState={learned:{},review:{},bookmarks:{}};
  for(const id of keys(base.learned,base.review,local.learned,local.review,remote.learned,remote.review)) {
    const chosen=pick(interviewStatus(base,id),interviewStatus(local,id),interviewStatus(remote,id));
    if(!chosen.ok)return null;
    if(chosen.value==="learned")result.learned[id]=true;
    if(chosen.value==="review")result.review[id]=true;
  }
  for(const id of keys(base.bookmarks,local.bookmarks,remote.bookmarks)) {
    const chosen=pick(!!base.bookmarks[id],!!local.bookmarks[id],!!remote.bookmarks[id]);
    if(!chosen.ok)return null;
    if(chosen.value)result.bookmarks[id]=true;
  }
  return result;
}
type Course={completedLessonIds:string[];lastAccessedLessonId?:string;updatedAt:string};
type CourseMap=Record<string,Course>;
type ProblemMap=Record<string,Record<string,unknown>>;
const newer=(a:string,b:string)=>a>=b?a:b;
function mergeCourse(base:Course|undefined, local:Course|undefined, remote:Course|undefined):Decision<Course|undefined> {
  if(!local||!remote)return pick(base,local,remote);
  const lessons:string[]=[];
  const b=new Set(base?.completedLessonIds??[]),l=new Set(local.completedLessonIds),r=new Set(remote.completedLessonIds);
  for(const id of new Set([...b,...l,...r])){
    const chosen=pick(b.has(id),l.has(id),r.has(id));
    if(!chosen.ok)return {ok:false};
    if(chosen.value)lessons.push(id);
  }
  const last=pick(base?.lastAccessedLessonId,local.lastAccessedLessonId,remote.lastAccessedLessonId);
  // Last-visited lesson is navigational metadata, not a completed status.
  const lastVisited=last.ok?last.value:(local.updatedAt>remote.updatedAt?local.lastAccessedLessonId:remote.lastAccessedLessonId);
  return {ok:true,value:{
    completedLessonIds:lessons,updatedAt:newer(local.updatedAt,remote.updatedAt),
    ...(lastVisited?{lastAccessedLessonId:lastVisited}:{}),
  }};
}
const PROBLEM_FIELDS=["status","bookmarked","confidence","revealedHints","solutionViewed","interviewViewed","notes"] as const;
function mergeProblem(
  base:Record<string,unknown>|undefined,
  local:Record<string,unknown>|undefined,
  remote:Record<string,unknown>|undefined
):Decision<Record<string,unknown>|undefined> {
  if(!base||!local||!remote)return pick(base,local,remote);
  const result:Record<string,unknown>={problemId:local.problemId};
  for(const field of PROBLEM_FIELDS){
    const chosen=pick(base[field],local[field],remote[field]);
    if(!chosen.ok)return {ok:false};
    result[field]=chosen.value;
  }
  result.updatedAt=newer(String(local.updatedAt),String(remote.updatedAt));
  return {ok:true,value:result};
}
/** Combine non-overlapping user edits; contradictory changes retain both sources for recovery. */
export function mergeLearningProgress(kind:ProgressKind,base:AnyState,local:AnyState,remote:AnyState):AnyState|null {
  if(kind==="courses"){
    const b=(base.courses??{}) as CourseMap,l=(local.courses??{}) as CourseMap,r=(remote.courses??{}) as CourseMap;
    const courses:CourseMap={};
    for(const id of keys(b,l,r)){
      const chosen=mergeCourse(b[id],l[id],r[id]);
      if(!chosen.ok)return null;
      if(chosen.value)courses[id]=chosen.value;
    }
    return {version:1,courses};
  }
  const b=(base.problems??{}) as ProblemMap,l=(local.problems??{}) as ProblemMap,r=(remote.problems??{}) as ProblemMap;
  const problems:ProblemMap={};
  for(const id of keys(b,l,r)){
    const chosen=mergeProblem(b[id],l[id],r[id]);
    if(!chosen.ok)return null;
    if(chosen.value)problems[id]=chosen.value;
  }
  return {version:1,problems};
}
