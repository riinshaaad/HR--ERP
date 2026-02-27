"use client";
import { useState } from "react";
import { employees, leaveRequests as initialLeaves, leaveBalances, LeaveRequest, LeaveType, getEmployee } from "@/lib/data";
import { useNotifications } from "@/contexts/NotificationContext";

const LEAVE_TYPES: LeaveType[] = ["Annual", "Sick", "Maternity", "Paternity", "Unpaid", "Compassionate"];

function statusBadge(status: string) {
    if (status === "Approved") return <span className="badge badge-success">Approved</span>;
    if (status === "Pending") return <span className="badge badge-warning">Pending</span>;
    if (status === "Rejected") return <span className="badge badge-error">Rejected</span>;
    return <span className="badge badge-default">{status}</span>;
}

function ApplyLeaveModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: Partial<LeaveRequest>) => void }) {
    const [form, setForm] = useState({ type: "Annual" as LeaveType, startDate: "", endDate: "", reason: "" });
    const days = form.startDate && form.endDate
        ? Math.max(1, Math.ceil((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / 86400000) + 1)
        : 0;

    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal">
                <div className="modal-header">
                    <span className="modal-title">Apply for Leave</span>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label>Leave Type</label>
                        <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as LeaveType }))}>
                            {LEAVE_TYPES.map(t => <option key={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="grid-cols-2">
                        <div className="form-group">
                            <label>Start Date</label>
                            <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label>End Date</label>
                            <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
                        </div>
                    </div>
                    {days > 0 && (
                        <div style={{ padding: "10px 14px", background: "var(--status-info-bg)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "var(--radius-md)", marginBottom: 14, fontSize: 13, color: "var(--status-info)" }}>
                            📅 This request covers <strong>{days} working day{days !== 1 ? "s" : ""}</strong>
                        </div>
                    )}
                    <div className="form-group">
                        <label>Reason</label>
                        <textarea rows={3} placeholder="Brief reason for leave..." style={{ resize: "none" }} value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} />
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={() => { onSubmit({ ...form, days }); onClose(); }}>
                        Submit Request
                    </button>
                </div>
            </div>
        </div>
    );
}

function LeaveCalendar({ leaves }: { leaves: LeaveRequest[] }) {
    const now = new Date(2026, 1, 1); // Feb 2026
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const dayLeaves: Record<number, LeaveRequest[]> = {};
    leaves.forEach(lr => {
        const start = new Date(lr.startDate);
        const end = new Date(lr.endDate);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            if (d.getFullYear() === year && d.getMonth() === month) {
                const day = d.getDate();
                if (!dayLeaves[day]) dayLeaves[day] = [];
                dayLeaves[day].push(lr);
            }
        }
    });

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    return (
        <div className="card">
            <div className="card-header">
                <div className="card-title">Leave Calendar — February 2026</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 8 }}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                    <div key={d} style={{ textAlign: "center", fontSize: 10, color: "var(--text-muted)", fontWeight: 600, padding: "4px 0" }}>{d}</div>
                ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
                {days.map((d, i) => {
                    const lv = d ? dayLeaves[d] || [] : [];
                    const today = d === 23;
                    return (
                        <div key={i} style={{
                            height: 44,
                            borderRadius: "var(--radius-sm)",
                            background: d ? (today ? "rgba(99,102,241,0.15)" : lv.length ? "rgba(245,158,11,0.12)" : "var(--bg-elevated)") : "transparent",
                            border: today ? "1px solid var(--brand-500)" : "1px solid transparent",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 4,
                            position: "relative",
                        }}>
                            {d && <>
                                <span style={{ fontSize: 12, fontWeight: today ? 700 : 400, color: today ? "var(--text-brand)" : "var(--text-secondary)" }}>{d}</span>
                                {lv.length > 0 && (
                                    <div style={{ display: "flex", gap: 2, marginTop: 2 }}>
                                        {lv.slice(0, 2).map((_, j) => <div key={j} style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--status-warning)" }} />)}
                                        {lv.length > 2 && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--status-info)" }} />}
                                    </div>
                                )}
                            </>}
                        </div>
                    );
                })}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 12, fontSize: 11, color: "var(--text-muted)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--brand-500)" }} />Today</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--status-warning)" }} />Leave</span>
            </div>
        </div>
    );
}

