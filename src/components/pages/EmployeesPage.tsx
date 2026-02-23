"use client";
import { useState } from "react";
import { employees, Employee, Department, Role, formatCurrency } from "@/lib/data";

const DEPARTMENTS: Department[] = ["Engineering", "Design", "Marketing", "Sales", "HR", "Finance", "Operations"];

function EmployeeModal({ emp, onClose }: { emp: Employee; onClose: () => void }) {
    const manager = emp.managerId ? employees.find(e => e.id === emp.managerId) : null;
    const reports = employees.filter(e => e.managerId === emp.id);

    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal">
                <div className="modal-header">
                    <span className="modal-title">Employee Profile</span>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">
                    {/* Header */}
                    <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20 }}>
                        <div className="avatar avatar-xl">{emp.avatar}</div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 700 }}>{emp.name}</div>
                            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{emp.jobTitle}</div>
                            <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                                <span className={`badge ${emp.role === "HR Admin" ? "badge-purple" : emp.role === "Manager" ? "badge-info" : "badge-default"}`}>{emp.role}</span>
                                <span className={`badge ${emp.status === "Active" ? "badge-success" : emp.status === "On Leave" ? "badge-warning" : "badge-error"}`}>{emp.status}</span>
                            </div>
                        </div>
                    </div>

                    {/* Info grid */}
                    <div className="grid-cols-2">
                        {[
                            { label: "Department", value: emp.department },
                            { label: "Started", value: new Date(emp.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
                            { label: "Email", value: emp.email },
                            { label: "Phone", value: emp.phone },
                            { label: "Salary", value: formatCurrency(emp.salary) + " / yr" },
                            { label: "Manager", value: manager?.name || "—" },
                        ].map(({ label, value }) => (
                            <div key={label} style={{ background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", padding: "10px 12px" }}>
                                <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                                <div style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>{value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Bio */}
                    <div style={{ margin: "16px 0", padding: "12px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                        {emp.bio}
                    </div>

                    {/* Skills */}
                    <div style={{ marginBottom: reports.length ? 16 : 0 }}>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Skills</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {emp.skills.map(s => <span key={s} className="tag">{s}</span>)}
                        </div>
                    </div>

                    {/* Reports */}
                    {reports.length > 0 && (
                        <div style={{ marginTop: 16 }}>
                            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Direct Reports ({reports.length})</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {reports.map(r => (
                                    <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)" }}>
                                        <div className="avatar avatar-sm">{r.avatar}</div>
                                        <div>
                                            <div style={{ fontSize: 12, fontWeight: 600 }}>{r.name}</div>
                                            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{r.jobTitle}</div>
                                        </div>
                                        <span className={`badge badge-default`} style={{ marginLeft: "auto" }}>{r.department}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Close</button>
                    <button className="btn btn-primary">Edit Profile</button>
                </div>
            </div>
        </div>
    );
}

function AddEmployeeModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal">
                <div className="modal-header">
                    <span className="modal-title">Add New Employee</span>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">
                    <div className="grid-cols-2">
                        <div className="form-group">
                            <label>First Name</label>
                            <input placeholder="e.g. John" />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input placeholder="e.g. Doe" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" placeholder="john.doe@company.com" />
                    </div>
                    <div className="grid-cols-2">
                        <div className="form-group">
                            <label>Job Title</label>
                            <input placeholder="e.g. Software Engineer" />
                        </div>
                        <div className="form-group">
                            <label>Department</label>
                            <select>
                                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid-cols-2">
                        <div className="form-group">
                            <label>Role</label>
                            <select>
                                {(["HR Admin", "Manager", "Employee"] as Role[]).map(r => <option key={r}>{r}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Start Date</label>
                            <input type="date" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Annual Salary (USD)</label>
                        <input type="number" placeholder="e.g. 85000" />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input placeholder="+1 555-000-0000" />
                    </div>
                    <div className="form-group">
                        <label>Bio / Notes</label>
                        <textarea rows={3} placeholder="Brief description about this employee..." style={{ resize: "none" }} />
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={onClose}>Add Employee</button>
                </div>
            </div>
        </div>
    );
}

export default function EmployeesPage() {
    const [search, setSearch] = useState("");
    const [filterDep, setFilterDep] = useState("All");
    const [filterRole, setFilterRole] = useState("All");
    const [selected, setSelected] = useState<Employee | null>(null);
    const [adding, setAdding] = useState(false);

    const filtered = employees.filter(emp => {
        const matchSearch = emp.name.toLowerCase().includes(search.toLowerCase()) ||
            emp.email.toLowerCase().includes(search.toLowerCase()) ||
            emp.jobTitle.toLowerCase().includes(search.toLowerCase());
        const matchDep = filterDep === "All" || emp.department === filterDep;
        const matchRole = filterRole === "All" || emp.role === filterRole;
        return matchSearch && matchDep && matchRole;
    });

    return (
        <div className="fade-in">
            {/* Controls */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
                <div className="search-input">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                    <input placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select style={{ width: "auto" }} value={filterDep} onChange={e => setFilterDep(e.target.value)}>
                    <option>All</option>
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
                <select style={{ width: "auto" }} value={filterRole} onChange={e => setFilterRole(e.target.value)}>
                    <option>All</option>
                    <option>HR Admin</option>
                    <option>Manager</option>
                    <option>Employee</option>
                </select>
                <button className="btn btn-primary" style={{ marginLeft: "auto" }} onClick={() => setAdding(true)}>
                    + Add Employee
                </button>
            </div>

            {/* Table */}
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Department</th>
                            <th>Job Title</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Started</th>
                            <th>Salary</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(emp => (
                            <tr key={emp.id} style={{ cursor: "pointer" }} onClick={() => setSelected(emp)}>
                                <td>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div className="avatar avatar-md">{emp.avatar}</div>
                                        <div>
                                            <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 13 }}>{emp.name}</div>
                                            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{emp.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{emp.department}</td>
                                <td>{emp.jobTitle}</td>
                                <td>
                                    <span className={`badge ${emp.role === "HR Admin" ? "badge-purple" : emp.role === "Manager" ? "badge-info" : "badge-default"}`}>
                                        {emp.role}
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge ${emp.status === "Active" ? "badge-success" : emp.status === "On Leave" ? "badge-warning" : "badge-error"}`}>
                                        {emp.status}
                                    </span>
                                </td>
                                <td>{new Date(emp.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</td>
                                <td>{formatCurrency(emp.salary)}</td>
                                <td onClick={e => e.stopPropagation()}>
                                    <button className="btn btn-ghost btn-sm" onClick={() => setSelected(emp)}>View →</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-muted)" }}>
                Showing {filtered.length} of {employees.length} employees
            </div>

            {selected && <EmployeeModal emp={selected} onClose={() => setSelected(null)} />}
            {adding && <AddEmployeeModal onClose={() => setAdding(false)} />}
        </div>
    );
}
