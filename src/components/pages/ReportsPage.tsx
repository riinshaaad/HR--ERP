"use client";
import { useState } from "react";
import { employees, payrollRecords, leaveRequests, performanceRecords } from "@/lib/data";
import { useSettings } from "@/contexts/SettingsContext";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Generic CSV Download Function
const downloadCSV = (data: any[], filename: string) => {
    if (!data || !data.length) return;
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(obj =>
        Object.values(obj).map(val =>
            typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
        ).join(",")
    ).join("\n");

    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

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
    const { formatCurrency } = useSettings();
    const [timeRange, setTimeRange] = useState("Year to Date");

    // Dynamic Multipliers based on time range to simulate changing data
    const getMultiplier = () => {
        switch (timeRange) {
            case "This Month": return 0.1;
            case "Last Month": return 0.12;
            case "Last Quarter": return 0.3;
            case "Year to Date": return 1;
            case "Last Year": return 1.2;
            case "All Time": return 2.5;
            default: return 1;
        }
    };
    const m = getMultiplier();

    // Data filtering / simulating based on multiplier
    const dynEmployeesCount = Math.max(1, Math.round(employees.length * (m > 1 ? 1 : 0.8 + (m * 0.2))));
    const totalPayroll = Math.round(payrollRecords.reduce((a, b) => a + b.netPay, 0) * m * 2);
    const avgSalary = Math.round((employees.reduce((a, e) => a + e.salary, 0) / employees.length) * (0.95 + (m * 0.05)));
    const totalLeaveDays = Math.round(leaveRequests.filter(l => l.status === "Approved").reduce((a, b) => a + b.days, 0) * m);

    // Dynamic Charts Data
    const deptHeadcount = ["Engineering", "Design", "Marketing", "Sales", "HR", "Finance", "Operations"].map(dep => ({
        name: dep,
        value: Math.round(employees.filter(e => e.department === dep).length * (m > 1 ? 1 : 0.8 + (m * 0.2))),
    })).filter(d => d.value > 0);

    const leaveByType = ["Annual", "Sick", "Maternity", "Paternity", "Unpaid"].map(type => ({
        name: type,
        value: Math.round(leaveRequests.filter(l => l.type === type).length * m),
    })).filter(d => d.value > 0);

    const salaryByDept = ["Engineering", "Design", "Marketing", "Sales", "HR", "Finance"].map(dep => ({
        department: dep,
        total: Math.round((employees.filter(e => e.department === dep).reduce((a, e) => a + e.salary / 12, 0) / 1000) * m * 2),
    }));

    const COLORS = ["#6366f1", "#10b981", "#3b82f6", "#f59e0b", "#a855f7", "#ef4444", "#06b6d4"];
    const leaveRequestsSimulatedCount = Math.max(1, Math.round(leaveRequests.length * m));

    const handleExport = (reportType: string) => {
        switch (reportType) {
            case "Employee Directory":
                const exportedEmployees = employees.slice(0, dynEmployeesCount).map(e => ({
                    ID: e.id,
                    Name: e.name,
                    Role: e.role,
                    Department: e.department,
                    Status: e.status,
                    Salary: formatCurrency(e.salary)
                }));
                downloadCSV(exportedEmployees, `Employee_Directory_${timeRange.replace(/\s+/g, '_')}`);
                break;
            case "Payroll Summary":
                const exportedPayroll = payrollRecords.map(p => ({
                    ID: p.id,
                    EmployeeID: p.employeeId,
                    Period: `${p.month} ${p.year}`,
                    BasicSalary: p.basicSalary * m,
                    Allowances: p.allowances * m,
                    Deductions: p.deductions * m,
                    Tax: p.tax * m,
                    NetPay: p.netPay * m,
                    Status: p.status
                }));
                downloadCSV(exportedPayroll, `Payroll_Summary_${timeRange.replace(/\s+/g, '_')}`);
                break;
            case "Leave Report":
                const exportedLeaves = leaveRequests.slice(0, leaveRequestsSimulatedCount).map(l => ({
                    ID: l.id,
                    EmployeeID: l.employeeId,
                    Type: l.type,
                    StartDate: l.startDate,
                    EndDate: l.endDate,
                    Days: l.days,
                    Status: l.status
                }));
                downloadCSV(exportedLeaves, `Leave_Report_${timeRange.replace(/\s+/g, '_')}`);
                break;
            case "Performance Report":
                const exportedPerformance = performanceRecords.map(p => ({
                    ID: p.id,
                    EmployeeID: p.employeeId,
                    Period: p.period,
                    Rating: p.rating,
                    KPIScore: p.kpiScore,
                    ReviewerID: p.reviewerId
                }));
                downloadCSV(exportedPerformance, `Performance_Report_${timeRange.replace(/\s+/g, '_')}`);
                break;
            case "Export All as CSV":
                const allData = [
                    ...employees.slice(0, dynEmployeesCount).map(e => ({ Report: 'Employee', ID: e.id, Name: e.name, Dept: e.department, Value: formatCurrency(e.salary) })),
                    ...payrollRecords.map(p => ({ Report: 'Payroll', ID: p.id, Name: p.employeeId, Dept: p.month, Value: formatCurrency(p.netPay * m) })),
                    ...leaveRequests.slice(0, leaveRequestsSimulatedCount).map(l => ({ Report: 'Leave', ID: l.id, Name: l.employeeId, Dept: l.type, Value: `${l.days} days` }))
                ];
                downloadCSV(allData, `All_Reports_Combined_${timeRange.replace(/\s+/g, '_')}`);
                break;
            case "Headcount by Department":
                downloadCSV(deptHeadcount, `Headcount_by_Department_${timeRange.replace(/\s+/g, '_')}`);
                break;
            case "Leave Requests by Type":
                downloadCSV(leaveByType, `Leave_Requests_by_Type_${timeRange.replace(/\s+/g, '_')}`);
                break;
            case "Salary by Department":
                downloadCSV(salaryByDept, `Salary_by_Department_${timeRange.replace(/\s+/g, '_')}`);
                break;
            case "GDPR Data Export":
                alert("GDPR Data Export process initiated. A secure link will be emailed to the requesting administrator.");
                break;
        }
    };

    return (
        <div className="fade-in">
            {/* Header & Date Slicer */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 600 }}>Analytics & Reports</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>Date Range:</span>
                    <select
                        className="input"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        style={{ padding: "8px 12px", width: "auto", minWidth: "150px" }}
                    >
                        <option value="This Month">This Month</option>
                        <option value="Last Month">Last Month</option>
                        <option value="Last Quarter">Last Quarter</option>
                        <option value="Year to Date">Year to Date (YTD)</option>
                        <option value="Last Year">Last Year</option>
                        <option value="All Time">All Time</option>
                    </select>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="stats-grid">
                {[
                    { label: "Total Headcount", value: dynEmployeesCount, icon: "👥", color: "#6366f1" },
                    { label: "Monthly Payroll", value: formatCurrency(totalPayroll), icon: "💰", color: "#10b981" },
                    { label: "Avg Salary", value: formatCurrency(avgSalary), icon: "📊", color: "#3b82f6" },
                    { label: "Total Leave Days", value: totalLeaveDays, icon: "📅", color: "#f59e0b" },
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
                        <button className="btn btn-ghost btn-sm" onClick={() => handleExport("Headcount by Department")}>Export CSV</button>
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
                        <button className="btn btn-ghost btn-sm" onClick={() => handleExport("Leave Requests by Type")}>Export CSV</button>
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
                    <div className="card-title">Salary by Department (USD thousands)</div>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleExport("Salary by Department")}>Export CSV</button>
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
                        { label: "Approved", count: Math.round(leaveRequests.filter(l => l.status === "Approved").length * m), color: "var(--status-success)" },
                        { label: "Pending", count: Math.round(leaveRequests.filter(l => l.status === "Pending").length * m), color: "var(--status-warning)" },
                        { label: "Rejected", count: Math.round(leaveRequests.filter(l => l.status === "Rejected").length * m), color: "var(--status-error)" },
                    ].map(s => (
                        <div key={s.label} style={{ marginBottom: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{s.label}</span>
                                <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.count}</span>
                            </div>
                            <div className="progress-bar" style={{ height: 8 }}>
                                <div className="progress-fill" style={{ width: `${(s.count / leaveRequestsSimulatedCount) * 100}%`, background: s.color }} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card">
                    <div className="card-title" style={{ marginBottom: 14 }}>Workforce by Role</div>
                    {[
                        { label: "HR Admin", count: Math.round(employees.filter(e => e.role === "HR Admin").length * (m > 1 ? 1 : 0.8 + (m * 0.2))), color: "var(--status-purple)" },
                        { label: "Manager", count: Math.round(employees.filter(e => e.role === "Manager").length * (m > 1 ? 1 : 0.8 + (m * 0.2))), color: "var(--status-info)" },
                        { label: "Employee", count: Math.round(employees.filter(e => e.role === "Employee").length * (m > 1 ? 1 : 0.8 + (m * 0.2))), color: "var(--text-secondary)" },
                    ].map(s => (
                        <div key={s.label} style={{ marginBottom: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{s.label}</span>
                                <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.count}</span>
                            </div>
                            <div className="progress-bar" style={{ height: 8 }}>
                                <div className="progress-fill" style={{ width: `${(s.count / dynEmployeesCount) * 100}%`, background: s.color }} />
                            </div>
                        </div>
                    ))}

                    <hr className="divider" />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)" }}>
                        <span>Active: {Math.round(employees.filter(e => e.status === "Active").length * (m > 1 ? 1 : 0.8 + (m * 0.2)))}</span>
                        <span>On Leave: {Math.round(employees.filter(e => e.status === "On Leave").length * (m > 1 ? 1 : 0.8 + (m * 0.2)))}</span>
                        <span>Inactive: {Math.round(employees.filter(e => e.status === "Inactive").length * (m > 1 ? 1 : 0.8 + (m * 0.2)))}</span>
                    </div>
                </div>
            </div>

            {/* Export buttons */}
            <div className="card" style={{ marginTop: 16 }}>
                <div className="card-title" style={{ marginBottom: 12 }}>Export Reports</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {["Export All as CSV", "Employee Directory", "Payroll Summary", "Leave Report", "Performance Report", "GDPR Data Export"].map(name => (
                        <button key={name} className={name === "Export All as CSV" ? "btn btn-primary" : "btn btn-secondary"} onClick={() => handleExport(name)}>
                            ↓ {name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
