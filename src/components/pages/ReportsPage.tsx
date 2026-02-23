"use client";
import { employees, payrollRecords, leaveRequests, performanceRecords, formatCurrency } from "@/lib/data";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const deptHeadcount = ["Engineering", "Design", "Marketing", "Sales", "HR", "Finance", "Operations"].map(dep => ({
    name: dep,
    value: employees.filter(e => e.department === dep).length,
})).filter(d => d.value > 0);

const leaveByType = ["Annual", "Sick", "Maternity", "Paternity", "Unpaid"].map(type => ({
    name: type,
    value: leaveRequests.filter(l => l.type === type).length,
})).filter(d => d.value > 0);

const COLORS = ["#6366f1", "#10b981", "#3b82f6", "#f59e0b", "#a855f7", "#ef4444", "#06b6d4"];

const salaryByDept = ["Engineering", "Design", "Marketing", "Sales", "HR", "Finance"].map(dep => ({
    department: dep,
    total: Math.round(employees.filter(e => e.department === dep).reduce((a, e) => a + e.salary / 12, 0) / 1000),
}));

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "8px 12px" }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>{label || payload[0].name}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--brand-400)" }}>{payload[0].value}</div>
            </div>
        );
    }
    return null;
};

export default function ReportsPage() {
    const totalPayroll = payrollRecords.filter(p => p.month === "January").reduce((a, b) => a + b.netPay, 0);
    const avgSalary = Math.round(employees.reduce((a, e) => a + e.salary, 0) / employees.length);

    return (
        <div className="fade-in">
            {/* Summary Stats */}
            <div className="stats-grid">
                {[
                    { label: "Total Headcount", value: employees.length, icon: "👥", color: "#6366f1" },
                    { label: "Monthly Payroll", value: formatCurrency(totalPayroll), icon: "💰", color: "#10b981" },
                    { label: "Avg Salary", value: formatCurrency(avgSalary), icon: "📊", color: "#3b82f6" },
                    { label: "Total Leave Days", value: leaveRequests.filter(l => l.status === "Approved").reduce((a, b) => a + b.days, 0), icon: "📅", color: "#f59e0b" },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <div className="stat-icon" style={{ background: `${s.color}18` }}><span>{s.icon}</span></div>
                        <div className="stat-value">{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid-2" style={{ marginBottom: 24 }}>
                {/* Headcount Pie */}
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Headcount by Department</div>
                        <button className="btn btn-ghost btn-sm">Export CSV</button>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={deptHeadcount} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                                {deptHeadcount.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Leave by Type */}
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Leave Requests by Type</div>
                        <button className="btn btn-ghost btn-sm">Export CSV</button>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={leaveByType} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Salary by Dept */}
            <div className="card" style={{ marginBottom: 24 }}>
                <div className="card-header">
                    <div className="card-title">Monthly Salary by Department (USD thousands)</div>
                    <button className="btn btn-ghost btn-sm">Export CSV</button>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={salaryByDept} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                        <XAxis dataKey="department" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} opacity={0.85} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Leave status breakdown */}
            <div className="grid-2">
                <div className="card">
                    <div className="card-title" style={{ marginBottom: 14 }}>Leave Status Breakdown</div>
                    {[
                        { label: "Approved", count: leaveRequests.filter(l => l.status === "Approved").length, color: "var(--status-success)" },
                        { label: "Pending", count: leaveRequests.filter(l => l.status === "Pending").length, color: "var(--status-warning)" },
                        { label: "Rejected", count: leaveRequests.filter(l => l.status === "Rejected").length, color: "var(--status-error)" },
                    ].map(s => (
                        <div key={s.label} style={{ marginBottom: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{s.label}</span>
                                <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.count}</span>
                            </div>
                            <div className="progress-bar" style={{ height: 8 }}>
                                <div className="progress-fill" style={{ width: `${(s.count / leaveRequests.length) * 100}%`, background: s.color }} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card">
                    <div className="card-title" style={{ marginBottom: 14 }}>Workforce by Role</div>
                    {[
                        { label: "HR Admin", count: employees.filter(e => e.role === "HR Admin").length, color: "var(--status-purple)" },
                        { label: "Manager", count: employees.filter(e => e.role === "Manager").length, color: "var(--status-info)" },
                        { label: "Employee", count: employees.filter(e => e.role === "Employee").length, color: "var(--text-secondary)" },
                    ].map(s => (
                        <div key={s.label} style={{ marginBottom: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{s.label}</span>
                                <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.count}</span>
                            </div>
                            <div className="progress-bar" style={{ height: 8 }}>
                                <div className="progress-fill" style={{ width: `${(s.count / employees.length) * 100}%`, background: s.color }} />
                            </div>
                        </div>
                    ))}

                    <hr className="divider" />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)" }}>
                        <span>Active: {employees.filter(e => e.status === "Active").length}</span>
                        <span>On Leave: {employees.filter(e => e.status === "On Leave").length}</span>
                        <span>Inactive: {employees.filter(e => e.status === "Inactive").length}</span>
                    </div>
                </div>
            </div>

            {/* Export buttons */}
            <div className="card" style={{ marginTop: 16 }}>
                <div className="card-title" style={{ marginBottom: 12 }}>Export Reports</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {["Employee Directory", "Payroll Summary", "Leave Report", "Performance Report", "GDPR Data Export"].map(name => (
                        <button key={name} className="btn btn-secondary" onClick={() => alert(`${name} export would download in production`)}>
                            ↓ {name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
