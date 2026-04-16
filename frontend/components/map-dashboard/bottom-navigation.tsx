"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Store, Home, User, Camera, Mic, MessageCircle, X, Plus } from "lucide-react";
import { useUI } from "./ui-context";

export function BottomNavigation() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const { setAIOverlayTab, setIsAIOverlayOpen } = useUI();

    if (pathname === "/onboarding" || pathname === "/login") {
    return null;
  }

  const navItems = [
    { id: "home", icon: Home, label: "Home", href: "/home" },
    { id: "map", icon: Map, label: "Map", href: "/map" },
    { id: "store", icon: Store, label: "Store", href: "/store" },
    { id: "profile", icon: User, label: "Profile", href: "/profile" },
  ];

  const actionItems: Array<{
    id: "scan" | "voice" | "chat";
    icon: typeof Camera;
    label: string;
    description: string;
    color: string;
  }> = [
    { 
      id: "scan", 
      icon: Camera, 
      label: "Scan", 
      description: "Identify disease or problem",
      color: "bg-[#4caf50]"
    },
    { 
      id: "voice", 
      icon: Mic, 
      label: "Voice", 
      description: "Speak your question",
      color: "bg-[#42a5f5]"
    },
    { 
      id: "chat", 
      icon: MessageCircle, 
      label: "AI Chat", 
      description: "Chat with farm assistant",
      color: "bg-[#7e57c2]"
    },
  ];

  return (
    <>
      {/* Backdrop when expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Expanded Action Menu */}
      {isExpanded && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
          {actionItems.map((item, index) => (
            <button
              key={item.id}
              className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2.5 shadow-lg transform transition-all hover:scale-105 active:scale-95"
              style={{
                animation: `slideUp 0.25s ease-out ${index * 0.08}s both`
              }}
              onClick={() => {
                setIsExpanded(false);
                setAIOverlayTab(item.id);
                setIsAIOverlayOpen(true);
              }}
            >
              <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-left pr-2">
                <p className="text-sm font-medium text-gray-800">{item.label}</p>
                <p className="text-[10px] text-gray-500">{item.description}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 safe-area-bottom">
        <div className="bg-white rounded-2xl shadow-lg border border-white/50">
          <div className="flex items-center justify-around px-1 py-2 relative">
            {/* First two nav items */}
            {navItems.slice(0, 2).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex flex-col items-center gap-0.5 px-4 py-1.5"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  pathname === item.href ? "bg-[#4caf50]/10" : ""
                }`}>
                  <item.icon className={`w-5 h-5 transition-colors ${
                    pathname === item.href ? "text-[#4caf50]" : "text-gray-400"
                  }`} />
                </div>
                <span className={`text-[10px] font-medium transition-colors ${
                  pathname === item.href ? "text-[#4caf50]" : "text-gray-400"
                }`}>{item.label}</span>
              </Link>
            ))}

            {/* Center spacer for FAB */}
            <div className="w-14" />

            {/* Last two nav items */}
            {navItems.slice(2).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex flex-col items-center gap-0.5 px-4 py-1.5"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  pathname === item.href ? "bg-[#4caf50]/10" : ""
                }`}>
                  <item.icon className={`w-5 h-5 transition-colors ${
                    pathname === item.href ? "text-[#4caf50]" : "text-gray-400"
                  }`} />
                </div>
                <span className={`text-[10px] font-medium transition-colors ${
                  pathname === item.href ? "text-[#4caf50]" : "text-gray-400"
                }`}>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Floating Action Button - More refined */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-5">
          <button 
            className="relative"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {/* Button */}
            <div className={`relative w-14 h-14 bg-[#4caf50] rounded-full shadow-md flex items-center justify-center transform transition-all duration-200 border-[3px] border-white ${
              isExpanded ? "rotate-45 bg-gray-600" : "hover:bg-[#43a047] active:scale-95"
            }`}>
              {isExpanded ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Plus className="w-6 h-6 text-white" />
              )}
            </div>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}