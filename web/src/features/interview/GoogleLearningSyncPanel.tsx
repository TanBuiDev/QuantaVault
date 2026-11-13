"use client";

import { useCallback, useEffect, useState } from "react";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { useAccount } from "@/lib/auth/AccountProvider";
import { emitGoogleSync } from "@/lib/auth/googleSync";
import {
  describeLearningProgress, fetchLearningProgress, resolveLearningProgress, type LearningKind,
} from "@/lib/auth/learningSync";
import { readCourseProgress } from "@/lib/courses/useCourseProgress";
import { readProgress } from "@/lib/progress";
type Remote={state:Record<string,unknown>;revision:number};
const kinds=[{id:"courses" as const,label:"Khóa học",unit:"khóa học"},{id:"top150" as const,label:"Top Interview 150",unit:"bài toán"}];
const read=(kind:LearningKind):Record<string,unknown> =>
  kind==="courses" ? readCourseProgress() as unknown as Record<string,unknown> : readProgress() as unknown as Record<string,unknown>;
const equal=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
function explainError(error:unknown):string {
  const message=error instanceof Error?error.message:"";
  if(message.endsWith("_401"))return "Phiên Google đã hết hạn. Vui lòng đăng nhập lại.";
  if(message.endsWith("_403"))return "Tài khoản không có quyền đọc dữ liệu này.";
  return "Chưa tải được dữ liệu. Kiểm tra kết nối rồi thử lại.";
}
export function GoogleLearningSyncPanel() {
  const {user,syncStatus}=useAccount();
  const confirm=useConfirm();
  const [remotes,setRemotes]=useState<Partial<Record<LearningKind,Remote>>>({});
  const [readErrors,setReadErrors]=useState<Partial<Record<LearningKind,string>>>({});
  const [loadingKinds,setLoadingKinds]=useState(false);
  const [busy,setBusy]=useState<LearningKind|null>(null);
  const [notice,setNotice]=useState("");
  const refresh=useCallback(async()=>{
    if(!user)return;
    setLoadingKinds(true);
    try {
      const settled=await Promise.allSettled(kinds.map(k=>fetchLearningProgress(k.id,user.id)));
      const current:Partial<Record<LearningKind,Remote>>={};
      const errors:Partial<Record<LearningKind,string>>={};
      settled.forEach((entry,index)=>{
        const kind=kinds[index].id;
        if(entry.status==="fulfilled")current[kind]=entry.value;
        else errors[kind]=explainError(entry.reason);
      });
      setRemotes(current);
      setReadErrors(errors);
    } finally { setLoadingKinds(false); }
  },[user?.id]);
  useEffect(()=>{
    if(!user)return;
    queueMicrotask(()=>{void refresh().catch(()=>setNotice("Không thể tải dữ liệu khóa học hoặc thuật toán."));});
  },[user?.id,refresh,syncStatus==="conflict"]);
  if(!user)return null;
  async function retryKind(kind:LearningKind) {
    if(!user)return;
    setReadErrors(previous=>({...previous,[kind]:undefined}));
    try {
      const value=await fetchLearningProgress(kind,user.id);
      setRemotes(previous=>({...previous,[kind]:value}));
    } catch(error) {
      setReadErrors(previous=>({...previous,[kind]:explainError(error)}));
    }
  }
  async function choose(kind:LearningKind,mode:"local"|"remote"|"conservative") {
    if(!user||busy)return;
    const remote=remotes[kind];
    if(!remote)return;
    const local=read(kind);
    const ok=await confirm({
      title:"Xác nhận đối chiếu "+(kind==="courses"?"khóa học":"Top Interview 150"),
      message:`Trên thiết bị có ${describeLearningProgress(kind,local)} mục, trên tài khoản có ${describeLearningProgress(kind,remote.state)} mục. ${mode==="conservative"?"Kết hợp an toàn: khóa học chỉ giữ bài hoàn thành ở cả hai bản; thuật toán khác trạng thái sẽ chuyển thành Cần ôn.":mode==="local"?"Lưu tiến độ trên thiết bị vào tài khoản.":"Khôi phục tiến độ đã lưu vào thiết bị."} Hai nguồn được sao lưu trước khi thay đổi.`,
      confirmText:"Sao lưu và áp dụng",cancelText:"Hủy",variant:"warning",
    });
    if(!ok)return;
    setBusy(kind);
    try {
      await resolveLearningProgress(kind,user.id,mode);
      setNotice("Đã xử lý "+(kind==="courses"?"khóa học":"Top Interview 150")+".");
      await refresh();
      emitGoogleSync("syncing");
    }catch(e) {
      setNotice(e instanceof Error&&e.message==="VERSION_CONFLICT"?"Tiến độ đã thay đổi trên thiết bị khác. Hãy tải lại trước khi tiếp tục.":"Chưa thể đối chiếu; bản lưu hiện tại vẫn được bảo toàn.");
    }finally{setBusy(null);}
  }
  return <div className="grid gap-3 sm:grid-cols-2">
    {kinds.map(kind=>{
      const remote=remotes[kind.id],local=read(kind.id);
      const diff=remote&&!equal(local,remote.state);
      return <section key={kind.id} aria-label={"Tiến độ "+kind.label} className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <h3 className="text-sm font-semibold">{kind.label}</h3>
        <div className="grid gap-2 text-xs">
          <p>Thiết bị: <strong>{describeLearningProgress(kind.id,local)} {kind.unit}</strong></p>
          <p>Trên tài khoản: <strong>{remote?describeLearningProgress(kind.id,remote.state)+" "+kind.unit:"Chưa tải được"}</strong></p>
        </div>
        {readErrors[kind.id] && <div role="alert" className="space-y-2 text-xs text-amber-600">
          <p>{readErrors[kind.id]}</p>
          <button type="button" disabled={loadingKinds} onClick={()=>void retryKind(kind.id)} className="font-semibold underline">Thử tải lại {kind.label}</button>
        </div>}
        {syncStatus==="conflict"&&diff&&remote&&<div className="space-y-2">
          <p className="text-xs text-amber-600">Tiến độ trên thiết bị và tài khoản khác nhau. Hãy chọn cách xử lý để tránh mất dữ liệu.</p>
          <div className="flex flex-wrap gap-2">
            {remote.revision===0&&<button type="button" disabled={!!busy} onClick={()=>void choose(kind.id,"local")} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold">Lưu từ thiết bị</button>}
            {remote.revision>0&&<button type="button" disabled={!!busy} onClick={()=>void choose(kind.id,"remote")} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold">Dùng bản đã lưu</button>}
            {remote.revision>0&&<button type="button" disabled={!!busy} onClick={()=>void choose(kind.id,"conservative")} className="rounded-lg border border-amber-500/50 px-3 py-2 text-xs font-semibold">Kết hợp tiến độ</button>}
          </div>
        </div>}
      </section>;
    })}
    {notice&&<p role="status" className="col-span-full text-xs text-[var(--muted-strong)]">{notice}</p>}
  </div>;
}
