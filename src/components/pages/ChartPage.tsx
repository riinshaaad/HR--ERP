"use client";
import React, { useState, useMemo, useEffect } from "react";
import { performanceTrend, departmentPerformance, teamKPIs } from "@/lib/data";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "8px 12px" }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
                {payload.map((p: any, i: number) => (
                    <div key={i} style={{ fontSize: 13, fontWeight: 600, color: p.color, display: 'flex', gap: 8, justifyContent: 'space-between' }}>
                        <span>{p.name}:</span>
                        <span>{p.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function ChartPage() {
    const [selectedMetric, setSelectedMetric] = useState("Performance");
    const [insights, setInsights] = useState<string>("");
    const [isGenerating, setIsGenerating] = useState(false);

    const generateInsights = () => {
        setIsGenerating(true);
        // Simulate AI thinking time
        setTimeout(() => {
            const latestMonth = performanceTrend[performanceTrend.length - 1];
            const previousMonth = performanceTrend[performanceTrend.length - 2];
            const trend = latestMonth.score >= previousMonth.score ? "an upward" : "a downward";
            
            const topDept = [...departmentPerformance].sort((a, b) => b.score - a.score)[0];
            const lowDept = [...departmentPerformance].sort((a, b) => a.score - b.score)[0];

            const insightsList = [
                `We're seeing ${trend} trend in overall performance, with a current company average of ${latestMonth.score}%.`,
                `${topDept.department} is currently leading the organization with a score of ${topDept.score}%.`,
                `There are significant opportunities for growth identified in the ${lowDept.department} department.`,
                `Overall KPI achievement has shifted by ${Math.abs(Math.round((latestMonth.score / previousMonth.score - 1) * 100))}% compared to the previous period.`
            ];
            
            setInsights(insightsList.join(" "));
            setIsGenerating(false);
        }, 1200);
    };

    useEffect(() => {
        generateInsights();
    }, []);

    // Enhance performanceTrend to have multiple data points just for visual interest on a dedicated chart page
    const enhancedTrendData = useMemo(() => {
        return performanceTrend.map(t => ({
            ...t,
            Engineering: Math.round(t.score * 1.05),
            Sales: Math.round(t.score * 0.95),
            Design: Math.round(t.score * 1.02),
        }));
    }, []);

    // Transform team KPIs for a radar or bar chart comparison
    const kpiComparisonData = teamKPIs.map(kpi => ({
        name: kpi.name.replace("Avg ", "").replace("Score", ""),
        Actual: kpi.value,
        Target: kpi.target,
    }));

    return (
        <div className="fade-in">
            {/* Header controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0, color: "var(--text-primary)" }}>Analytics Overview</h2>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Deep dive into organizational metrics</p>
                </div>

                <div className="tab-group" style={{ marginBottom: 0 }}>
                    <button className={`tab-btn ${selectedMetric === "Performance" ? "active" : ""}`} onClick={() => setSelectedMetric("Performance")}>Performance</button>
                    <button className={`tab-btn ${selectedMetric === "Operations" ? "active" : ""}`} onClick={() => setSelectedMetric("Operations")}>Operations</button>
                    <button className={`tab-btn ${selectedMetric === "Financials" ? "active" : ""}`} onClick={() => setSelectedMetric("Financials")}>Financials</button>
                </div>
            </div>

            {/* Main Feature Chart */}
            <div className="card" style={{ marginBottom: 24 }}>
                <div className="card-header">
                    <div>
                        <div className="card-title">{selectedMetric} Trends</div>
                        <div className="card-subtitle">Comparing key departments over the last 6 months</div>
                    </div>
                </div>
                <div style={{ height: 350, marginTop: 16 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={enhancedTrendData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                            <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                            <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} domain={[60, 100]} axisLine={false} tickLine={false} dx={-10} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: 20 }} />
                            <Line type="monotone" dataKey="score" name="Company Avg" stroke="#818cf8" strokeWidth={3} dot={{ r: 4, fill: "#818cf8", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="Engineering" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                            <Line type="monotone" dataKey="Sales" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid-2">
                {/* Department Distribution */}
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Department Scores (Q4)</div>
                            <div className="card-subtitle">Current cross-functional standing</div>
                        </div>
                    </div>
                    <div style={{ height: 250, marginTop: 16 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={departmentPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 5 }} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                                <XAxis type="number" domain={[0, 100]} tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis dataKey="department" type="category" tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} width={80} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-elevated)' }} />
                                <Bar dataKey="score" name="Score" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* KPI Targets vs Actual */}
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">KPI Target Achievement</div>
                            <div className="card-subtitle">Actual vs Company Targets</div>
                        </div>
                    </div>
                    <div style={{ height: 250, marginTop: 16 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={kpiComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6b7280" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6b7280" stopOpacity={0.0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                                <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} dx={-10} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ paddingTop: 10 }} />
                                <Area type="monotone" dataKey="Target" stroke="#6b7280" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorTarget)" />
                                <Area type="monotone" dataKey="Actual" stroke="#10b981" fillOpacity={1} fill="url(#colorActual)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Quick Insights Footer */}
            <div style={{ marginTop: 24, padding: "20px", background: "rgba(99, 102, 241, 0.05)", border: "1px solid var(--border-brand)", borderRadius: "var(--radius-lg)", display: "flex", gap: 16, alignItems: "center", position: 'relative', overflow: 'hidden' }}>
                <div 
                    style={{ 
                        fontSize: 24, 
                        animation: isGenerating ? "pulse 1.5s infinite ease-in-out" : "none",
                        filter: isGenerating ? "drop-shadow(0 0 8px var(--brand-primary))" : "none"
                    }}
                >
                    {isGenerating ? "✨" : "💡"}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", letterSpacing: '0.02em', textTransform: 'uppercase' }}>AI Performance Insights</div>
                        <button 
                            disabled={isGenerating}
                            onClick={generateInsights}
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                color: 'var(--brand-primary)', 
                                cursor: 'pointer', 
                                fontSize: 12, 
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                opacity: isGenerating ? 0.5 : 1,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <span style={{ fontSize: 16 }}>{isGenerating ? "⏳" : "🔄"}</span>
                            {isGenerating ? "Analyzing..." : "Refresh Insights"}
                        </button>
                    </div>
                    <div style={{ 
                        fontSize: 13, 
                        color: "var(--text-secondary)", 
                        lineHeight: 1.6,
                        minHeight: "40px",
                        transition: 'opacity 0.3s ease',
                        opacity: isGenerating ? 0.6 : 1
                    }}>
                        {isGenerating ? "Processing monthly performance data and cross-departmental metrics to generate strategic recommendations..." : insights}
                    </div>
                </div>

                {/* Loading bar overlay */}
                {isGenerating && (
                    <div style={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        left: 0, 
                        height: 2, 
                        background: 'linear-gradient(90deg, transparent, var(--brand-primary), transparent)', 
                        width: '100%',
                        animation: 'loading-slide 1.5s infinite linear'
                    }} />
                )}
            </div>

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes loading-slide {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}

