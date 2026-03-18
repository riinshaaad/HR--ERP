"use client";
import React, { createContext, useContext, useState, useMemo } from "react";

export type DateRange = string;

type DateContextType = {
    dateRange: DateRange;
    setDateRange: (range: DateRange) => void;
};

export function generateRecentMonths(count = 12) {
    const list = [];
    const date = new Date();
    for (let i = 0; i < count; i++) {
        const year = date.getFullYear();
        const monthNum = date.getMonth() + 1;
        const mm = monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
        const monthName = date.toLocaleString('default', { month: 'long' });
        list.push({ value: `${year}-${mm}`, label: `${monthName} ${year}` });
        date.setMonth(date.getMonth() - 1);
    }
    return list;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export function DateProvider({ children }: { children: React.ReactNode }) {
    const defaultMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
    const [dateRange, setDateRange] = useState<DateRange>(defaultMonth);
    const recentMonths = useMemo(() => generateRecentMonths(24), []); // Last 24 months

    return (
        <DateContext.Provider value={{ dateRange, setDateRange }}>
            {children}
        </DateContext.Provider>
    );
}

export function useDateRange() {
    const context = useContext(DateContext);
    if (context === undefined) {
        throw new Error("useDateRange must be used within a DateProvider");
    }
    return context;
}
