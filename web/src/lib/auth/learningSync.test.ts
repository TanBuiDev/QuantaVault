import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { prepareGoogleDevice } from "./googleSync";
import { reconcileLearningProgress, resolveLearningProgress } from "./learningSync";
const courseKey="quantavault-course-progress:v1";
const topKey="leetcode-top150-progress:v1";
const empty={version:1,courses:{}};
const state={version:1,courses:{"postgres-for-java":{completedLessonIds:["lesson-01"],lastAccessedLessonId:"lesson-02",updatedAt:"2026-11-12T00:00:00.000Z"}}};
const problem={problemId:1,status:"review",bookmarked:true,confidence:2,revealedHints:1,solutionViewed:false,interviewViewed:false,notes:"",updatedAt:"2026-11-12T00:00:00.000Z"};
let cloud:Record<string,{revision:number;state:unknown}>;
let calls:ReturnType<typeof vi.fn>;
beforeEach(()=>{
  localStorage.clear();
  cloud={courses:{revision:0,state:empty},top150:{revision:0,state:{version:1,problems:{}}}};
  calls=vi.fn(async(url:string,opts?:RequestInit)=>{
    const kind=new URL(url,"https://quantavault.pages.dev").searchParams.get("kind")!;
    if(!opts||opts.method!=="PUT")return Response.json({ok:true,...cloud[kind]});
    const data=JSON.parse(opts.body as string) as {revision:number;state:unknown;userId:string};
    if(data.userId!=="account-a")return Response.json({ok:false},{status:403});
    if(data.revision!==cloud[kind].revision)return Response.json({ok:false},{status:409});
    cloud[kind]={revision:data.revision+1,state:data.state};
    return Response.json({ok:true,revision:cloud[kind].revision});
  });
  vi.stubGlobal("fetch",calls);
});
afterEach(()=>vi.unstubAllGlobals());
describe("Unified account learning progress",()=>{
  it("restores courses and Top150 independently on a new device",async()=>{
    cloud.courses={revision:4,state};
    cloud.top150={revision:2,state:{version:1,problems:{"1":problem}}};
    prepareGoogleDevice("account-a");
    expect(await reconcileLearningProgress("courses","account-a")).toBe("synced");
    expect(await reconcileLearningProgress("top150","account-a")).toBe("synced");
    expect(JSON.parse(localStorage.getItem(courseKey)!)).toEqual(state);
    expect(JSON.parse(localStorage.getItem(topKey)!)).toEqual(cloud.top150.state);
    expect(calls.mock.calls.some(x=>x[1]?.method==="PUT")).toBe(false);
  });
  it("requires a one-time decision to import unclaimed local course progress",async()=>{
    localStorage.setItem(courseKey,JSON.stringify(state));
    prepareGoogleDevice("account-a");
    expect(await reconcileLearningProgress("courses","account-a")).toBe("conflict");
    expect(cloud.courses.revision).toBe(0);
    await resolveLearningProgress("courses","account-a","local");
    expect(cloud.courses.revision).toBe(1);
    expect(await reconcileLearningProgress("courses","account-a")).toBe("synced");
  });
  it("uses CAS to merge edits to different courses without a prompt",async()=>{
    prepareGoogleDevice("account-a");
    expect(await reconcileLearningProgress("courses","account-a")).toBe("synced");
    localStorage.setItem(courseKey,JSON.stringify(state));
    cloud.courses={revision:1,state:{version:1,courses:{"redis-for-java":{completedLessonIds:["lesson-01"],updatedAt:"2026-11-12T00:00:00.000Z"}}}};
    expect(await reconcileLearningProgress("courses","account-a")).toBe("synced");
    expect(Object.keys((JSON.parse(localStorage.getItem(courseKey)!) as typeof state).courses)).toHaveLength(2);
    expect(Object.keys((cloud.courses.state as {courses:object}).courses)).toHaveLength(2);
  });
  it("combines different Top150 problems, but protects contradictory edits",async()=>{
    prepareGoogleDevice("account-a");
    await reconcileLearningProgress("top150","account-a");
    const local={...problem,problemId:2};
    localStorage.setItem(topKey,JSON.stringify({version:1,problems:{"2":local}}));
    cloud.top150={revision:1,state:{version:1,problems:{"1":problem}}};
    expect(await reconcileLearningProgress("top150","account-a")).toBe("synced");
    const combined=JSON.parse(localStorage.getItem(topKey)!) as {problems:Record<string,unknown>};
    expect(Object.keys(combined.problems).sort()).toEqual(["1","2"]);
    expect(Object.keys((cloud.top150.state as {problems:object}).problems)).toHaveLength(2);

    // Two devices updating the same problem to different statuses need review.
    const baseline={...problem,status:"in-progress"};
    cloud.top150={revision:3,state:{version:1,problems:{"1":baseline}}};
    localStorage.setItem(topKey,JSON.stringify(cloud.top150.state));
    await reconcileLearningProgress("top150","account-a");
    localStorage.setItem(topKey,JSON.stringify({version:1,problems:{"1":{...baseline,status:"solved"}}}));
    cloud.top150={revision:4,state:{version:1,problems:{"1":{...baseline,status:"review"}}}};
    expect(await reconcileLearningProgress("top150","account-a")).toBe("conflict");
    expect((JSON.parse(localStorage.getItem(topKey)!) as {problems:Record<string,{status:string}>}).problems["1"].status).toBe("solved");
  });

  it("isolates Top150 writes from course progress",async()=>{
    prepareGoogleDevice("account-a");
    await reconcileLearningProgress("courses","account-a");
    await reconcileLearningProgress("top150","account-a");
    localStorage.setItem(topKey,JSON.stringify({version:1,problems:{"1":problem}}));
    expect(await reconcileLearningProgress("top150","account-a")).toBe("synced");
    expect(cloud.top150.revision).toBe(1);
    expect(cloud.courses.revision).toBe(0);
  });
});
