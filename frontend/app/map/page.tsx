"use client";

import { useState } from "react";
// 1. Import next/dynamic
import dynamic from "next/dynamic";
import { NotificationButton } from "@/components/map-dashboard/notification-button";
import { AlertBanner } from "@/components/map-dashboard/alert-banner";
import { FarmCard } from "@/components/map-dashboard/farm-card";
import { LocateFixed, Loader2 } from "lucide-react";
import { useUI } from "@/components/map-dashboard/ui-context"; 

// 2. Dynamic import with SSR disabled
const MapBackground = dynamic(
  () => import("@/components/map-dashboard/map-background").then((mod) => mod.MapBackground),
  { ssr: false }
);

const MapMarkers = dynamic(
  () => import("@/components/map-dashboard/map-markers").then((mod) => mod.MapMarkers),
  { ssr: false }
);

export default function MapDashboard() {
  const { setLocation, setAddress } = useUI();
  const [isLocating, setIsLocating] = useState(false);

  // Use the location button to sync device GPS
  const handleSyncLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation([pos.coords.latitude, pos.coords.longitude]);
          setAddress("My Current Location (GPS)"); 
          setIsLocating(false);
        },
        (err) => {
          console.error("GPS Sync error:", err);
          setIsLocating(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setIsLocating(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#e8f5e9] pb-32 flex flex-col">
      
      {/* Top Section: Alerts and Notifications */}
      <div className="px-5 pt-12 pb-6 flex items-center gap-3">
        <div className="flex-1 shadow-sm rounded-2xl">
          <AlertBanner />
        </div>
        <div className="shadow-sm rounded-full bg-white border border-gray-100 flex-shrink-0">
          <NotificationButton />
        </div>
      </div>

      {/* Middle Section: Interactive Map Canvas */}
      <div className="px-5 mb-8">
        <div className="relative w-full h-[70vh] min-h-[500px] bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden">
          
          <div className="absolute inset-0 z-0">
            {/* Map layers loaded client-side via dynamic import */}
            <MapBackground />
            <MapMarkers />
          </div>

          {/* Floating action button for GPS sync */}
          <div className="absolute bottom-4 right-4 z-10">
            <button 
              onClick={handleSyncLocation}
              disabled={isLocating}
              className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-[#2a5d44] hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-70"
            >
              {isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <LocateFixed className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Farm Details */}
      <div className="px-5 flex flex-col gap-2">
        <h2 className="text-lg font-extrabold text-gray-800 ml-1">Farm Overview</h2>
        <FarmCard />
      </div>

    </main>
  );
}