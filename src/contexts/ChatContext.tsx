"use client";
import React, { createContext, useContext, useState } from "react";

export type Message = {
    id: string;
    text: string;
    sender: "user" | "bot" | string;
    timestamp: string;
};

type ChatContextType = {
    threads: Record<string, Message[]>;
    activeThreadId: string;
    setActiveThreadId: (id: string) => void;
    sendMessage: (threadId: string, text: string) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [threads, setThreads] = useState<Record<string, Message[]>>({
        "group-chat": [
            { id: "1", text: "Welcome to the group chat! Say hi to everyone.", sender: "bot", timestamp: new Date().toLocaleTimeString() }
        ]
    });
    const [activeThreadId, setActiveThreadId] = useState<string>("group-chat");

    const sendMessage = (threadId: string, text: string) => {
        const userMsg: Message = { id: Date.now().toString(), text, sender: "user", timestamp: new Date().toLocaleTimeString() };

        setThreads(prev => {
            const currentThread = prev[threadId] || [];
            return {
                ...prev,
                [threadId]: [...currentThread, userMsg]
            };
        });


    };

    return (
        <ChatContext.Provider value={{ threads, activeThreadId, setActiveThreadId, sendMessage }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
}
