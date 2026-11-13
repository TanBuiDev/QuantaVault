"use client";

import { useCallback, useEffect, useState } from "react";
import { Cloud, ShieldCheck } from "lucide-react";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { useAccount } from "@/lib/auth/AccountProvider";
import { readInterviewProgress } from "@/lib/interview/progress";
import {
  conservativeMerge, emitGoogleSync, fetchGoogleProgress, getLinkedGoogleUser,
  linkGoogleProgress, type RemoteProgress,
} from "@/lib/auth/googleSync";
import type { InterviewProgressState } from "@/lib/interview/types";

const equal = (a:InterviewProgressState,b:InterviewProgressState) => JSON.stringify(a)===JSON.stringify(b);
function count(s:InterviewProgressState):string {
  return Object.keys(s.learned).length+" nắm vững · "+Object.keys(s.review).length+" cần ôn · "+Object.keys(s.bookmarks).length+" đã lưu";
}
const stateLabel={
  synced:"Đã đồng bộ",
  syncing:"Đang đồng bộ",
  offline:"Chưa có kết nối — tiến độ lưu trên máy",
  conflict:"Cần đối chiếu dữ liệu",
  unlinked:"Đang chuẩn bị đồng bộ",
  "auth-required":"Cần đăng nhập lại",
  forbidden:"Không đủ quyền đồng bộ",
};
export function GoogleAccountPanel() {
  const {user,loading,syncStatus}=useAccount();
  const confirm=useConfirm();
  const [remote,setRemote]=useState<RemoteProgress|null>(null);
  const [busy,setBusy]=useState(false);
  const [notice,setNotice]=useState("");
  const refresh=useCallback(async()=>{
    if(!user)return;
    const value=await fetchGoogleProgress(user.id);
    setRemote(value);
  },[user?.id]);
  useEffect(()=>{
    if(!user)return;
    queueMicrotask(()=>{void refresh().catch(()=>setNotice("Chưa tải được tiến độ đã lưu. Dữ liệu trên thiết bị vẫn được giữ nguyên."));});
  },[refresh,user?.id,syncStatus]);
  if(loading)return <p className="text-sm text-[var(--muted)]">Đang kiểm tra trạng thái đồng bộ...</p>;
  if(!user)return <p className="text-sm text-[var(--muted-strong)]">Đăng nhập Google để bật đồng bộ tự động.</p>;

  const local=readInterviewProgress();
  const needsReview=syncStatus==="conflict" && !!remote && !equal(local,remote.state);
  async function choose(mode:"local"|"remote"|"conservative") {
    if(!user||!remote||busy)return;
    const other=getLinkedGoogleUser();
    if(other&&other!==user.id){setNotice("Tiến độ trên thiết bị thuộc một tài khoản khác. Hãy kiểm tra tài khoản trước khi đồng bộ.");return;}
    const original=readInterviewProgress();
    const selected=mode==="local" ? original : mode==="remote" ? remote.state : conservativeMerge(original,remote.state);
    const ok=await confirm({
      title:"Xác nhận đối chiếu tiến độ phỏng vấn",
      message:`Trên thiết bị: ${count(original)}. Trên tài khoản: ${count(remote.state)}. Sau khi xử lý: ${count(selected)}. Hệ thống lưu bản sao trước khi thay đổi. Chỉ thực hiện nếu đây là dữ liệu của tài khoản đang đăng nhập.`,
      confirmText:"Sao lưu và áp dụng",cancelText:"Hủy",variant:"warning",
    });
    if(!ok)return;
    if(!equal(readInterviewProgress(),original)){setNotice("Dữ liệu vừa thay đổi. Vui lòng đối chiếu lại.");return;}
    setBusy(true);
    try {
      await linkGoogleProgress(user.id,mode,remote);
      setNotice("Đã cập nhật tiến độ phỏng vấn.");
      await refresh();
      emitGoogleSync("syncing");
    } catch(error) {
      setNotice(error instanceof Error && error.message==="VERSION_CONFLICT"
        ? "Tiến độ đã thay đổi trên thiết bị khác. Hãy tải lại để kiểm tra trước khi tiếp tục."
        : "Chưa thể kết hợp dữ liệu. Tiến độ trên thiết bị vẫn được giữ nguyên.");
    } finally {setBusy(false);}
  }
  return (
    <section id="sync" aria-label="Đồng bộ Google" className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-center gap-2"><ShieldCheck className="size-4 text-indigo-500"/><h2 className="font-semibold">Đồng bộ tiến độ học tập</h2></div>
      <p className="text-xs text-[var(--muted-strong)]">Đang dùng tài khoản {user.email}. Khi đồng bộ thành công, bạn có thể tiếp tục học trên các thiết bị khác.</p>
      <p role="status" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary-strong)]"><Cloud className="size-4"/>{stateLabel[syncStatus]}</p>
      <div className="grid gap-2 sm:grid-cols-2 text-xs">
        <div className="rounded-xl border border-[var(--border)] p-3"><p className="font-semibold">Trên thiết bị</p><p className="mt-1 text-[var(--muted-strong)]">{count(local)}</p></div>
        <div className="rounded-xl border border-[var(--border)] p-3"><p className="font-semibold">Đã lưu trên tài khoản</p><p className="mt-1 text-[var(--muted-strong)]">{remote?count(remote.state):"Đang tải..."}</p></div>
      </div>
      {needsReview&&remote&&<div className="space-y-2 rounded-xl border border-amber-500/40 p-3">
        <p className="text-xs font-semibold text-amber-600">Tiến độ trên thiết bị và tài khoản có khác biệt. Hãy chọn cách xử lý phù hợp để tránh mất dữ liệu.</p>
        <div className="flex flex-wrap gap-2">
          {remote.revision===0&&<button disabled={busy} onClick={()=>void choose("local")} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold">Lưu tiến độ từ thiết bị</button>}
          {remote.revision>0&&<button disabled={busy} onClick={()=>void choose("remote")} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold">Dùng tiến độ đã lưu</button>}
          {remote.revision>0&&<button disabled={busy} onClick={()=>void choose("conservative")} className="rounded-lg border border-amber-500/50 px-3 py-2 text-xs font-semibold">Kết hợp tiến độ (ưu tiên cần ôn)</button>}
        </div>
      </div>}
      <button type="button" onClick={()=>void refresh().catch(()=>setNotice("Chưa thể làm mới tiến độ đã lưu."))} className="text-left text-xs font-semibold text-indigo-600 dark:text-indigo-400">Làm mới thông tin đồng bộ</button>
      {notice&&<p role="status" className="text-xs text-[var(--muted-strong)]">{notice}</p>}
    </section>
  );
}
