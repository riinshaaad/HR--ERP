"use client";
import React, { useState, useMemo, useEffect } from "react";
import { performanceTrend, departmentPerformance, teamKPIs } from "@/lib/data";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useDateRange } from "@/contexts/DateContext";

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

    // Moved generateInsights below data definitions

    const { dateRange } = useDateRange();

    // Generate dynamic labels and multiplier based on selected date
    const { labels: monthLabels, multiplier: m } = useMemo(() => {
        if (!dateRange) return { labels: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"], multiplier: 1 };
        const hash = dateRange.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const mult = 0.8 + ((hash % 10) / 10);
        
        const generatedLabels = [];
        const [y, mm] = dateRange.split("-");
        const baseDate = new Date(parseInt(y), parseInt(mm) - 1, 1);
        for(let i=5; i>=0; i--) {
            const temp = new Date(baseDate);
            temp.setMonth(baseDate.getMonth() - i);
            generatedLabels.push(temp.toLocaleString('default', { month: 'short' }));
        }
        return { labels: generatedLabels, multiplier: mult };
    }, [dateRange]);

    // -----------------------------------------
    // 1. Performance Data Transformation
    // -----------------------------------------
    const performanceEnhancedTrend = useMemo(() => performanceTrend.map((t, idx) => ({
        ...t,
        month: monthLabels[idx] || t.month,
        score: Math.min(100, Math.round(t.score * (0.9 + (m * 0.1)))),
        trendName: "Company Avg",
        line1: Math.min(100, Math.round(t.score * 1.05 * (0.9 + (m * 0.1)))),
        line2: Math.min(100, Math.round(t.score * 0.95 * (0.9 + (m * 0.1)))),
    })), [monthLabels, m]);

    const performanceKPIs = useMemo(() => teamKPIs.map(kpi => ({
        name: kpi.name.replace("Avg ", "").replace("Score", ""),
        Actual: Math.round(kpi.value * m),
        Target: kpi.target,
    })), [m]);

    const mappedDeptPerformance = useMemo(() => departmentPerformance.map(d => ({
        department: d.department,
        score: Math.min(100, Math.round(d.score * m))
    })), [m]);

    // -----------------------------------------
    // 2. Operations Mock Data
    // -----------------------------------------
    const opsTrendData = useMemo(() => [
        { month: monthLabels[0], score: Math.min(100, Math.round(85 * m)), trendName: "System Uptime (%)", line1: Math.min(100, Math.round(88 * m)), line2: Math.min(100, Math.round(82 * m)) },
        { month: monthLabels[1], score: Math.min(100, Math.round(87 * m)), trendName: "System Uptime (%)", line1: Math.min(100, Math.round(85 * m)), line2: Math.min(100, Math.round(84 * m)) },
        { month: monthLabels[2], score: Math.min(100, Math.round(86 * m)), trendName: "System Uptime (%)", line1: Math.min(100, Math.round(89 * m)), line2: Math.min(100, Math.round(81 * m)) },
        { month: monthLabels[3], score: Math.min(100, Math.round(90 * m)), trendName: "System Uptime (%)", line1: Math.min(100, Math.round(92 * m)), line2: Math.min(100, Math.round(86 * m)) },
        { month: monthLabels[4], score: Math.min(100, Math.round(92 * m)), trendName: "System Uptime (%)", line1: Math.min(100, Math.round(94 * m)), line2: Math.min(100, Math.round(89 * m)) },
        { month: monthLabels[5], score: Math.min(100, Math.round(91 * m)), trendName: "System Uptime (%)", line1: Math.min(100, Math.round(90 * m)), line2: Math.min(100, Math.round(87 * m)) }
    ], [monthLabels, m]);

    const opsDeptDistribution = useMemo(() => [
        { department: "Engineering", score: Math.min(100, Math.round(94 * m)) },
        { department: "Operations", score: Math.min(100, Math.round(92 * m)) },
        { department: "Support", score: Math.min(100, Math.round(85 * m)) },
        { department: "IT Admin", score: Math.min(100, Math.round(89 * m)) }
    ], [m]);

    const opsKPIs = useMemo(() => [
        { name: "SLA Met", Actual: Math.min(100, Math.round(98 * m)), Target: 95 },
        { name: "Ticket Res", Actual: Math.min(100, Math.round(85 * m)), Target: 90 },
        { name: "Cost/Sys", Actual: Math.min(100, Math.round(78 * m)), Target: 80 },
        { name: "Uptime", Actual: Math.min(100, Math.round(99.5 * (0.98 + (m * 0.02)))), Target: 99.9 }
    ], [m]);

    // -----------------------------------------
    // 3. Financials Mock Data
    // -----------------------------------------
    const finTrendData = useMemo(() => [
        { month: monthLabels[0], score: Math.round(65 * m), trendName: "Revenue ($M)", line1: Math.round(45 * m), line2: Math.round(20 * m) },
        { month: monthLabels[1], score: Math.round(68 * m), trendName: "Revenue ($M)", line1: Math.round(46 * m), line2: Math.round(22 * m) },
        { month: monthLabels[2], score: Math.round(72 * m), trendName: "Revenue ($M)", line1: Math.round(44 * m), line2: Math.round(28 * m) },
        { month: monthLabels[3], score: Math.round(70 * m), trendName: "Revenue ($M)", line1: Math.round(45 * m), line2: Math.round(25 * m) },
        { month: monthLabels[4], score: Math.round(85 * m), trendName: "Revenue ($M)", line1: Math.round(48 * m), line2: Math.round(37 * m) },
        { month: monthLabels[5], score: Math.round(80 * m), trendName: "Revenue ($M)", line1: Math.round(47 * m), line2: Math.round(33 * m) }
    ], [monthLabels, m]);

    const finDeptDistribution = useMemo(() => [
        { department: "Marketing", score: Math.round(120 * m) },
        { department: "Engineering", score: Math.round(95 * m) },
        { department: "Sales", score: Math.round(105 * m) },
        { department: "Operations", score: Math.round(88 * m) }
    ], [m]);

    const finKPIs = useMemo(() => [
        { name: "EBITDA Margin", Actual: Math.round(25 * (0.8 + (m * 0.2))), Target: 22 },
        { name: "CAC", Actual: Math.round(110 * (1.2 - (m * 0.2))), Target: 100 },
        { name: "LTV", Actual: Math.round(450 * m), Target: 400 },
        { name: "Gross Margin", Actual: Math.round(68 * (0.9 + (m * 0.1))), Target: 70 }
    ], [m]);

    // -----------------------------------------
    // Dynamic Selection Logic
    // -----------------------------------------
    let currentTrend, currentDept, currentKPI, labels;
    
    if (selectedMetric === "Operations") {
        currentTrend = opsTrendData;
        currentDept = opsDeptDistribution;
        currentKPI = opsKPIs;
        labels = { 
            mainTitle: "Operational Efficiency & Stability", 
            trendSub: "System Uptime vs Ticket Resolution vs Efficiency",
            lineMain: "Uptime (%)", line1: "Resolution (%)", line2: "Efficiency (%)",
            deptTitle: "Departmental SLA Compliance", deptSub: "Current standing against operational SLAs", deptScoreColor: "#10b981",
            kpiTitle: "Operational KPIs", kpiSub: "Actual delivery metrics vs targets"
        };
    } else if (selectedMetric === "Financials") {
        currentTrend = finTrendData;
        currentDept = finDeptDistribution;
        currentKPI = finKPIs;
        labels = { 
            mainTitle: "Financial Health & Budgeting", 
            trendSub: "Revenue against Operating Expenses and Net Profit",
            lineMain: "Revenue", line1: "OpEx", line2: "Net Profit",
            deptTitle: "Budget Utilization (%)", deptSub: "Percent of allocated Q4 budget spent", deptScoreColor: "#f59e0b",
            kpiTitle: "Financial Targets", kpiSub: "Actual margins vs Wall Street targets"
        };
    } else {
        // Defaults: Performance
        currentTrend = performanceEnhancedTrend;
        currentDept = mappedDeptPerformance; // Now dynamically scaled as well!
        currentKPI = performanceKPIs;
        labels = { 
            mainTitle: "Comparing key departments over the last 6 months", 
            trendSub: "Comparing key departments over the last 6 months",
            lineMain: "Company Avg", line1: "Engineering", line2: "Sales",
            deptTitle: "Department Scores (Q4)", deptSub: "Current cross-functional standing", deptScoreColor: "#6366f1",
            kpiTitle: "KPI Target Achievement", kpiSub: "Actual vs Company Targets"
        };
    }

    // -----------------------------------------
    // AI Insights Generation 
    // -----------------------------------------
    const generateInsights = () => {
        setIsGenerating(true);
        setTimeout(() => {
            if (!currentTrend || currentTrend.length < 2 || !currentDept || currentDept.length === 0) {
                setInsights("Insufficient data to generate insights at this time.");
                setIsGenerating(false);
                return;
            }

            const latestMonth = currentTrend[currentTrend.length - 1];
            const previousMonth = currentTrend[currentTrend.length - 2];
            const trend = latestMonth.score >= previousMonth.score ? "an upward" : "a downward";
            
            const topDept = [...currentDept].sort((a: any, b: any) => b.score - a.score)[0];
            const lowDept = [...currentDept].sort((a: any, b: any) => a.score - b.score)[0];

            let contextDesc = "overall performance";
            let valSuffix = "%";
            if (selectedMetric === "Operations") contextDesc = "operational system uptime";
            if (selectedMetric === "Financials") {
                contextDesc = "revenue growth";
                valSuffix = "M"; // Millions
            }

            const insightsList = [
                `We're seeing ${trend} trend in ${contextDesc}, with a current average of ${latestMonth.score}${valSuffix}.`,
                `${topDept.department} is currently leading with a score/utilization of ${topDept.score}${selectedMetric === 'Financials' ? '%' : '%'}.`,
                `There are significant opportunities for improvement identified in the ${lowDept.department} sector.`,
                `Overall target achievement has shifted by ${Math.abs(Math.round((latestMonth.score / previousMonth.score - 1) * 100))}% compared to the previous period.`
            ];
            
            setInsights(insightsList.join(" "));
            setIsGenerating(false);
        }, 1200);
    };

    useEffect(() => {
        generateInsights();
    }, [selectedMetric, dateRange]);

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
                        <div className="card-subtitle">{labels.trendSub}</div>
                    </div>
                </div>
                <div style={{ height: 350, marginTop: 16 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={currentTrend} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                            <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                            <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} domain={[0, 100]} axisLine={false} tickLine={false} dx={-10} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: 20 }} />
                            <Line type="monotone" dataKey="score" name={labels.lineMain} stroke="#818cf8" strokeWidth={3} dot={{ r: 4, fill: "#818cf8", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="line1" name={labels.line1} stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                            <Line type="monotone" dataKey="line2" name={labels.line2} stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid-2">
                {/* Department Distribution */}
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">{labels.deptTitle}</div>
                            <div className="card-subtitle">{labels.deptSub}</div>
                        </div>
                    </div>
                    <div style={{ height: 250, marginTop: 16 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={currentDept} margin={{ top: 10, right: 10, left: -20, bottom: 5 }} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                                <XAxis type="number" domain={[0, 'dataMax']} tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis dataKey="department" type="category" tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} width={80} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-elevated)' }} />
                                <Bar dataKey="score" name="Score" fill={labels.deptScoreColor} radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* KPI Targets vs Actual */}
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">{labels.kpiTitle}</div>
                            <div className="card-subtitle">{labels.kpiSub}</div>
                        </div>
                    </div>
                    <div style={{ height: 250, marginTop: 16 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={currentKPI} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
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

