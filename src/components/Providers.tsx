"use client";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <SettingsProvider>
                <NotificationProvider>
                    <ChatProvider>
                        {children}
                    </ChatProvider>
                </NotificationProvider>
            </SettingsProvider>
        </ThemeProvider>
    );
}
