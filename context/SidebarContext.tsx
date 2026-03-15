"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SidebarContextType {
    isPinned: boolean;
    isExpanded: boolean;
    togglePin: () => void;
    setHovered: (hovered: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isPinned, setIsPinned] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("candidate-sidebar-pinned");
        if (stored === "true") setIsPinned(true);
    }, []);

    const togglePin = () => {
        setIsPinned((prev) => {
            const next = !prev;
            localStorage.setItem("candidate-sidebar-pinned", String(next));
            return next;
        });
    };

    return (
        <SidebarContext.Provider value={{
            isPinned,
            isExpanded: isPinned || isHovered,
            togglePin,
            setHovered: setIsHovered,
        }}>
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
