"use client";
import { useState } from "react";
import { employees } from "@/lib/data";

const OFFBOARDING_TABS = ["Leaver Workflow", "FNF & Letters"];

export default function OffboardingPage() {
    const [activeTab, setActiveTab] = useState("Leaver Workflow");

    return (
        <div className="fade-in">
            {/* Header Tabs */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                {OFFBOARDING_TABS.map((tab) => (
                    <button
                        key={tab}
                        className={`btn ${activeTab === tab ? "btn-primary" : "btn-secondary"}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === "Leaver Workflow" && (
                <div className="card" style={{ padding: "20px" }}>
                    <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Customizable Leaver Workflow</span>
                        <button className="btn btn-primary btn-sm">+ Initiate Offboarding</button>
                    </div>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "10px", marginBottom: "20px" }}>
                        Monitor employee exits, assign offboarding tasks to departments (IT, Finance, HR), and track physical/digital asset retrieval.
                    </p>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Employee</th>
                                    <th>Resignation Date</th>
                                    <th>Last Working Day</th>
                                    <th>Exit Interview</th>
                                    <th>Clearance Status (IT/Admin/HR)</th>
                                    <th>Overall Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div className="avatar avatar-md">{employees[5]?.avatar}</div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 13 }}>{employees[5]?.name}</div>
                                                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{employees[5]?.department}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>Jan 15, 2026</td>
                                    <td>Feb 28, 2026</td>
                                    <td><span className="badge badge-success">Completed</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <span style={{ color: 'var(--status-success)', fontSize: '18px' }}>●</span>
                                            <span style={{ color: 'var(--status-warning)', fontSize: '18px' }}>●</span>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '18px' }}>●</span>
                                        </div>
                                    </td>
                                    <td><span className="badge badge-warning">In Progress</span></td>
                                    <td><button className="btn btn-ghost btn-sm">Manage Tasks</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === "FNF & Letters" && (
                <div className="card" style={{ padding: "20px" }}>
                    <div className="card-title">Full & Final (FNF) Settlement and Relieving Letters</div>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "10px", marginBottom: "20px" }}>
                        Automatically calculate FNF based on unavailed leaves, notice period recovery, and pending dues. Generate relieving/experience letters.
                    </p>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Employee</th>
                                    <th>End Date</th>
                                    <th>FNF Calculation</th>
                                    <th>Settlement Amount</th>
                                    <th>Letters Generated</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>David Kim</td>
                                    <td>Feb 28, 2026</td>
                                    <td><span className="badge badge-info">Drafting</span></td>
                                    <td style={{ fontWeight: 600 }}>TBD</td>
                                    <td><span className="badge badge-warning">Pending</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <button className="btn btn-ghost btn-sm">Process FNF</button>
                                            <button className="btn btn-ghost btn-sm" disabled>Letters</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Sarah Connor (Alumni)</td>
                                    <td>Dec 15, 2025</td>
                                    <td><span className="badge badge-success">Closed</span></td>
                                    <td style={{ fontWeight: 600 }}>$4,520</td>
                                    <td><span className="badge badge-success">Yes</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <button className="btn btn-ghost btn-sm">View FNF</button>
                                            <button className="btn btn-ghost btn-sm">Download Letters</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
    );
}
