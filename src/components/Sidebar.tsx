"use client";
import React, { useState, useRef, useEffect } from "react";
import { employees } from "@/lib/data";
import { useTheme } from "@/contexts/ThemeContext";

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
            { id: "chats", label: "Chats", icon: "💬" },
            { id: "leave", label: "Leave Management", icon: "◷", badge: 2 },
        ],
    },
    {
        section: "Operations",
        items: [
            { id: "payroll", label: "Payroll", icon: "◈" },
            { id: "performance", label: "Performance", icon: "◎" },
            { id: "chart", label: "Chart", icon: "📊" },
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
    const { theme, toggleTheme } = useTheme();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        alert("Logged out from HRX");
        setShowUserMenu(false);
    };

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
            <div className="sidebar-footer" style={{ position: "relative" }} ref={userMenuRef}>
                {showUserMenu && (
                    <div style={{
                        position: "absolute",
                        bottom: "100%",
                        left: 20,
                        right: 20,
                        marginBottom: 8,
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border-default)",
                        borderRadius: "var(--radius-md)",
                        boxShadow: "0 -4px 15px -3px rgba(0, 0, 0, 0.3)",
                        zIndex: 50,
                        overflow: "hidden"
                    }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <button
                                onClick={toggleTheme}
                                style={{
                                    padding: "12px 16px",
                                    border: "none",
                                    background: "transparent",
                                    color: "var(--text-primary)",
                                    fontSize: 13,
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    textAlign: "left",
                                    borderBottom: "1px solid var(--border-subtle)"
                                }}
                            >
                                {theme === "dark" ? "☀️ Switch to Light Theme" : "🌙 Switch to Dark Theme"}
                            </button>
                            <button
                                onClick={handleLogout}
                                style={{
                                    padding: "12px 16px",
                                    border: "none",
                                    background: "transparent",
                                    color: "var(--status-error)",
                                    fontSize: 13,
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    textAlign: "left"
                                }}
                            >
                                🚪 Log out
                            </button>
                        </div>
                    </div>
                )}
                <div
                    className="user-card"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    style={{ background: showUserMenu ? "var(--bg-elevated)" : undefined }}
                >
                    <div className="avatar avatar-md">{me.avatar}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {me.name}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{me.role}</div>
                    </div>
                    <div>
                        <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{showUserMenu ? "▼" : "▲"}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
