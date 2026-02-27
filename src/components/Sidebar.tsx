"use client";
import { employees } from "@/lib/data";

interface SidebarProps {
    active: string;
    onNavigate: (page: string) => void;
}

const NAV = [
    {
        section: "Overview",
        items: [
            { id: "dashboard", label: "Dashboard", icon: "▦" },
            { id: "projects", label: "Projects", icon: "📋" },
        ],
    },
    {
        section: "People",
        items: [
            { id: "employees", label: "Employees", icon: "◉" },
            { id: "leave", label: "Leave Management", icon: "◷", badge: 2 },
        ],
    },
    {
        section: "Operations",
        items: [
            { id: "payroll", label: "Payroll", icon: "◈" },
            { id: "performance", label: "Performance", icon: "◎" },
        ],
    },
    {
        section: "Admin",
        items: [
            { id: "offboarding", label: "Offboarding", icon: "🚪" },
            { id: "reports", label: "Reports", icon: "▤" },
            { id: "settings", label: "Settings", icon: "⊕" },
        ],
    },
];

const me = employees[0]; // HR Admin as logged-in user

export default function Sidebar({ active, onNavigate }: SidebarProps) {
    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="logo-mark">H</div>
                <div>
                    <div className="logo-text">HRX</div>
                    <div className="logo-sub">People Platform</div>
                </div>
            </div>

            {/* Nav */}
            <nav className="sidebar-nav">
                {NAV.map((section) => (
                    <div key={section.section}>
                        <div className="nav-section-label">{section.section}</div>
                        {section.items.map((item) => (
                            <button
                                key={item.id}
                                className={`nav-item ${active === item.id ? "active" : ""}`}
                                onClick={() => onNavigate(item.id)}
                            >
                                <span style={{ fontSize: 15 }}>{item.icon}</span>
                                <span>{item.label}</span>
                                {item.badge && (
                                    <span className="nav-badge">{item.badge}</span>
                                )}
                            </button>
                        ))}
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                <div className="user-card">
                    <div className="avatar avatar-md">{me.avatar}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {me.name}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{me.role}</div>
                    </div>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--status-success)", flexShrink: 0 }} />
                </div>
            </div>
        </aside>
    );
}
