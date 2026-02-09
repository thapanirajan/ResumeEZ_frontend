"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextType {
    isSidebarVisible: boolean;
    setSidebarVisible: (visible: boolean) => void;
    toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isSidebarVisible, setSidebarVisible] = useState(true);

    const toggleSidebar = () => setSidebarVisible((prev) => !prev);

    return (
        <SidebarContext.Provider value={{ isSidebarVisible, setSidebarVisible, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
}
