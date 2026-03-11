"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "dark" | "light";

type ThemeContextType = {
    theme: Theme;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("dark");

    // Initialize theme on client-side mount without setting state in effect
    useEffect(() => {
        const savedTheme = localStorage.getItem("hrx-theme") as Theme;
        if (savedTheme === "light") {
            document.body.classList.add("light-theme");
            // Only update React state if it differs from the default to avoid unnecessary re-renders
            setTheme("light");
        } else {
            document.body.classList.remove("light-theme");
        }
    }, []);

    const toggleTheme = () => {
        setTheme(prev => {
            const nextTheme = prev === "dark" ? "light" : "dark";
            localStorage.setItem("hrx-theme", nextTheme);

            if (nextTheme === "light") {
                document.body.classList.add("light-theme");
            } else {
                document.body.classList.remove("light-theme");
            }
            return nextTheme;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
