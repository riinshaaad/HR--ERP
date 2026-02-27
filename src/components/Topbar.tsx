"use client";
import React, { useState, useRef, useEffect } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
interface TopbarProps {
    page: string;
    onAction?: () => void;
    actionLabel?: string;
}

const PAGE_TITLES: Record<string, { title: string; desc: string }> = {
    dashboard: { title: "Dashboard", desc: "Welcome back, Mohammed 👋" },
    employees: { title: "Employees", desc: "Manage your workforce" },
    leave: { title: "Leave Management", desc: "Track and approve leave requests" },
    payroll: { title: "Payroll", desc: "Salary processing and payslips" },
    performance: { title: "Performance", desc: "KPIs, goals and review cycles" },
    reports: { title: "Reports", desc: "Analytics and insights" },
    settings: { title: "Settings", desc: "System configuration" },
};

export default function Topbar({ page, onAction, actionLabel }: TopbarProps) {
    const info = PAGE_TITLES[page] || { title: page, desc: "" };
    const { notifications, markAllAsRead } = useNotifications();
    const unreadCount = notifications.filter(n => !n.read).length;
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="topbar">
            <div style={{ flex: 1 }}>
                <div className="topbar-title">{info.title}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{info.desc}</div>
            </div>

            {/* Notifications */}
            <div style={{ position: "relative" }} ref={dropdownRef}>
                <button
                    className="btn btn-ghost btn-icon"
                    style={{ position: "relative" }}
                    onClick={() => {
                        setShowDropdown(!showDropdown);
                        if (unreadCount > 0 && !showDropdown) {
                            markAllAsRead();
                        }
                    }}
                >
                    <span style={{ fontSize: 16 }}>🔔</span>
                    {unreadCount > 0 && (
                        <span style={{
                            position: "absolute", top: 4, right: 4,
                            width: 14, height: 14,
                            background: "var(--status-error)",
                            color: "white",
                            fontSize: 9,
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%"
                        }}>
                            {unreadCount}
                        </span>
                    )}
                </button>

                {showDropdown && (
                    <div style={{
                        position: "absolute", top: "100%", right: 0, marginTop: 8,
                        width: 300, background: "var(--bg-elevated)",
                        border: "1px solid var(--border-default)",
                        borderRadius: "var(--radius-md)",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                        zIndex: 50,
                        maxHeight: 350, overflowY: "auto"
                    }}>
                        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-default)", fontWeight: 600, fontSize: 14 }}>Notifications</div>
                        {notifications.length === 0 ? (
                            <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>No notifications</div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                {notifications.map(n => (
                                    <div key={n.id} style={{
                                        padding: "12px 16px",
                                        borderBottom: "1px solid var(--border-default)",
                                        fontSize: 13,
                                        background: n.read ? "transparent" : "rgba(99, 102, 241, 0.05)"
                                    }}>
                                        <div style={{ color: n.read ? "var(--text-secondary)" : "var(--text-primary)", fontWeight: n.read ? 400 : 500 }}>{n.message}</div>
                                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
                                            {n.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {onAction && actionLabel && (
                <button className="btn btn-primary" onClick={onAction}>
                    <span>+</span> {actionLabel}
                </button>
            )}
        </header>
    );
}
