"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Users, KeyRound } from "lucide-react";
import { useAccount } from "@/lib/auth/AccountProvider";
import { useConfirm } from "@/components/ui/ConfirmDialog";

interface AccountRow { id: string; email: string; name: string; role: "user" | "admin" }
async function api(path: string, method = "GET", data?: unknown): Promise<{ ok: boolean; [key: string]: unknown }> {
  const response = await fetch(path, { method, credentials: "same-origin", cache: "no-store", ...(method === "POST" ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(data ?? {}) } : {}) });
  const result = await response.json() as { ok: boolean; [key: string]: unknown };
  if (!response.ok || !result.ok) throw new Error(String(result.code || "REQUEST_FAILED"));
  return result;
}
export function AdminAccountPanel() {
  const { user, refresh } = useAccount();
  const confirm = useConfirm();
  const [elevated, setElevated] = useState(false);
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [users, setUsers] = useState<AccountRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (user?.role !== "admin") return;
    void api("/api/admin/status").then(data => setElevated(data.elevated === true)).catch(() => {});
  }, [user]);
  async function stepUp() {
    if (!user || busy) return;
    setBusy(true);
    try {
      await api("/api/admin/step-up", "POST", { password });
      setPassword(""); setElevated(true);
      const data = await api("/api/admin/users");
      setUsers(data.users as AccountRow[]);
      setNotice("Đã xác thực nâng cao. Phiên quản trị có hiệu lực tối đa 15 phút.");
    } catch { setNotice("Không thể xác thực nâng cao. Mật khẩu không đúng, phiên hết hạn hoặc tài khoản bị tạm khóa."); }
    finally { setBusy(false); }
  }
  async function changeRole(target: AccountRow) {
    if (!user || !elevated || busy) return;
    const newRole = target.role === "admin" ? "user" : "admin";
    const allowed = await confirm({
      title: newRole === "admin" ? "Cấp quyền admin?" : "Thu hồi quyền admin?",
      message: `Tài khoản ${target.email} sẽ ${newRole === "admin" ? "được phép" : "không còn được phép"} quản trị và xuất bản nội dung. Hệ thống kiểm tra lại vai trò tại server mỗi lần thao tác.`,
      confirmText: newRole === "admin" ? "Cấp quyền" : "Thu hồi",
      cancelText: "Hủy", variant: "warning",
    });
    if (!allowed) return;
    setBusy(true);
    try {
      await api("/api/admin/roles", "POST", { targetUserId: target.id, role: newRole, password, otp });
      setPassword(""); setOtp("");
      const data = await api("/api/admin/users");
      setUsers(data.users as AccountRow[]);
      await refresh();
      setNotice("Đã cập nhật quyền và lưu sự kiện quản trị.");
    } catch { setNotice("Không cập nhật được quyền. Kiểm tra mật khẩu, TOTP hoặc quyền admin cuối cùng."); }
    finally { setBusy(false); }
  }
  if (!user || user.role !== "admin") return null;
  return (
    <section id="administration" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-3" aria-label="Quản trị tài khoản">
      <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-indigo-500" /><h2 className="text-base font-semibold">Quản trị tài khoản</h2></div>
      <p className="text-xs text-[var(--muted-strong)]">Bạn có quyền admin. Khi xuất bản, dùng phiên xác thực mật khẩu 15 phút. Cấp hoặc thu hồi quyền admin luôn yêu cầu thêm TOTP.</p>
      {!elevated && (
        <div className="flex flex-wrap gap-2">
          <label className="flex-1 min-w-44 text-xs font-semibold space-y-1"><span>Mật khẩu quản trị QuantaVault</span><input type="password" autoComplete="off" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2" /></label>
          <div className="flex items-end">
            <button type="button" disabled={busy||!password} onClick={() => void stepUp()} className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40"><KeyRound className="mr-1 inline h-4 w-4"/> Xác thực 15 phút</button>
          </div>
        </div>
      )}
      {elevated && user.role === "admin" && (
        <div className="space-y-3">
          <p className="text-xs font-semibold"><Users className="mr-1 inline h-4 w-4" /> Phân quyền tài khoản Google</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="space-y-1 text-xs"><span>Mật khẩu quản trị (chỉ khi cấp/thu hồi quyền)</span><input type="password" autoComplete="off" value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded-lg border border-[var(--border)] px-3 py-2 bg-[var(--background)]"/></label>
            <label className="space-y-1 text-xs"><span>TOTP (6 số)</span><input inputMode="numeric" maxLength={6} value={otp} onChange={e=>setOtp(e.target.value)} className="w-full rounded-lg border border-[var(--border)] px-3 py-2 bg-[var(--background)]"/></label>
          </div>
          <button type="button" className="text-xs font-semibold text-indigo-600" onClick={() => void api("/api/admin/users").then(d=>setUsers(d.users as AccountRow[])).catch(()=>setNotice("Không thể tải danh sách tài khoản."))}>Tải lại danh sách</button>
          <div className="max-h-72 overflow-auto space-y-2">
            {users.map(target => <div key={target.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-[var(--border)] p-2 text-xs">
              <div className="min-w-0 flex-1"><p className="truncate font-semibold">{target.name} · {target.role}</p><p className="truncate text-[var(--muted)]">{target.email}</p></div>
              <button type="button" disabled={busy||!password||!/^\d{6}$/.test(otp)} onClick={() => void changeRole(target)} className="rounded-lg border border-[var(--border)] px-3 py-2 font-semibold disabled:opacity-40">{target.role==="admin"?"Thu hồi admin":"Cấp admin"}</button>
            </div>)}
          </div>
        </div>
      )}
      {notice && <p role="status" className="text-xs text-[var(--muted-strong)]">{notice}</p>}
    </section>
  );
}
