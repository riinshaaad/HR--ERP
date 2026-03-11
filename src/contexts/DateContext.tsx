"use client";
import React, { createContext, useContext, useState } from "react";

export type DateRange = "This Month" | "Last Month" | "This Quarter" | "Last Quarter" | "Last 6 Months" | "This Year" | "All Time";

type DateContextType = {
    dateRange: DateRange;
    setDateRange: (range: DateRange) => void;
};

const DateContext = createContext<DateContextType | undefined>(undefined);

export function DateProvider({ children }: { children: React.ReactNode }) {
    const [dateRange, setDateRange] = useState<DateRange>("Last 6 Months");

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
