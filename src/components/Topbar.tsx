"use client";

interface TopbarProps {
    page: string;
    onAction?: () => void;
    actionLabel?: string;
}

const PAGE_TITLES: Record<string, { title: string; desc: string }> = {
    dashboard: { title: "Dashboard", desc: "Welcome back, Sarah 👋" },
    employees: { title: "Employees", desc: "Manage your workforce" },
    leave: { title: "Leave Management", desc: "Track and approve leave requests" },
    payroll: { title: "Payroll", desc: "Salary processing and payslips" },
    performance: { title: "Performance", desc: "KPIs, goals and review cycles" },
    reports: { title: "Reports", desc: "Analytics and insights" },
    settings: { title: "Settings", desc: "System configuration" },
};

export default function Topbar({ page, onAction, actionLabel }: TopbarProps) {
    const info = PAGE_TITLES[page] || { title: page, desc: "" };

    return (
        <header className="topbar">
            <div style={{ flex: 1 }}>
                <div className="topbar-title">{info.title}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{info.desc}</div>
            </div>

            {/* Notifications */}
            <button className="btn btn-ghost btn-icon" style={{ position: "relative" }}>
                <span style={{ fontSize: 16 }}>🔔</span>
                <span style={{
                    position: "absolute", top: 6, right: 6,
                    width: 7, height: 7,
                    background: "var(--brand-500)",
                    borderRadius: "50%"
                }} />
            </button>

            {onAction && actionLabel && (
                <button className="btn btn-primary" onClick={onAction}>
                    <span>+</span> {actionLabel}
                </button>
            )}
        </header>
    );
}
