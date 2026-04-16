"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface UIContextType {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  
  location: [number, number];
  setLocation: (loc: [number, number]) => void;
  

  address: string;
  setAddress: (addr: string) => void;

  isAIOverlayOpen: boolean;
  setIsAIOverlayOpen: (open: boolean) => void;
  aiOverlayTab: "scan" | "voice" | "chat";
  setAIOverlayTab: (tab: "scan" | "voice" | "chat") => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  

  const [location, setLocation] = useState<[number, number]>([3.0458, 101.4324]);
  

  const [address, setAddress] = useState("Klang, Selangor, Malaysia");
  const [isAIOverlayOpen, setIsAIOverlayOpen] = useState(false);
  const [aiOverlayTab, setAIOverlayTab] = useState<"scan" | "voice" | "chat">("scan");

  return (
    <UIContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        location,
        setLocation,
        address,
        setAddress,
        isAIOverlayOpen,
        setIsAIOverlayOpen,
        aiOverlayTab,
        setAIOverlayTab,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}