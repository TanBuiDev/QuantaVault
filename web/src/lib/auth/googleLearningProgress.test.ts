// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { handleGoogleLearningProgress } from "./googleLearningProgress";
import { readGoogleAccount } from "./googleOAuth";
vi.mock("./googleOAuth", () => ({readGoogleAccount:vi.fn()}));
const ORIGIN="https://quantavault.pages.dev";
const user={id:"google-user-a",email:"a@example.com",name:"A",role:"user" as const};
const url=(kind="courses",userId=user.id)=> ORIGIN+"/api/learning-progress?kind="+kind+"&userId="+userId;
const request=(kind:string,method:string,body?:unknown,origin=ORIGIN)=>new Request(url(kind),{
  method, ...(body===undefined ? {} : {body:JSON.stringify(body),headers:{Origin:origin,"Content-Type":"application/json"}})
});
class FakeD1 {
  rows = new Map<string,{state_json:string;revision:number}>();
  prepare(sql:string) {
    let args:unknown[]=[];
    return {
      bind(...v:unknown[]){args=v;return this;},
      first:async<T>()=>{
        if(!sql.startsWith("SELECT state_json"))throw Error("unexpected select");
        return (this.rows.get(String(args[0])+":"+String(args[1]))??null) as T|null;
      },
      run:async()=>{
        if(sql.startsWith("INSERT INTO oauth_learning_progress")){
          const key=String(args[0])+":"+String(args[1]);
          if(this.rows.has(key))return {meta:{changes:0}};
          this.rows.set(key,{state_json:String(args[2]),revision:1});
          return {meta:{changes:1}};
        }
        if(sql.startsWith("UPDATE oauth_learning_progress")){
          const key=String(args[1])+":"+String(args[2]), row=this.rows.get(key);
          if(!row||row.revision!==args[3])return {meta:{changes:0}};
          this.rows.set(key,{state_json:String(args[0]),revision:row.revision+1});
          return {meta:{changes:1}};
        }
        throw Error("unexpected sql");
      }
    };
  }
}
let db:FakeD1;
beforeEach(()=>{db=new FakeD1();vi.mocked(readGoogleAccount).mockResolvedValue(user);});
describe("Google course and Top150 sync endpoints",()=>{
  const courses={version:1,courses:{"postgres-for-java":{completedLessonIds:["lesson-01"],lastAccessedLessonId:"lesson-02",updatedAt:new Date().toISOString()}}};
  const top={version:1,problems:{"1":{problemId:1,status:"review",bookmarked:true,confidence:2,revealedHints:1,solutionViewed:true,interviewViewed:false,notes:"Review",updatedAt:new Date().toISOString()}}};
  it.each([["courses",courses],["top150",top]])("isolates %s progress and enforces revisions",async(kind,state)=>{
    const before=await handleGoogleLearningProgress(request(kind,"GET"),{INTERVIEW_DB:db});
    expect((await before.json()).revision).toBe(0);
    const put=()=>handleGoogleLearningProgress(request(kind,"PUT",{kind,userId:user.id,state,revision:0}),{INTERVIEW_DB:db});
    expect((await put()).status).toBe(200);
    expect((await put()).status).toBe(409);
    const after=await handleGoogleLearningProgress(request(kind,"GET"),{INTERVIEW_DB:db});
    expect((await after.json()).state).toEqual(state);
  });
  it("rejects unauthenticated and cross-account requests",async()=>{
    vi.mocked(readGoogleAccount).mockResolvedValueOnce(null);
    expect((await handleGoogleLearningProgress(request("courses","GET"),{INTERVIEW_DB:db})).status).toBe(401);
    expect((await handleGoogleLearningProgress(new Request(url("courses","google-user-b")),{INTERVIEW_DB:db})).status).toBe(403);
    expect((await handleGoogleLearningProgress(request("courses","PUT",{kind:"courses",userId:"google-user-b",state:{version:1,courses:{}},revision:0}),{INTERVIEW_DB:db})).status).toBe(400);
  });
  it("rejects invalid course schema and cross-origin writes",async()=>{
    expect((await handleGoogleLearningProgress(request("courses","PUT",{kind:"courses",userId:user.id,state:{version:1,courses:{"bad":{completedLessonIds:"invalid"}}},revision:0}),{INTERVIEW_DB:db})).status).toBe(400);
    expect((await handleGoogleLearningProgress(request("top150","PUT",{kind:"top150",userId:user.id,state:top,revision:0},"https://evil.example"),{INTERVIEW_DB:db})).status).toBe(403);
    expect(db.rows.size).toBe(0);
  });
});