export default function LeavePage() {
    const [leaves, setLeaves] = useState<LeaveRequest[]>(initialLeaves);
    const [applying, setApplying] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [selectedEmployee, setSelectedEmployee] = useState("all");
    const { addNotification } = useNotifications();

    const me = employees[0];
    const myBalance = leaveBalances.find(lb => lb.employeeId === me.id)!;

    const handleSubmit = (data: Partial<LeaveRequest>) => {
        const newReq: LeaveRequest = {
            id: `lv-${Date.now()}`,
            employeeId: me.id,
            type: data.type || "Annual",
            startDate: data.startDate || "",
            endDate: data.endDate || "",
            days: data.days || 1,
            reason: data.reason || "",
            status: "Pending",
            approverId: "emp-002",
            appliedDate: new Date().toISOString().split("T")[0],
        };
        setLeaves(prev => [newReq, ...prev]);
        addNotification(`New ${newReq.type} leave requested by ${me.name} (${newReq.days} day${newReq.days !== 1 ? 's' : ''})`);
    };

    const handleApprove = (id: string) => setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: "Approved" } : l));
    const handleReject = (id: string) => setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: "Rejected" } : l));

    const filtered = leaves.filter(l => {
        const tabOk = activeTab === "all" || l.status.toLowerCase() === activeTab;
        const empOk = selectedEmployee === "all" || l.employeeId === selectedEmployee;
        return tabOk && empOk;
    });

    return (
        <div className="fade-in">
            {/* Balance Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px,1fr))", gap: 12, marginBottom: 24 }}>
                {[
                    { label: "Annual Leave", value: myBalance.annual, total: 20, color: "#6366f1" },
                    { label: "Sick Leave", value: myBalance.sick, total: 10, color: "#10b981" },
                    { label: "Paternity", value: myBalance.paternity, total: 14, color: "#3b82f6" },
                    { label: "Compassionate", value: myBalance.compassionate, total: 5, color: "#a855f7" },
                    { label: "Unpaid Leave", value: myBalance.unpaid, total: 30, color: "#f59e0b" },
                ].map(b => (
                    <div key={b.label} className="card" style={{ padding: 16 }}>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8 }}>{b.label}</div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: b.color }}>{b.value}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8 }}>of {b.total} days</div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${Math.round((b.value / b.total) * 100)}%`, background: b.color }} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid-2">
                {/* Left — requests */}
                <div style={{ gridColumn: "1 / 2" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <div className="tab-group" style={{ marginBottom: 0 }}>
                            {["all", "pending", "approved", "rejected"].map(t => (
                                <button key={t} className={`tab-btn ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>
                        <button className="btn btn-primary btn-sm" onClick={() => setApplying(true)}>+ Apply</button>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                        <select style={{ width: "auto" }} value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)}>
                            <option value="all">All Employees</option>
                            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {filtered.length === 0 && (
                            <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)", fontSize: 13 }}>
                                No leave requests found
                            </div>
                        )}
                        {filtered.map(lr => {
                            const emp = getEmployee(lr.employeeId);
                            const approver = lr.approverId ? getEmployee(lr.approverId) : null;
                            return (
                                <div key={lr.id} className="card" style={{ padding: 16 }}>
                                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                            <div className="avatar avatar-md">{emp?.avatar}</div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 13 }}>{emp?.name}</div>
                                                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                                                    {lr.type} Leave · {lr.days} day{lr.days !== 1 ? "s" : ""}
                                                </div>
                                            </div>
                                        </div>
                                        {statusBadge(lr.status)}
                                    </div>

                                    <div style={{ margin: "12px 0", padding: "10px", background: "var(--bg-elevated)", borderRadius: "var(--radius-sm)", fontSize: 12, color: "var(--text-secondary)" }}>
                                        📅 {lr.startDate} → {lr.endDate}
                                        <span style={{ marginLeft: 8, color: "var(--text-muted)" }}>· Applied {lr.appliedDate}</span>
                                    </div>

                                    {lr.reason && (
                                        <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 12, fontStyle: "italic" }}>
                                            "{lr.reason}"
                                        </div>
                                    )}

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                                            {approver ? `Approver: ${approver.name}` : "No approver"}
                                        </span>
                                        {lr.status === "Pending" && (
                                            <div style={{ display: "flex", gap: 8 }}>
                                                <button className="btn btn-sm" style={{ background: "var(--status-error-bg)", color: "var(--status-error)", border: "1px solid rgba(239,68,68,0.2)" }} onClick={() => handleReject(lr.id)}>
                                                    Reject
                                                </button>
                                                <button className="btn btn-sm" style={{ background: "var(--status-success-bg)", color: "var(--status-success)", border: "1px solid rgba(16,185,129,0.2)" }} onClick={() => handleApprove(lr.id)}>
                                                    Approve
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right — calendar */}
                <div>
                    <LeaveCalendar leaves={leaves} />

                    {/* Summary */}
                    <div className="card" style={{ marginTop: 16 }}>
                        <div className="card-title" style={{ marginBottom: 12 }}>Leave Summary</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {[
                                { label: "Total Requests This Month", value: leaves.filter(l => l.appliedDate?.startsWith("2026-02")).length },
                                { label: "Pending Approval", value: leaves.filter(l => l.status === "Pending").length },
                                { label: "Approved", value: leaves.filter(l => l.status === "Approved").length },
                                { label: "Rejected", value: leaves.filter(l => l.status === "Rejected").length },
                            ].map(s => (
                                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-secondary)" }}>
                                    <span>{s.label}</span>
                                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {applying && <ApplyLeaveModal onClose={() => setApplying(false)} onSubmit={handleSubmit} />}
        </div>
    );
}
