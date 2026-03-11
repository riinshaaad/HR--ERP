"use client";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { DateProvider } from "@/contexts/DateContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <SettingsProvider>
                <NotificationProvider>
                    <DateProvider>
                        <ChatProvider>
                            {children}
                        </ChatProvider>
                    </DateProvider>
                </NotificationProvider>
            </SettingsProvider>
        </ThemeProvider>
    );
}
