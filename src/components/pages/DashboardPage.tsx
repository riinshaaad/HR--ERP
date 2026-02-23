"use client";
import { employees, leaveRequests, performanceRecords, teamKPIs, performanceTrend, departmentPerformance, formatCurrency } from "@/lib/data";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const totalHeadcount = employees.filter(e => e.status === "Active").length;
const onLeave = employees.filter(e => e.status === "On Leave").length;
const pendingLeaves = leaveRequests.filter(l => l.status === "Pending").length;
const avgScore = Math.round(performanceRecords.reduce((a, b) => a + b.kpiScore, 0) / performanceRecords.length);

const recentActivity = [
    { label: "Priya Sharma submitted a leave request", time: "2 hours ago", icon: "📅" },
    { label: "Marcus Webb completed Q4 design goals", time: "5 hours ago", icon: "🎯" },
    { label: "Raj Nair's payslip generated for January", time: "1 day ago", icon: "💰" },
    { label: "Performance review cycle Q1 started", time: "2 days ago", icon: "📊" },
    { label: "David Kim approved for medical leave", time: "3 days ago", icon: "✅" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "8px 12px" }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--brand-400)" }}>{payload[0].value}</div>
            </div>
        );
    }
    return null;
};

export default function DashboardPage() {
    return (
        <div className="fade-in">
            {/* Stats */}
            <div className="stats-grid">
                {[
                    { label: "Total Employees", value: employees.length, icon: "👥", delta: "+2 this month", up: true, color: "#6366f1" },
                    { label: "Active Today", value: totalHeadcount, icon: "✅", delta: `${onLeave} on leave`, up: true, color: "#10b981" },
                    { label: "Pending Leaves", value: pendingLeaves, icon: "📅", delta: "Needs approval", up: false, color: "#f59e0b" },
                    { label: "Avg Performance", value: `${avgScore}`, icon: "📈", delta: "+3pts this quarter", up: true, color: "#3b82f6" },
                ].map((stat) => (
                    <div key={stat.label} className="stat-card">
                        <div className="stat-icon" style={{ background: `${stat.color}18` }}>
                            <span>{stat.icon}</span>
                        </div>
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                        <div className={`stat-delta ${stat.up ? "up" : "down"}`}>{stat.delta}</div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid-2" style={{ marginBottom: 24 }}>
                {/* Performance Trend */}
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Performance Trend</div>
                            <div className="card-subtitle">Average score over 6 months</div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={performanceTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                            <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} domain={[70, 100]} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fill="url(#perfGrad)" dot={{ fill: "#6366f1", r: 3 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Department Performance */}
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Department Scores</div>
                            <div className="card-subtitle">Q4 2025 averages</div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={departmentPerformance} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                            <XAxis dataKey="department" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} domain={[60, 100]} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} opacity={0.85} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid-2">
                {/* Recent Activity */}
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Recent Activity</div>
                        <button className="btn btn-ghost btn-sm">View all</button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {recentActivity.map((item, i) => (
                            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                                <div style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>
                                    {item.icon}
                                </div>
                                <div>
                                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{item.label}</div>
                                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{item.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* KPI overview */}
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Team KPIs</div>
                        <span className="badge badge-success">On Track</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {teamKPIs.map((kpi) => {
                            const pct = Math.min(100, Math.round((kpi.value / kpi.target) * 100));
                            const color = pct >= 100 ? "var(--status-success)" : pct >= 80 ? "var(--brand-500)" : "var(--status-warning)";
                            return (
                                <div key={kpi.name}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                        <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{kpi.name}</span>
                                        <span style={{ fontSize: 12, fontWeight: 600, color }}>
                                            {kpi.value}{kpi.unit} / {kpi.target}{kpi.unit}
                                        </span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <hr className="divider" />
                    <div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8 }}>Headcount by Department</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {["Engineering", "Design", "Marketing", "Sales", "HR", "Finance"].map((dep) => {
                                const count = employees.filter(e => e.department === dep).length;
                                return (
                                    <div key={dep} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", background: "var(--bg-elevated)", borderRadius: 99, fontSize: 11 }}>
                                        <span style={{ color: "var(--text-muted)" }}>{dep}</span>
                                        <span style={{ color: "var(--brand-400)", fontWeight: 600 }}>{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
