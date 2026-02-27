"use client";
import { useState } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import {
    employees, performanceRecords, teamKPIs, performanceTrend, departmentPerformance,
    getEmployee, ratingColor, PerformanceRating, PerformanceRecord
} from "@/lib/data";
import {
    RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area
} from "recharts";

const QUARTERS = ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025", "Q1 2026"];

const radarData = [
    { subject: "Delivery", A: 92, B: 85 },
    { subject: "Quality", A: 88, B: 79 },
    { subject: "Collab", A: 80, B: 88 },
    { subject: "Growth", A: 75, B: 82 },
    { subject: "Initiative", A: 90, B: 70 },
];

function RatingBadge({ rating }: { rating: PerformanceRating }) {
    const color = ratingColor(rating);
    return (
        <span className="badge" style={{ background: `${color}20`, color }}>
            {rating}
        </span>
    );
}

function ReviewModal({ record, onClose }: { record: PerformanceRecord; onClose: () => void }) {
    const emp = getEmployee(record.employeeId);
    const reviewer = getEmployee(record.reviewerId);
    return (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal" style={{ maxWidth: 600 }}>
                <div className="modal-header">
                    <span className="modal-title">Performance Review — {record.period}</span>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">
                    <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20 }}>
                        <div className="avatar avatar-lg">{emp?.avatar}</div>
                        <div>
                            <div style={{ fontSize: 16, fontWeight: 700 }}>{emp?.name}</div>
                            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{emp?.jobTitle} · Reviewed by {reviewer?.name}</div>
                            <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
                                <RatingBadge rating={record.rating} />
                                <span style={{ fontSize: 22, fontWeight: 800, color: ratingColor(record.rating) }}>{record.kpiScore}<span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 400 }}>/100</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Score bar */}
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: "var(--text-muted)" }}>
                            <span>Overall KPI Score</span><span style={{ fontWeight: 600 }}>{record.kpiScore}%</span>
                        </div>
                        <div className="progress-bar" style={{ height: 10 }}>
                            <div className="progress-fill" style={{ width: `${record.kpiScore}%`, background: ratingColor(record.rating) }} />
                        </div>
                    </div>

                    {/* Goals */}
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Goals</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {record.goals.map(goal => {
                                const statusColor = goal.status === "Completed" ? "var(--status-success)" : goal.status === "At Risk" ? "var(--status-error)" : goal.status === "In Progress" ? "var(--status-info)" : "var(--text-muted)";
                                return (
                                    <div key={goal.id} style={{ padding: "12px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                            <span style={{ fontWeight: 600, fontSize: 13 }}>{goal.title}</span>
                                            <span className="badge" style={{ background: `${statusColor}20`, color: statusColor, fontSize: 10 }}>{goal.status}</span>
                                        </div>
                                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8 }}>{goal.description} · Due {goal.dueDate}</div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${goal.progress}%`, background: statusColor }} />
                                        </div>
                                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{goal.progress}% complete</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Feedback */}
                    <div style={{ padding: "14px", background: "rgba(99,102,241,0.06)", border: "1px solid var(--border-brand)", borderRadius: "var(--radius-md)" }}>
                        <div style={{ fontSize: 11, color: "var(--text-brand)", marginBottom: 6, fontWeight: 600 }}>Manager Feedback</div>
                        <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, fontStyle: "italic" }}>
                            "{record.feedback}"
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>— {reviewer?.name} · {record.reviewDate}</div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Close</button>
                    <button className="btn btn-primary">Edit Review</button>
                </div>
            </div>
        </div>
    );
}

function AddGoalModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (title: string, empName: string) => void }) {
    const [title, setTitle] = useState("");
    const [empId, setEmpId] = useState(employees[0].id);

    return (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal">
                <div className="modal-header">
                    <span className="modal-title">Set New Goal</span>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label>Employee</label>
                        <select value={empId} onChange={e => setEmpId(e.target.value)}>
                            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Goal Title</label>
                        <input placeholder="e.g. Increase API Response Speed" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea rows={3} placeholder="Describe the goal and success criteria..." style={{ resize: "none" }} />
                    </div>
                    <div className="grid-cols-2">
                        <div className="form-group">
                            <label>Quarter / Period</label>
                            <select>{QUARTERS.map(q => <option key={q}>{q}</option>)}</select>
                        </div>
                        <div className="form-group">
                            <label>Due Date</label>
                            <input type="date" />
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={() => {
                        const empName = employees.find(e => e.id === empId)?.name || "Employee";
                        onSubmit(title, empName);
                        onClose();
                    }}>Create Goal</button>
                </div>
            </div>
        </div>
    );
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "8px 12px" }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--brand-400)" }}>{payload[0].value}</div>
            </div>
        );
    }
    return null;
};

export default function PerformancePage() {
    const [activeTab, setActiveTab] = useState("overview");
    const [selectedReview, setSelectedReview] = useState<PerformanceRecord | null>(null);
    const [addingGoal, setAddingGoal] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState("Q4 2025");
    const { addNotification } = useNotifications();

    const filtered = performanceRecords.filter(r => selectedPeriod === "All" || r.period === selectedPeriod);
    const topPerformers = [...performanceRecords].sort((a, b) => b.kpiScore - a.kpiScore).slice(0, 3);

    return (
        <div className="fade-in">
            {/* Tabs */}
            <div className="tab-group">
                {["overview", "reviews", "goals", "analytics"].map(t => (
                    <button key={t} className={`tab-btn ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {/* ─── OVERVIEW TAB ─── */}
            {activeTab === "overview" && (
                <div>
                    {/* KPI Stats */}
                    <div className="stats-grid">
                        {[
                            { label: "Avg Team Score", value: "86.2", icon: "📊", color: "#6366f1" },
                            { label: "Reviews Completed", value: performanceRecords.length, icon: "✅", color: "#10b981" },
                            { label: "Goals In Progress", value: performanceRecords.flatMap(r => r.goals).filter(g => g.status === "In Progress").length, icon: "🎯", color: "#3b82f6" },
                            { label: "At Risk Goals", value: performanceRecords.flatMap(r => r.goals).filter(g => g.status === "At Risk").length, icon: "⚠️", color: "#f59e0b" },
                        ].map(s => (
                            <div key={s.label} className="stat-card">
                                <div className="stat-icon" style={{ background: `${s.color}18` }}><span>{s.icon}</span></div>
                                <div className="stat-value">{s.value}</div>
                                <div className="stat-label">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="grid-2" style={{ marginBottom: 24 }}>
                        {/* Trend */}
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Performance Trend</div>
                                <div className="card-subtitle">6-month rolling average</div>
                            </div>
                            <ResponsiveContainer width="100%" height={200}>
                                <AreaChart data={performanceTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="pg2" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} domain={[70, 100]} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5} fill="url(#pg2)" dot={{ fill: "#6366f1", r: 3 }} activeDot={{ r: 5 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Radar */}
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Competency Radar</div>
                                <div className="card-subtitle">Team avg vs. target</div>
                            </div>
                            <ResponsiveContainer width="100%" height={200}>
                                <RadarChart data={radarData}>
                                    <PolarGrid stroke="rgba(255,255,255,0.06)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#6b7280", fontSize: 11 }} />
                                    <Radar name="Team" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
                                    <Radar name="Target" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} strokeDasharray="4 2" />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Performers */}
                    <div className="card" style={{ marginBottom: 24 }}>
                        <div className="card-header">
                            <div className="card-title">🌟 Top Performers — Q4 2025</div>
                            <span className="badge badge-success">Exceptional</span>
                        </div>
                        <div style={{ display: "flex", gap: 16 }}>
                            {topPerformers.map((record, i) => {
                                const emp = getEmployee(record.employeeId);
                                return (
                                    <div key={record.id} style={{ flex: 1, padding: "16px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", textAlign: "center", border: i === 0 ? "1px solid var(--border-brand)" : "1px solid transparent" }}>
                                        <div style={{ fontSize: 18, marginBottom: 8 }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</div>
                                        <div className="avatar avatar-md" style={{ margin: "0 auto 8px" }}>{emp?.avatar}</div>
                                        <div style={{ fontWeight: 600, fontSize: 13 }}>{emp?.name}</div>
                                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8 }}>{emp?.department}</div>
                                        <div style={{ fontSize: 22, fontWeight: 800, color: ratingColor(record.rating) }}>{record.kpiScore}</div>
                                        <RatingBadge rating={record.rating} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dept breakdown */}
                    <div className="card">
                        <div className="card-header"><div className="card-title">Department Breakdown</div></div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {departmentPerformance.map(dep => (
                                <div key={dep.department}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{dep.department}</span>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: dep.score >= 90 ? "var(--status-success)" : dep.score >= 80 ? "var(--brand-400)" : "var(--status-warning)" }}>{dep.score}</span>
                                    </div>
                                    <div className="progress-bar" style={{ height: 8 }}>
                                        <div className="progress-fill" style={{
                                            width: `${dep.score}%`,
                                            background: dep.score >= 90 ? "var(--status-success)" : dep.score >= 80 ? "var(--brand-500)" : "var(--status-warning)"
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ─── REVIEWS TAB ─── */}
            {activeTab === "reviews" && (
                <div>
                    <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }}>
                        <select style={{ width: "auto" }} value={selectedPeriod} onChange={e => setSelectedPeriod(e.target.value)}>
                            <option value="All">All Periods</option>
                            {QUARTERS.map(q => <option key={q}>{q}</option>)}
                        </select>
                        <button className="btn btn-primary" style={{ marginLeft: "auto" }}>+ Start Review Cycle</button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                        {filtered.map(record => {
                            const emp = getEmployee(record.employeeId);
                            const reviewer = getEmployee(record.reviewerId);
                            const completedGoals = record.goals.filter(g => g.status === "Completed").length;
                            return (
                                <div key={record.id} className="card" style={{ cursor: "pointer" }} onClick={() => setSelectedReview(record)}>
                                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                                        <div className="avatar avatar-md">{emp?.avatar}</div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: 13 }}>{emp?.name}</div>
                                            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{emp?.department} · {record.period}</div>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                        <span style={{ fontSize: 28, fontWeight: 800, color: ratingColor(record.rating) }}>{record.kpiScore}</span>
                                        <RatingBadge rating={record.rating} />
                                    </div>

                                    <div className="progress-bar" style={{ marginBottom: 10, height: 6 }}>
                                        <div className="progress-fill" style={{ width: `${record.kpiScore}%`, background: ratingColor(record.rating) }} />
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)" }}>
                                        <span>{completedGoals}/{record.goals.length} goals done</span>
                                        <span>By {reviewer?.name?.split(" ")[0]}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ─── GOALS TAB ─── */}
            {activeTab === "goals" && (
                <div>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
                        <button className="btn btn-primary" onClick={() => setAddingGoal(true)}>+ Set Goal</button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {performanceRecords.flatMap(r => r.goals.map(g => ({ ...g, employeeId: r.employeeId }))).map(goal => {
                            const emp = getEmployee(goal.employeeId);
                            const statusColor = goal.status === "Completed" ? "var(--status-success)" : goal.status === "At Risk" ? "var(--status-error)" : goal.status === "In Progress" ? "var(--status-info)" : "var(--text-muted)";
                            return (
                                <div key={goal.id} className="card" style={{ padding: 16 }}>
                                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                                        <div className="avatar avatar-sm">{emp?.avatar}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                                <span style={{ fontWeight: 600, fontSize: 13 }}>{goal.title}</span>
                                                <span className="badge" style={{ background: `${statusColor}20`, color: statusColor }}>{goal.status}</span>
                                            </div>
                                            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10 }}>
                                                {emp?.name} · Due {goal.dueDate} · {goal.description}
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <div className="progress-bar" style={{ flex: 1 }}>
                                                    <div className="progress-fill" style={{ width: `${goal.progress}%`, background: statusColor }} />
                                                </div>
                                                <span style={{ fontSize: 12, fontWeight: 600, color: statusColor, flexShrink: 0 }}>{goal.progress}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ─── ANALYTICS TAB ─── */}
            {activeTab === "analytics" && (
                <div>
                    <div className="grid-2">
                        <div className="card">
                            <div className="card-header"><div className="card-title">Score Distribution</div></div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
                                {[
                                    { label: "Exceptional (90–100)", count: performanceRecords.filter(r => r.kpiScore >= 90).length, color: "var(--status-success)" },
                                    { label: "Exceeds (80–89)", count: performanceRecords.filter(r => r.kpiScore >= 80 && r.kpiScore < 90).length, color: "var(--status-info)" },
                                    { label: "Meets (70–79)", count: performanceRecords.filter(r => r.kpiScore >= 70 && r.kpiScore < 80).length, color: "var(--status-warning)" },
                                    { label: "Needs Improvement (<70)", count: performanceRecords.filter(r => r.kpiScore < 70).length, color: "var(--status-error)" },
                                ].map(d => (
                                    <div key={d.label}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{d.label}</span>
                                            <span style={{ fontSize: 12, fontWeight: 700, color: d.color }}>{d.count}</span>
                                        </div>
                                        <div className="progress-bar" style={{ height: 8 }}>
                                            <div className="progress-fill" style={{ width: `${(d.count / performanceRecords.length) * 100}%`, background: d.color }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header"><div className="card-title">KPI Trend (6 Months)</div></div>
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={performanceTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} domain={[70, 100]} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: "#6366f1", r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Individual scores */}
                    <div className="card" style={{ marginTop: 16 }}>
                        <div className="card-header"><div className="card-title">Individual KPI Scores — {selectedPeriod}</div></div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {[...performanceRecords].sort((a, b) => b.kpiScore - a.kpiScore).map(record => {
                                const emp = getEmployee(record.employeeId);
                                return (
                                    <div key={record.id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                        <div className="avatar avatar-sm">{emp?.avatar}</div>
                                        <span style={{ width: 130, fontSize: 12, fontWeight: 600 }}>{emp?.name}</span>
                                        <div className="progress-bar" style={{ flex: 1, height: 8 }}>
                                            <div className="progress-fill" style={{ width: `${record.kpiScore}%`, background: ratingColor(record.rating) }} />
                                        </div>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: ratingColor(record.rating), width: 36, textAlign: "right" }}>{record.kpiScore}</span>
                                        <RatingBadge rating={record.rating} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Improvement alerts (private, constructive) */}
                    <div className="card" style={{ marginTop: 16 }}>
                        <div className="card-header">
                            <div>
                                <div className="card-title">🌱 Growth Opportunities</div>
                                <div className="card-subtitle">Private, constructive notices — visible only to HR and respective managers</div>
                            </div>
                        </div>
                        {performanceRecords.filter(r => r.kpiScore < 85).map(record => {
                            const emp = getEmployee(record.employeeId);
                            return (
                                <div key={record.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", marginBottom: 8, border: "1px solid rgba(245,158,11,0.15)" }}>
                                    <span style={{ fontSize: 20 }}>💡</span>
                                    <div>
                                        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{emp?.name} — {emp?.department}</div>
                                        <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 3 }}>
                                            Score <strong style={{ color: "var(--status-warning)" }}>{record.kpiScore}</strong> — Consider scheduling a 1:1 to align on Q1 2026 goals and identify support needed.
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {selectedReview && <ReviewModal record={selectedReview} onClose={() => setSelectedReview(null)} />}
            {addingGoal && <AddGoalModal onClose={() => setAddingGoal(false)} onSubmit={(title, empName) => {
                addNotification(`New goal "${title || "Untitled"}" set for ${empName}`);
            }} />}
        </div>
    );
}
