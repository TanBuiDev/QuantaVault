"use client";

import type { GoogleSyncStatus } from "./googleSync";
import { clearUnowned, isUnownedProgress } from "./googleSync";
import { readCourseProgress, replaceCourseProgress } from "../courses/useCourseProgress";
import { PROGRESS_STORAGE_KEY, readProgress, writeProgress, type ProgressStateV1 } from "../progress";

export type LearningKind = "courses" | "top150";
type AnyState = Record<string, unknown>;
interface Remote { state: AnyState; revision: number }
interface Baseline { userId: string; state: AnyState; revision: number }
const PREFIX = "quantavault_google_learning_baseline_v1:";
const ARCHIVES = "quantavault_google_learning_archives_v1:";
const ACTIVE_KEY = "quantavault_active_progress_account_v1";
const equal = (a:unknown,b:unknown) => JSON.stringify(a) === JSON.stringify(b);
const empty = (kind:LearningKind): AnyState => kind==="courses" ? {version:1,courses:{}} : {version:1,problems:{}};
const populated = (kind:LearningKind,s:AnyState) => Object.keys(kind==="courses" ? (s.courses as object??{}) : (s.problems as object??{})).length>0;
const baselineKey = (kind:LearningKind,id:string) => PREFIX+kind+":"+id;
function assertUser(userId:string):void {
  if(localStorage.getItem(ACTIVE_KEY)!==userId) throw new Error("ACCOUNT_SWITCHED");
}
function readLocal(kind:LearningKind):AnyState {
  const key=kind==="courses" ? "quantavault-course-progress:v1" : PROGRESS_STORAGE_KEY;
  const raw=localStorage.getItem(key);
  if(raw) {
    try {
      const parsed=JSON.parse(raw) as AnyState;
      if(parsed?.version!==1 || !parsed[kind==="courses" ? "courses" : "problems"]
        || typeof parsed[kind==="courses" ? "courses" : "problems"]!=="object") throw Error("bad schema");
    } catch { throw new Error("INVALID_LOCAL_PROGRESS"); }
  }
  return kind==="courses" ? readCourseProgress() as unknown as AnyState : readProgress() as unknown as AnyState;
}
function saveLocal(kind:LearningKind,state:AnyState):void {
  if(kind==="courses") replaceCourseProgress(state as unknown as ReturnType<typeof readCourseProgress>);
  else {
    writeProgress(state as unknown as ProgressStateV1);
    window.dispatchEvent(new Event("leetcode-top150-progress:change"));
  }
}
function getBaseline(kind:LearningKind,userId:string):Baseline|null {
  try {
    const value=localStorage.getItem(baselineKey(kind,userId));
    if(!value)return null;
    const parsed=JSON.parse(value) as Baseline;
    return parsed.userId===userId && Number.isSafeInteger(parsed.revision) && parsed.revision>=0 && parsed.state ? parsed : null;
  } catch { return null; }
}
function setBaseline(kind:LearningKind,userId:string,remote:Remote):void {
  localStorage.setItem(baselineKey(kind,userId),JSON.stringify({...remote,userId} satisfies Baseline));
}
function backup(kind:LearningKind,userId:string,local:AnyState,remote:Remote):void {
  const key=ARCHIVES+kind+":"+userId;
  let previous:unknown[]=[];
  try {const raw=localStorage.getItem(key);if(raw){const parsed=JSON.parse(raw);if(Array.isArray(parsed))previous=parsed;}}catch{/* Keep last safe snapshot. */}
  const entry={savedAt:new Date().toISOString(),local,remote};
  // Fail closed on storage quota errors: never replace unbacked-up device data.
  localStorage.setItem(key,JSON.stringify([entry,...previous].slice(0,6)));
}
export async function fetchLearningProgress(kind:LearningKind,userId:string):Promise<Remote> {
  const params=new URLSearchParams({kind,userId});
  const res=await fetch("/api/learning-progress?"+params.toString(),{credentials:"same-origin",cache:"no-store"});
  if(!res.ok)throw new Error("LEARNING_READ_"+res.status);
  const parsed=await res.json() as {ok:boolean;state:AnyState;revision:number};
  if(!parsed.ok||!parsed.state||!Number.isSafeInteger(parsed.revision))throw new Error("INVALID_SERVER_RESPONSE");
  return {state:parsed.state,revision:parsed.revision};
}
async function put(kind:LearningKind,userId:string,state:AnyState,revision:number):Promise<number> {
  assertUser(userId);
  const params=new URLSearchParams({kind,userId});
  const res=await fetch("/api/learning-progress?"+params.toString(),{
    method:"PUT",credentials:"same-origin",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({kind,userId,state,revision}),
  });
  if(res.status===409)throw new Error("VERSION_CONFLICT");
  if(!res.ok)throw new Error("LEARNING_WRITE_"+res.status);
  const data=await res.json() as {ok:boolean;revision:number};
  if(!data.ok||!Number.isSafeInteger(data.revision))throw new Error("INVALID_SERVER_RESPONSE");
  return data.revision;
}
export async function reconcileLearningProgress(kind:LearningKind,userId:string):Promise<GoogleSyncStatus> {
  assertUser(userId);
  const local=readLocal(kind);
  const remote=await fetchLearningProgress(kind,userId);
  assertUser(userId);
  const base=getBaseline(kind,userId);
  if(equal(local,remote.state)) {
    setBaseline(kind,userId,remote);
    clearUnowned(kind);
    return "synced";
  }
  if(!base) {
    if(!populated(kind,local)) {
      backup(kind,userId,local,remote);
      assertUser(userId);
      saveLocal(kind,remote.state);
      setBaseline(kind,userId,remote);
      clearUnowned(kind);
      return "synced";
    }
    if(!populated(kind,remote.state) && !isUnownedProgress(kind)) {
      backup(kind,userId,local,remote);
      const rev=await put(kind,userId,local,0);
      setBaseline(kind,userId,{state:local,revision:rev});
      return "synced";
    }
    return "conflict";
  }
  if(remote.revision!==base.revision || !equal(remote.state,base.state)) {
    if(equal(local,base.state)) {
      backup(kind,userId,local,remote);
      assertUser(userId);
      if(!equal(readLocal(kind),local))return "conflict";
      saveLocal(kind,remote.state);
      setBaseline(kind,userId,remote);
      return "synced";
    }
    return "conflict";
  }
  if(equal(local,base.state))return "synced";
  backup(kind,userId,local,remote);
  const rev=await put(kind,userId,local,base.revision);
  setBaseline(kind,userId,{state:local,revision:rev});
  return equal(readLocal(kind),local) ? "synced" : "syncing";
}
function conservative(kind:LearningKind,a:AnyState,b:AnyState):AnyState {
  if(kind==="courses") {
    const ac=a.courses as Record<string,{completedLessonIds:string[];lastAccessedLessonId?:string;updatedAt:string}>;
    const bc=b.courses as typeof ac;
    const courses:typeof ac={};
    for(const id of new Set([...Object.keys(ac),...Object.keys(bc)])) {
      const x=ac[id],y=bc[id];
      const newest=(!x ? y : !y ? x : x.updatedAt>=y.updatedAt ? x : y);
      courses[id]={
        completedLessonIds:x&&y ? x.completedLessonIds.filter(l=>y.completedLessonIds.includes(l)) : [],
        ...(newest?.lastAccessedLessonId ? {lastAccessedLessonId:newest.lastAccessedLessonId}:{}),
        updatedAt:newest?.updatedAt??"",
      };
    }
    return {version:1,courses};
  }
  const ap=a.problems as Record<string,Record<string,unknown>>;
  const bp=b.problems as typeof ap, problems:typeof ap={};
  for(const id of new Set([...Object.keys(ap),...Object.keys(bp)])){
    const x=ap[id],y=bp[id];
    if(!x||!y){problems[id]=x??y;continue;}
    const status=x.status===y.status ? x.status : "review";
    const notes=x.notes===y.notes ? String(x.notes) : [String(x.notes||""),String(y.notes||"")].filter(Boolean).join("\n--- Other device ---\n").slice(0,10000);
    const confidence=x.confidence===null||y.confidence===null ? null : Math.min(Number(x.confidence),Number(y.confidence));
    problems[id]={
      ...x,status,notes,confidence,
      bookmarked:Boolean(x.bookmarked)||Boolean(y.bookmarked),
      revealedHints:Math.max(Number(x.revealedHints),Number(y.revealedHints)),
      solutionViewed:Boolean(x.solutionViewed)||Boolean(y.solutionViewed),
      interviewViewed:Boolean(x.interviewViewed)||Boolean(y.interviewViewed),
      updatedAt:String(x.updatedAt)>String(y.updatedAt)?x.updatedAt:y.updatedAt,
    };
  }
  return {version:1,problems};
}
/** Only after an explicit user decision. Always back up both sources first. */
export async function resolveLearningProgress(kind:LearningKind,userId:string,choice:"local"|"remote"|"conservative"):Promise<void> {
  assertUser(userId);
  const local=readLocal(kind), remote=await fetchLearningProgress(kind,userId);
  assertUser(userId);
  const selected=choice==="remote" ? remote.state : choice==="local" ? local : conservative(kind,local,remote.state);
  backup(kind,userId,local,remote);
  if(!equal(readLocal(kind),local))throw new Error("LOCAL_CHANGED");
  const revision=equal(selected,remote.state) ? remote.revision : await put(kind,userId,selected,remote.revision);
  assertUser(userId);
  if(!equal(selected,local))saveLocal(kind,selected);
  setBaseline(kind,userId,{state:selected,revision});
  clearUnowned(kind);
}
export const describeLearningProgress=(kind:LearningKind,state:AnyState):number=>
  Object.keys(kind==="courses" ? (state.courses as object??{}) : (state.problems as object??{})).length;
