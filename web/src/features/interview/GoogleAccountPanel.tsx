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
  unlinked:"Đang khởi tạo Google Sync",
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
    queueMicrotask(()=>{void refresh().catch(()=>setNotice("Không thể đọc tiến độ phỏng vấn trên Google. Dữ liệu máy được giữ nguyên."));});
  },[refresh,user?.id,syncStatus]);
  if(loading)return <p className="text-sm text-[var(--muted)]">Đang kiểm tra Google Sync...</p>;
  if(!user)return <p className="text-sm text-[var(--muted-strong)]">Đăng nhập Google để bật đồng bộ tự động.</p>;

  const local=readInterviewProgress();
  const needsReview=syncStatus==="conflict" && !!remote && !equal(local,remote.state);
  async function choose(mode:"local"|"remote"|"conservative") {
    if(!user||!remote||busy)return;
    const other=getLinkedGoogleUser();
    if(other&&other!==user.id){setNotice("Dữ liệu thiết bị thuộc Google account khác. Không tự nhập dữ liệu qua tài khoản này.");return;}
    const original=readInterviewProgress();
    const selected=mode==="local" ? original : mode==="remote" ? remote.state : conservativeMerge(original,remote.state);
    const ok=await confirm({
      title:"Xác nhận đối chiếu tiến độ phỏng vấn",
      message:`Bản máy: ${count(original)}. Bản Google: ${count(remote.state)}. Kết quả: ${count(selected)}. Hệ thống lưu bản sao trước khi thay đổi. Chỉ thực hiện nếu đây là dữ liệu của tài khoản đang đăng nhập.`,
      confirmText:"Sao lưu và áp dụng",cancelText:"Hủy",variant:"warning",
    });
    if(!ok)return;
    if(!equal(readInterviewProgress(),original)){setNotice("Dữ liệu vừa thay đổi. Vui lòng đối chiếu lại.");return;}
    setBusy(true);
    try {
      await linkGoogleProgress(user.id,mode,remote);
      setNotice("Đã đối chiếu tiến độ phỏng vấn an toàn.");
      await refresh();
      emitGoogleSync("syncing");
    } catch(error) {
      setNotice(error instanceof Error && error.message==="VERSION_CONFLICT"
        ? "Google vừa có phiên bản mới; tải lại để so sánh trước khi tiếp tục."
        : "Chưa thể hợp nhất; không ghi đè bản máy.");
    } finally {setBusy(false);}
  }
  return (
    <section id="sync" aria-label="Đồng bộ Google" className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-center gap-2"><ShieldCheck className="size-4 text-indigo-500"/><h2 className="font-semibold">Đồng bộ tự động với Google</h2></div>
      <p className="text-xs text-[var(--muted-strong)]">Đang sử dụng: {user.email}. Google xác thực danh tính; tiến độ học tập lưu tại Cloudflare D1 và tự khôi phục trên thiết bị khác.</p>
      <p role="status" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary-strong)]"><Cloud className="size-4"/>{stateLabel[syncStatus]}</p>
      <div className="grid gap-2 sm:grid-cols-2 text-xs">
        <div className="rounded-xl border border-[var(--border)] p-3"><p className="font-semibold">Phỏng vấn · thiết bị</p><p className="mt-1 text-[var(--muted-strong)]">{count(local)}</p></div>
        <div className="rounded-xl border border-[var(--border)] p-3"><p className="font-semibold">Phỏng vấn · Google D1</p><p className="mt-1 text-[var(--muted-strong)]">{remote?count(remote.state):"Đang tải..."}</p></div>
      </div>
      {needsReview&&remote&&<div className="space-y-2 rounded-xl border border-amber-500/40 p-3">
        <p className="text-xs font-semibold text-amber-600">Dữ liệu phỏng vấn khác nhau. Chọn cách xử lý sau khi xem tiến độ hai bên.</p>
        <div className="flex flex-wrap gap-2">
          {remote.revision===0&&<button disabled={busy} onClick={()=>void choose("local")} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold">Nhập tiến độ máy lên Google</button>}
          {remote.revision>0&&<button disabled={busy} onClick={()=>void choose("remote")} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold">Dùng bản Google</button>}
          {remote.revision>0&&<button disabled={busy} onClick={()=>void choose("conservative")} className="rounded-lg border border-amber-500/50 px-3 py-2 text-xs font-semibold">Hợp nhất thận trọng (ưu tiên Cần ôn)</button>}
        </div>
      </div>}
      <button type="button" onClick={()=>void refresh().catch(()=>setNotice("Không thể cập nhật dữ liệu Google."))} className="text-left text-xs font-semibold text-indigo-600 dark:text-indigo-400">Làm mới thông tin đồng bộ</button>
      {notice&&<p role="status" className="text-xs text-[var(--muted-strong)]">{notice}</p>}
    </section>
  );
}
