"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type SettingsContextType = {
    defaultCurrency: string;
    setDefaultCurrency: (currency: string) => void;
    formatCurrency: (amount: number) => string;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [defaultCurrency, setDefaultCurrency] = useState("USD");

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: defaultCurrency,
        }).format(amount);
    };

    return (
        <SettingsContext.Provider value={{ defaultCurrency, setDefaultCurrency, formatCurrency }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}
