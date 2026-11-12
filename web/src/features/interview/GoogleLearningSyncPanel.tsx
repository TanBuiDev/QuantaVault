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
export function GoogleLearningSyncPanel() {
  const {user,syncStatus}=useAccount();
  const confirm=useConfirm();
  const [remotes,setRemotes]=useState<Partial<Record<LearningKind,Remote>>>({});
  const [busy,setBusy]=useState<LearningKind|null>(null);
  const [notice,setNotice]=useState("");
  const refresh=useCallback(async()=>{
    if(!user)return;
    const settled=await Promise.allSettled(kinds.map(k=>fetchLearningProgress(k.id,user.id)));
    const current:Partial<Record<LearningKind,Remote>>={};
    settled.forEach((entry,index)=>{if(entry.status==="fulfilled")current[kinds[index].id]=entry.value;});
    setRemotes(current);
  },[user?.id]);
  useEffect(()=>{
    if(!user)return;
    queueMicrotask(()=>{void refresh().catch(()=>setNotice("Không thể tải dữ liệu khóa học hoặc thuật toán."));});
  },[user?.id,refresh,syncStatus]);
  if(!user)return null;
  async function choose(kind:LearningKind,mode:"local"|"remote"|"conservative") {
    if(!user||busy)return;
    const remote=remotes[kind];
    if(!remote)return;
    const local=read(kind);
    const ok=await confirm({
      title:"Xác nhận đối chiếu "+(kind==="courses"?"khóa học":"Top Interview 150"),
      message:`Máy có ${describeLearningProgress(kind,local)} mục, Google có ${describeLearningProgress(kind,remote.state)} mục. ${mode==="conservative"?"Hợp nhất thận trọng: khóa học chỉ giữ bài hoàn thành ở cả hai bản; thuật toán khác trạng thái sẽ chuyển thành Cần ôn.":mode==="local"?"Chọn bản máy để cập nhật lên Google.":"Chọn bản Google để phục hồi thiết bị."} Hai nguồn được sao lưu trước khi thay đổi.`,
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
      setNotice(e instanceof Error&&e.message==="VERSION_CONFLICT"?"Dữ liệu Google đã đổi ở thiết bị khác. Hãy tải lại trước khi hợp nhất.":"Chưa thể đối chiếu; bản lưu hiện tại vẫn được bảo toàn.");
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
          <p>Google D1: <strong>{remote?describeLearningProgress(kind.id,remote.state)+" "+kind.unit:"Chưa tải được"}</strong></p>
        </div>
        {syncStatus==="conflict"&&diff&&remote&&<div className="space-y-2">
          <p className="text-xs text-amber-600">Có khác biệt dữ liệu. Cần quyết định trước khi ghi đè.</p>
          <div className="flex flex-wrap gap-2">
            {remote.revision===0&&<button type="button" disabled={!!busy} onClick={()=>void choose(kind.id,"local")} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold">Nhập dữ liệu máy</button>}
            {remote.revision>0&&<button type="button" disabled={!!busy} onClick={()=>void choose(kind.id,"remote")} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold">Dùng bản Google</button>}
            {remote.revision>0&&<button type="button" disabled={!!busy} onClick={()=>void choose(kind.id,"conservative")} className="rounded-lg border border-amber-500/50 px-3 py-2 text-xs font-semibold">Hợp nhất thận trọng</button>}
          </div>
        </div>}
      </section>;
    })}
    {notice&&<p role="status" className="col-span-full text-xs text-[var(--muted-strong)]">{notice}</p>}
  </div>;
}
