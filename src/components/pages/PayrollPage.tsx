"use client";
import { useState } from "react";
import { employees, payrollRecords, getEmployee, formatCurrency } from "@/lib/data";

function PayslipModal({ payrollId, onClose }: { payrollId: string; onClose: () => void }) {
    const record = payrollRecords.find(p => p.id === payrollId);
    const emp = record ? getEmployee(record.employeeId) : null;
    if (!record || !emp) return null;

    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal">
                <div className="modal-header">
                    <span className="modal-title">Payslip</span>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 700 }}>{emp.name}</div>
                            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{emp.jobTitle} · {emp.department}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-brand)" }}>{record.month} {record.year}</div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>ID: {record.id}</div>
                        </div>
                    </div>

                    {/* Earnings */}
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Earnings</div>
                        {[
                            { label: "Basic Salary", value: record.basicSalary },
                            { label: "Allowances", value: record.allowances },
                        ].map(item => (
                            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)", fontSize: 13 }}>
                                <span style={{ color: "var(--text-secondary)" }}>{item.label}</span>
                                <span style={{ fontWeight: 500, color: "var(--status-success)" }}>+{formatCurrency(item.value)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Deductions */}
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Deductions</div>
                        {[
                            { label: "Provident Fund", value: record.deductions },
                            { label: "Income Tax (TDS)", value: record.tax },
                        ].map(item => (
                            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)", fontSize: 13 }}>
                                <span style={{ color: "var(--text-secondary)" }}>{item.label}</span>
                                <span style={{ fontWeight: 500, color: "var(--status-error)" }}>-{formatCurrency(item.value)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Net Pay */}
                    <div style={{ background: "rgba(99,102,241,0.08)", border: "1px solid var(--border-brand)", borderRadius: "var(--radius-md)", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>Net Pay</span>
                        <span style={{ fontSize: 22, fontWeight: 700, color: "var(--text-brand)" }}>{formatCurrency(record.netPay)}</span>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Close</button>
                    <button className="btn btn-primary" onClick={() => { alert("Payslip download triggered (PDF generation would occur in production)"); onClose(); }}>
                        ↓ Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function PayrollPage() {
    const [selectedPayslip, setSelectedPayslip] = useState<string | null>(null);
    const [filterEmployee, setFilterEmployee] = useState("all");
    const [filterMonth, setFilterMonth] = useState("all");

    const months = [...new Set(payrollRecords.map(p => p.month))];

    const filtered = payrollRecords.filter(p => {
        const empOk = filterEmployee === "all" || p.employeeId === filterEmployee;
        const monthOk = filterMonth === "all" || p.month === filterMonth;
        return empOk && monthOk;
    });

    const totalPayroll = filtered.reduce((a, b) => a + b.netPay, 0);
    const totalTax = filtered.reduce((a, b) => a + b.tax, 0);
    const paid = filtered.filter(p => p.status === "Paid").length;

    return (
        <div className="fade-in">
            {/* Stats */}
            <div className="stats-grid">
                {[
                    { label: "Total Payroll", value: formatCurrency(totalPayroll), icon: "💰", color: "#6366f1" },
                    { label: "Tax Deductions", value: formatCurrency(totalTax), icon: "📋", color: "#f59e0b" },
                    { label: "Payslips Issued", value: paid, icon: "✅", color: "#10b981" },
                    { label: "Pending Payment", value: filtered.filter(p => p.status === "Pending").length, icon: "⏳", color: "#3b82f6" },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <div className="stat-icon" style={{ background: `${s.color}18` }}><span>{s.icon}</span></div>
                        <div className="stat-value">{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <select style={{ width: "auto" }} value={filterEmployee} onChange={e => setFilterEmployee(e.target.value)}>
                    <option value="all">All Employees</option>
                    {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
                <select style={{ width: "auto" }} value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
                    <option value="all">All Months</option>
                    {months.map(m => <option key={m}>{m}</option>)}
                </select>
                <button className="btn btn-primary" style={{ marginLeft: "auto" }}>Run Payroll</button>
            </div>

            {/* Table */}
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Period</th>
                            <th>Basic Salary</th>
                            <th>Allowances</th>
                            <th>Deductions</th>
                            <th>Tax</th>
                            <th>Net Pay</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(record => {
                            const emp = getEmployee(record.employeeId);
                            return (
                                <tr key={record.id}>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div className="avatar avatar-md">{emp?.avatar}</div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 13 }}>{emp?.name}</div>
                                                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{emp?.department}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{record.month} {record.year}</td>
                                    <td style={{ color: "var(--text-primary)" }}>{formatCurrency(record.basicSalary)}</td>
                                    <td style={{ color: "var(--status-success)" }}>+{formatCurrency(record.allowances)}</td>
                                    <td style={{ color: "var(--status-warning)" }}>-{formatCurrency(record.deductions)}</td>
                                    <td style={{ color: "var(--status-error)" }}>-{formatCurrency(record.tax)}</td>
                                    <td style={{ fontWeight: 700, color: "var(--text-brand)", fontSize: 14 }}>{formatCurrency(record.netPay)}</td>
                                    <td>
                                        <span className={`badge ${record.status === "Paid" ? "badge-success" : record.status === "Pending" ? "badge-warning" : "badge-info"}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-ghost btn-sm" onClick={() => setSelectedPayslip(record.id)}>
                                            Payslip →
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Payslip by employee summary */}
            <div style={{ marginTop: 24 }}>
                <div className="card-title" style={{ marginBottom: 16 }}>Salary Distribution by Department</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                    {["Engineering", "Design", "Marketing", "Sales", "HR", "Finance"].map(dep => {
                        const depEmps = employees.filter(e => e.department === dep);
                        const total = depEmps.reduce((a, b) => a + b.salary / 12, 0);
                        const pct = Math.round((total / employees.reduce((a, b) => a + b.salary / 12, 0)) * 100);
                        return (
                            <div key={dep} className="card" style={{ padding: 16 }}>
                                <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>{dep}</div>
                                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{formatCurrency(total)}<span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 400 }}>/mo</span></div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${pct}%`, background: "var(--brand-500)" }} />
                                </div>
                                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{pct}% of payroll</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {selectedPayslip && <PayslipModal payrollId={selectedPayslip} onClose={() => setSelectedPayslip(null)} />}
        </div>
    );
}
