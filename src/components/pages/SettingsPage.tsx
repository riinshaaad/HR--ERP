"use client";
import { useState } from "react";

const SECTIONS = ["General", "Security", "Notifications", "Roles & Permissions", "Integrations", "Audit Log"];

const auditLog = [
    { action: "Employee profile updated", user: "Sarah Chen", time: "2026-02-23 12:34", icon: "✏️" },
    { action: "Leave request approved for David Kim", user: "Aisha Patel", time: "2026-02-22 09:12", icon: "✅" },
    { action: "Payroll run for January 2026", user: "Sarah Chen", time: "2026-02-01 16:00", icon: "💰" },
    { action: "Performance review cycle started", user: "Sarah Chen", time: "2026-01-15 10:30", icon: "📊" },
    { action: "New employee added: Raj Nair", user: "Sarah Chen", time: "2026-01-02 09:00", icon: "👤" },
    { action: "Payslip generated for all employees", user: "System", time: "2025-12-31 23:59", icon: "🤖" },
];

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState("General");
    const [notifications, setNotifications] = useState({ email: true, leaveApproval: true, payroll: true, performance: false, system: true });
    const [saved, setSaved] = useState(false);

    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

    return (
        <div className="fade-in" style={{ display: "flex", gap: 24 }}>
            {/* Side nav */}
            <div style={{ width: 200, flexShrink: 0 }}>
                <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
                    {SECTIONS.map(section => (
                        <button key={section} onClick={() => setActiveSection(section)}
                            style={{ display: "block", width: "100%", padding: "11px 16px", textAlign: "left", fontSize: 13, fontWeight: 500, background: activeSection === section ? "rgba(99,102,241,0.1)" : "transparent", color: activeSection === section ? "var(--text-brand)" : "var(--text-secondary)", border: "none", cursor: "pointer", transition: "all 0.15s", borderLeft: activeSection === section ? "2px solid var(--brand-500)" : "2px solid transparent" }}>
                            {section}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
                {/* General */}
                {activeSection === "General" && (
                    <div className="card">
                        <div className="card-title" style={{ marginBottom: 20 }}>General Settings</div>
                        <div className="grid-cols-2">
                            <div className="form-group"><label>Company Name</label><input defaultValue="HRX People Platform" /></div>
                            <div className="form-group"><label>Company Size</label><select><option>1–50</option><option>51–200</option><option selected>201–500</option><option>500+</option></select></div>
                            <div className="form-group"><label>Timezone</label><select><option>UTC+05:30 IST</option><option>UTC-05:00 EST</option><option>UTC+00:00 GMT</option></select></div>
                            <div className="form-group"><label>Fiscal Year Start</label><select><option>January</option><option>April</option><option>July</option></select></div>
                            <div className="form-group"><label>Default Currency</label><select><option>USD — US Dollar</option><option>INR — Indian Rupee</option><option>EUR — Euro</option></select></div>
                            <div className="form-group"><label>Date Format</label><select><option>MM/DD/YYYY</option><option>DD/MM/YYYY</option><option>YYYY-MM-DD</option></select></div>
                        </div>
                        <div className="form-group"><label>Company Address</label><textarea rows={2} defaultValue="100 Market Street, San Francisco, CA 94105" style={{ resize: "none" }} /></div>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                            <button className="btn btn-primary" onClick={handleSave}>{saved ? "✓ Saved!" : "Save Changes"}</button>
                        </div>
                    </div>
                )}

                {/* Security */}
                {activeSection === "Security" && (
                    <div className="card">
                        <div className="card-title" style={{ marginBottom: 20 }}>Security Settings</div>
                        {[
                            { label: "Two-Factor Authentication", desc: "Require 2FA for all HR Admin accounts", enabled: true },
                            { label: "Single Sign-On (SSO)", desc: "Enable SAML 2.0 / OAuth SSO", enabled: false },
                            { label: "Session Timeout", desc: "Auto-logout after 30 minutes of inactivity", enabled: true },
                            { label: "IP Allowlist", desc: "Restrict access to specific IP ranges", enabled: false },
                            { label: "Data Encryption at Rest", desc: "AES-256 encryption for sensitive payroll data", enabled: true },
                        ].map(item => (
                            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</div>
                                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{item.desc}</div>
                                </div>
                                <div
                                    onClick={() => { }}
                                    style={{ width: 44, height: 24, borderRadius: 99, background: item.enabled ? "var(--brand-600)" : "var(--bg-elevated)", border: `1px solid ${item.enabled ? "var(--brand-500)" : "var(--border-default)"}`, cursor: "pointer", position: "relative", transition: "all 0.2s" }}>
                                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: item.enabled ? 22 : 2, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.4)" }} />
                                </div>
                            </div>
                        ))}
                        <div style={{ marginTop: 20 }}>
                            <div className="form-group"><label>Minimum Password Length</label><input type="number" defaultValue={12} /></div>
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <button className="btn btn-primary" onClick={handleSave}>{saved ? "✓ Saved!" : "Save"}</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Notifications */}
                {activeSection === "Notifications" && (
                    <div className="card">
                        <div className="card-title" style={{ marginBottom: 20 }}>Notification Preferences</div>
                        {[
                            { key: "email", label: "Email Notifications", desc: "Send notifications via email" },
                            { key: "leaveApproval", label: "Leave Approval Alerts", desc: "Notify managers when leaves are pending" },
                            { key: "payroll", label: "Payroll Reminders", desc: "Monthly payroll processing reminders" },
                            { key: "performance", label: "Performance Review Reminders", desc: "Alerts when review cycle begins" },
                            { key: "system", label: "System Alerts", desc: "Critical system notifications" },
                        ].map(item => (
                            <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</div>
                                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{item.desc}</div>
                                </div>
                                <div
                                    onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                                    style={{ width: 44, height: 24, borderRadius: 99, background: notifications[item.key as keyof typeof notifications] ? "var(--brand-600)" : "var(--bg-elevated)", border: `1px solid ${notifications[item.key as keyof typeof notifications] ? "var(--brand-500)" : "var(--border-default)"}`, cursor: "pointer", position: "relative", transition: "all 0.2s" }}>
                                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: notifications[item.key as keyof typeof notifications] ? 22 : 2, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.4)" }} />
                                </div>
                            </div>
                        ))}
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                            <button className="btn btn-primary" onClick={handleSave}>{saved ? "✓ Saved!" : "Save"}</button>
                        </div>
                    </div>
                )}

                {/* Roles & Permissions */}
                {activeSection === "Roles & Permissions" && (
                    <div className="card">
                        <div className="card-title" style={{ marginBottom: 20 }}>Roles & Permissions</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {[
                                { role: "HR Admin", color: "var(--status-purple)", perms: ["All Employees", "Payroll", "Performance", "Leave Approval", "Settings", "Reports", "Audit Log"] },
                                { role: "Manager", color: "var(--status-info)", perms: ["Team Employees", "Team Performance", "Leave Approval", "Team Reports"] },
                                { role: "Employee", color: "var(--text-secondary)", perms: ["Own Profile", "Own Payslips", "Own Leave", "Own Goals"] },
                            ].map(r => (
                                <div key={r.role} style={{ padding: "16px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                                        <span className="badge" style={{ background: `${r.color}20`, color: r.color }}>{r.role}</span>
                                    </div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                        {r.perms.map(p => <span key={p} className="tag" style={{ fontSize: 11 }}>{p}</span>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: 16, padding: "12px", background: "rgba(99,102,241,0.06)", borderRadius: "var(--radius-md)", fontSize: 12, color: "var(--text-secondary)" }}>
                            💡 Role permissions are enforced via JWT claims. Contact your system administrator to modify role definitions.
                        </div>
                    </div>
                )}

                {/* Integrations */}
                {activeSection === "Integrations" && (
                    <div className="card">
                        <div className="card-title" style={{ marginBottom: 20 }}>Integrations</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {[
                                { name: "Slack", desc: "Send leave & performance notifications to Slack", icon: "💬", connected: true },
                                { name: "Google Workspace", desc: "Sync calendar, email, and SSO login", icon: "📧", connected: true },
                                { name: "QuickBooks", desc: "Export payroll data to accounting", icon: "📒", connected: false },
                                { name: "BambooHR", desc: "Migrate employee records", icon: "🌿", connected: false },
                                { name: "Zoom", desc: "Auto-schedule performance review meetings", icon: "📹", connected: false },
                                { name: "Jira", desc: "Link employee goals to project tickets", icon: "🎫", connected: false },
                            ].map(int => (
                                <div key={int.name} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                                    <div style={{ fontSize: 24, width: 40, textAlign: "center" }}>{int.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: 13 }}>{int.name}</div>
                                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{int.desc}</div>
                                    </div>
                                    <button className={`btn btn-sm ${int.connected ? "btn-secondary" : "btn-primary"}`}>
                                        {int.connected ? "Connected ✓" : "Connect"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Audit Log */}
                {activeSection === "Audit Log" && (
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Audit Log</div>
                            <button className="btn btn-ghost btn-sm">Export Log</button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                            {auditLog.map((entry, i) => (
                                <div key={i} className="timeline-item">
                                    <div className="timeline-dot" style={{ fontSize: 14 }}>{entry.icon}</div>
                                    <div style={{ paddingTop: 4 }}>
                                        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{entry.action}</div>
                                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                                            by <span style={{ color: "var(--text-brand)" }}>{entry.user}</span> · {entry.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
