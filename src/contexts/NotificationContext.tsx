"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Notification {
    id: string;
    message: string;
    read: boolean;
    time: Date;
}

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (message: string) => void;
    markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([
        { id: "1", message: "Welcome to HRX Dashboard!", read: true, time: new Date() }
    ]);

    const addNotification = (message: string) => {
        const newNotif = { id: Date.now().toString(), message, read: false, time: new Date() };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, markAllAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
}
