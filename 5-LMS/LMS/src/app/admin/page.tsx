'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Users,
  BookOpen,
  DollarSign,
  KeyRound,
  CheckCircle2,
  Trash2,
  Plus,
  Activity,
  Award,
  Zap,
  Lock,
  Unlock,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'invitations' | 'users' | 'audit'>('overview');
  const [loading, setLoading] = useState(true);

  // Form tạo mã mời mới
  const [newInviteCode, setNewInviteCode] = useState('');
  const [newInviteMaxUses, setNewInviteMaxUses] = useState('10');
  const [newInviteExpiry, setNewInviteExpiry] = useState('');
  const [creatingInvite, setCreatingInvite] = useState(false);

  const fetchAdminData = async () => {
    try {
      const [statsRes, invRes, usersRes, auditRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/invitations'),
        fetch('/api/admin/users'),
        fetch('/api/admin/audit-logs'),
      ]);

      if (statsRes.status === 403 || statsRes.status === 401) {
        alert('Chỉ tài khoản Quản trị viên mới được truy cập trang này. Vui lòng đăng nhập với tài khoản admin.');
        router.push('/login');
        return;
      }

      const [statsData, invData, usersData, auditData] = await Promise.all([
        statsRes.json(),
        invRes.json(),
        usersRes.json(),
        auditRes.json(),
      ]);

      setStats(statsData);
      setInvitations(invData.invitations || []);
      setUsers(usersData.users || []);
      setAuditLogs(auditData.logs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingInvite(true);
    try {
      const res = await fetch('/api/admin/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newInviteCode || undefined,
          maxUses: parseInt(newInviteMaxUses, 10),
          expiresAt: newInviteExpiry || undefined,
        }),
      });

      if (res.ok) {
        setNewInviteCode('');
        await fetchAdminData();
      } else {
        const err = await res.json();
        alert(err.error || 'Lỗi khi tạo mã mời');
      }
    } catch (e) {
      alert('Lỗi kết nối máy chủ');
    } finally {
      setCreatingInvite(false);
    }
  };

  const handleRevokeInvite = async (id: string) => {
    if (!confirm('Bạn có chắc muốn thu hồi mã mời này? Học viên sẽ không thể đăng ký bằng mã này nữa.')) return;
    try {
      const res = await fetch(`/api/admin/invitations?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleEntitlement = async (userId: string, courseId: string, currentActive: boolean) => {
    const action = currentActive ? 'revoke' : 'grant';
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, courseId, action }),
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-xs text-slate-400">
        Đang xác thực quyền Quản trị viên...
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="flex-1 py-10 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 uppercase tracking-wider inline-flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Quản Trị Hệ Thống Private
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Trung Tâm Điều Hành Học Thuật
            </h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'overview' ? 'bg-slate-900 text-white font-semibold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Tổng Quan
            </button>
            <button
              onClick={() => setActiveTab('invitations')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'invitations' ? 'bg-slate-900 text-white font-semibold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Mã Mời ({invitations.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'users' ? 'bg-slate-900 text-white font-semibold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Học Viên & Quyền Hạn
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'audit' ? 'bg-slate-900 text-white font-semibold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Nhật Ký Kiểm Toán
            </button>
          </div>
        </div>

        {/* Tab 1: Overview Dashboard */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">Doanh Thu Đã Nhận</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {formatPrice(stats.stats.totalRevenue)}
                </div>
                <p className="text-[11px] text-emerald-600 font-medium">Qua cổng VietQR / SePay</p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">Học Viên Kích Hoạt</span>
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {stats.stats.totalUsers} thành viên
                </div>
                <p className="text-[11px] text-slate-500">Đã đăng ký qua mã mời</p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">Đơn Hàng Thành Công</span>
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {stats.stats.paidOrders} / {stats.stats.totalOrders} đơn
                </div>
                <p className="text-[11px] text-slate-500">Tỷ lệ thanh toán hoàn tất cao</p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">Lượt Hoàn Thành Bài</span>
                  <Award className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {stats.stats.totalCompletions} lượt học
                </div>
                <p className="text-[11px] text-amber-700 font-medium">{stats.stats.totalQuizPassed} bài quiz đạt chuẩn</p>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Các Đơn Hàng Gần Đây</h3>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                      <th className="py-3 px-4">Mã Đơn</th>
                      <th className="py-3 px-4">Học Viên</th>
                      <th className="py-3 px-4">Sản Phẩm</th>
                      <th className="py-3 px-4">Số Tiền</th>
                      <th className="py-3 px-4">Trạng Thái</th>
                      <th className="py-3 px-4">Thời Gian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {stats.recentOrders?.map((ord: any) => (
                      <tr key={ord.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{ord.order_code}</td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-slate-900">{ord.full_name}</p>
                          <p className="text-[10px] text-slate-400">{ord.email}</p>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">{ord.product_title}</td>
                        <td className="py-3 px-4 font-bold text-blue-700">{formatPrice(ord.total_amount)}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ord.status === 'paid'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {ord.status === 'paid' ? 'Đã Thanh Toán' : 'Chờ Thanh Toán'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {new Date(ord.created_at).toLocaleString('vi-VN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Manage Invitations */}
        {activeTab === 'invitations' && (
          <div className="space-y-8">
            {/* Form tạo mã mời */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                Tạo Mã Mời Nhập Học Mới
              </h3>
              <form onSubmit={handleCreateInvite} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Mã mời (Tùy chọn)</label>
                  <input
                    type="text"
                    value={newInviteCode}
                    onChange={(e) => setNewInviteCode(e.target.value.toUpperCase())}
                    placeholder="VD: LMS-ACADEMIC-2026"
                    className="w-full p-2.5 rounded-xl border border-slate-200 uppercase font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Số lượt sử dụng tối đa</label>
                  <input
                    type="number"
                    value={newInviteMaxUses}
                    onChange={(e) => setNewInviteMaxUses(e.target.value)}
                    min={1}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Hạn sử dụng (Tùy chọn)</label>
                  <input
                    type="date"
                    value={newInviteExpiry}
                    onChange={(e) => setNewInviteExpiry(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={creatingInvite}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold text-xs shadow-xs"
                  >
                    {creatingInvite ? 'Đang tạo...' : 'Tạo Mã Mời'}
                  </button>
                </div>
              </form>
            </div>

            {/* Danh sách mã mời */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Danh Sách Mã Mời Khả Dụng</h3>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                      <th className="py-3 px-4">Mã Mời</th>
                      <th className="py-3 px-4">Lượt Sử Dụng</th>
                      <th className="py-3 px-4">Người Tạo</th>
                      <th className="py-3 px-4">Hạn Dùng</th>
                      <th className="py-3 px-4">Trạng Thái</th>
                      <th className="py-3 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {invitations.map((inv: any) => (
                      <tr key={inv.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 font-mono font-bold text-blue-900 text-sm">{inv.code}</td>
                        <td className="py-3 px-4 font-medium">
                          {inv.used_count} / {inv.max_uses} lượt
                        </td>
                        <td className="py-3 px-4">{inv.creator_name || 'Hệ thống'}</td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                          {inv.expires_at ? new Date(inv.expires_at).toLocaleDateString('vi-VN') : 'Vĩnh viễn'}
                        </td>
                        <td className="py-3 px-4">
                          {inv.is_revoked === 1 ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700">
                              Đã Thu Hồi
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                              Hoạt Động
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {inv.is_revoked === 0 && (
                            <button
                              onClick={() => handleRevokeInvite(inv.id)}
                              className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-medium"
                              title="Thu hồi mã mời"
                            >
                              Thu Hồi
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Users & Entitlements Management */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900">
              Quản Lý Tài Khoản & Cấp/Thu Hồi Quyền Thủ Công
            </h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                    <th className="py-3 px-4">Học Viên</th>
                    <th className="py-3 px-4">Vai Trò</th>
                    <th className="py-3 px-4">Khóa Học Đã Cấp Quyền</th>
                    <th className="py-3 px-4">Cấp Quyền Khóa Học (Thủ Công)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {users.map((u: any) => (
                    <tr key={u.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{u.full_name}</p>
                        <p className="text-[10px] text-slate-400">{u.email}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            u.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 space-y-1">
                        {u.entitlements?.length === 0 ? (
                          <span className="text-slate-400 text-[11px]">Chưa có khóa học nào</span>
                        ) : (
                          u.entitlements?.map((ent: any) => (
                            <div key={ent.id} className="flex items-center gap-1.5 text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="font-medium text-slate-800">{ent.course_title}</span>
                              <span className="text-[9px] text-slate-400">({ent.source_type})</span>
                            </div>
                          ))
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleEntitlement(u.id, 'crs_ai_agent_001', false)}
                            className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-[11px]"
                          >
                            + Cấp Khóa AI Agent
                          </button>
                          <button
                            onClick={() => handleToggleEntitlement(u.id, 'crs_arch_002', false)}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px]"
                          >
                            + Cấp Microservices
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Audit Logs */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              Nhật Ký Kiểm Toán Toàn Hệ Thống (Audit Logs)
            </h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                    <th className="py-3 px-4">Hành Động</th>
                    <th className="py-3 px-4">Đối Tượng</th>
                    <th className="py-3 px-4">Chi Tiết</th>
                    <th className="py-3 px-4">Thời Gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {auditLogs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-mono font-bold text-blue-800 text-[11px]">
                        {log.action}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {log.target_type} ({log.target_id})
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate font-mono text-[10px]">
                        {log.details}
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(log.created_at).toLocaleString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
