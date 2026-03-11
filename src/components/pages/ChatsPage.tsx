"use client";
import React, { useState, useEffect, useRef } from "react";
import { useChat } from "@/contexts/ChatContext";
import { employees } from "@/lib/data";

export default function ChatsPage() {
    const { threads, activeThreadId, setActiveThreadId, sendMessage } = useChat();
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const activeMessages = threads[activeThreadId] || [];

    const contacts = [
        { id: "group-chat", name: "General Group Chat", role: "All Team Members", avatar: "👥" },
        ...employees.map(emp => ({
            id: emp.id,
            name: emp.name,
            role: emp.role,
            avatar: emp.avatar
        }))
    ];

    const activeContact = contacts.find(c => c.id === activeThreadId);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        sendMessage(activeThreadId, inputValue.trim());
        setInputValue("");
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeMessages]);

    return (
        <div className="fade-in" style={{
            display: "flex",
            gap: 20,
            height: "calc(100vh - 120px)",
            overflow: "hidden"
        }}>
            {/* Contacts Sidebar */}
            <div className="card" style={{
                width: 320,
                display: "flex",
                flexDirection: "column",
                padding: "20px 0",
                overflowY: "hidden", /* We handle inner scroll */
                flexShrink: 0
            }}>
                <div style={{ padding: "0 20px", marginBottom: 16 }}>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>Conversations</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 4, overflowY: "auto", flex: 1 }}>
                    {contacts.map(contact => {
                        const isActive = contact.id === activeThreadId;
                        return (
                            <button
                                key={contact.id}
                                onClick={() => setActiveThreadId(contact.id)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "12px 20px",
                                    background: isActive ? "var(--bg-elevated)" : "transparent",
                                    border: "none",
                                    borderLeft: isActive ? "3px solid var(--brand-500)" : "3px solid transparent",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    transition: "background 0.2s",
                                    width: "100%"
                                }}
                            >
                                <div className="avatar avatar-md" style={{ background: contact.id === "group-chat" ? "var(--brand-600)" : undefined }}>
                                    {contact.avatar}
                                </div>
                                <div style={{ minWidth: 0, flex: 1 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {contact.name}
                                    </div>
                                    <div style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {contact.role}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="card" style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                padding: 0,
                overflow: "hidden"
            }}>
                {/* Chat Header */}
                <div style={{
                    padding: "20px 24px",
                    borderBottom: "1px solid var(--border-subtle)",
                    display: "flex",
                    alignItems: "center",
                    gap: 12
                }}>
                    <div className="avatar avatar-md" style={{ background: activeContact?.id === "group-chat" ? "var(--brand-600)" : undefined }}>
                        {activeContact?.avatar}
                    </div>
                    <div>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>{activeContact?.name}</div>
                        <div style={{ fontSize: 12, color: "var(--text-brand)", fontWeight: 500 }}>{activeContact?.role}</div>
                    </div>
                </div>

                {/* Messages Area */}
                <div style={{
                    flex: 1,
                    padding: 24,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16
                }}>
                    {activeMessages.length === 0 ? (
                        <div style={{ margin: "auto", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                            No messages here yet. Say hi!
                        </div>
                    ) : (
                        activeMessages.map((msg, i) => {
                            const isUser = msg.sender === "user";
                            return (
                                <div key={msg.id || i} style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: isUser ? "flex-end" : "flex-start",
                                    maxWidth: "100%"
                                }}>
                                    <div style={{
                                        background: isUser ? "var(--brand-600)" : "var(--bg-elevated)",
                                        color: isUser ? "#fff" : "var(--text-primary)",
                                        padding: "12px 16px",
                                        borderRadius: "var(--radius-lg)",
                                        borderBottomRightRadius: isUser ? 4 : "var(--radius-lg)",
                                        borderBottomLeftRadius: !isUser ? 4 : "var(--radius-lg)",
                                        maxWidth: "75%",
                                        fontSize: 14,
                                        lineHeight: 1.5,
                                        border: !isUser ? "1px solid var(--border-subtle)" : "none",
                                        boxShadow: isUser ? "var(--shadow-brand)" : "var(--shadow-sm)"
                                    }}>
                                        {msg.text}
                                    </div>
                                    <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 6, padding: "0 4px", display: "flex", gap: 6 }}>
                                        {!isUser && msg.sender !== "bot" && (
                                            <span style={{ fontWeight: 600 }}>{msg.sender}</span>
                                        )}
                                        <span>{msg.timestamp}</span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div style={{
                    padding: "16px 24px",
                    borderTop: "1px solid var(--border-subtle)",
                    background: "var(--bg-surface)"
                }}>
                    <form onSubmit={handleSend} style={{ display: "flex", gap: 12 }}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            style={{ flex: 1, padding: "12px 20px", borderRadius: 99, background: "var(--bg-elevated)", border: "1px solid var(--border-default)" }}
                        />
                        <button type="submit" className="btn btn-primary" style={{ borderRadius: 99, padding: "10px 24px", fontWeight: 600 }} disabled={!inputValue.trim()}>
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
