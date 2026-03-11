"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type SettingsContextType = {
    defaultCurrency: string;
    setDefaultCurrency: (currency: string) => void;
    formatCurrency: (amount: number) => string;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const EXCHANGE_RATES: Record<string, number> = {
    "USD": 1,
    "EUR": 0.92,
    "GBP": 0.79,
    "INR": 83.2,
    "AUD": 1.54,
    "CAD": 1.35,
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [defaultCurrency, setDefaultCurrency] = useState("USD");

    const formatCurrency = (amount: number) => {
        // Convert the base USD amount to the selected currency
        const rate = EXCHANGE_RATES[defaultCurrency] || 1;
        const convertedAmount = amount * rate;

        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: defaultCurrency,
        }).format(convertedAmount);
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
