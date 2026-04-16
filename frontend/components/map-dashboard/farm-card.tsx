"use client";

import { useState, useEffect } from "react";
import { MapPin, Sun, Leaf, ChevronRight, Droplets, ChevronUp, X, Wheat, Apple, Carrot, TrendingUp, Calendar, DollarSign, ChevronDown, Check } from "lucide-react";
import { useUI } from "./ui-context";

interface CropData {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  growth: number;
  humidity: number;
  plantedDate: string;
  harvestDate: string;
  expectedYield: string;
  marketPrice: string;
  healthStatus: "Excellent" | "Good" | "Fair" | "Poor";
  prediction: string;
}

const crops: CropData[] = [
  {
    id: "tomatoes",
    name: "Tomatoes",
    icon: <Apple className="w-5 h-5 text-white" />,
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50",
    growth: 68,
    humidity: 78,
    plantedDate: "Feb 15, 2026",
    harvestDate: "May 20, 2026",
    expectedYield: "2,500 kg",
    marketPrice: "RM 4.50/kg",
    healthStatus: "Excellent",
    prediction: "High yield expected. Optimal growing conditions detected.",
  },
  {
    id: "wheat",
    name: "Wheat",
    icon: <Wheat className="w-5 h-5 text-white" />,
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-50",
    growth: 85,
    humidity: 62,
    plantedDate: "Jan 10, 2026",
    harvestDate: "Apr 25, 2026",
    expectedYield: "4,200 kg",
    marketPrice: "RM 2.80/kg",
    healthStatus: "Good",
    prediction: "Ready for harvest soon. Monitor moisture levels.",
  },
  {
    id: "carrots",
    name: "Carrots",
    icon: <Carrot className="w-5 h-5 text-white" />,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    growth: 45,
    humidity: 70,
    plantedDate: "Mar 5, 2026",
    harvestDate: "Jun 15, 2026",
    expectedYield: "1,800 kg",
    marketPrice: "RM 3.20/kg",
    healthStatus: "Good",
    prediction: "Growing well. Consider additional fertilizer next week.",
  },
  {
    id: "corn",
    name: "Corn",
    icon: <Leaf className="w-5 h-5 text-white" />,
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-50",
    growth: 32,
    humidity: 65,
    plantedDate: "Mar 20, 2026",
    harvestDate: "Jul 10, 2026",
    expectedYield: "3,000 kg",
    marketPrice: "RM 2.10/kg",
    healthStatus: "Fair",
    prediction: "Needs more water. Irrigation recommended.",
  },
];

export function FarmCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<CropData>(crops[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Destructure location and setLocation from your existing UI context
  const { isModalOpen, setIsModalOpen, location, setLocation } = useUI();

  useEffect(() => {
    setIsModalOpen(isExpanded);
  }, [isExpanded, setIsModalOpen]);

  const getHealthColor = (status: string) => {
    switch (status) {
      case "Excellent": return "text-green-600 bg-green-100";
      case "Good": return "text-blue-600 bg-blue-100";
      case "Fair": return "text-amber-600 bg-amber-100";
      case "Poor": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const closeModal = () => {
    setIsExpanded(false);
    setIsDropdownOpen(false);
  };

  // Real GPS Sync logic
  const handleSyncLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => console.error("Sync error:", err),
        { enableHighAccuracy: true }
      );
    }
  };

  // Hide collapsed state when another modal is open
  if (isModalOpen && !isExpanded) {
    return null;
  }

  return (
    <>
      {/* Collapsed State - Small Chip */}
      {!isExpanded && (
        <div className="fixed bottom-[88px] left-4 right-4 z-30">
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full glass-card rounded-2xl shadow-lg px-4 py-3 flex items-center justify-between active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${selectedCrop.color} rounded-xl flex items-center justify-center shadow-md`}>
                {selectedCrop.icon}
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-gray-800">My Farm</h3>
                <p className="text-xs text-gray-500">Tap to view {selectedCrop.name} details</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-semibold text-amber-600">32°C</span>
              </div>
              <ChevronUp className="w-5 h-5 text-gray-400" />
            </div>
          </button>
        </div>
      )}

      {/* Expanded State - Full Screen Modal */}
      {isExpanded && (
        <div className="fixed inset-0 z-[100]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={closeModal}
          />

          {/* Modal Container */}
          <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
            <div 
              className="w-full max-w-lg bg-white rounded-t-3xl shadow-2xl flex flex-col pointer-events-auto animate-in slide-in-from-bottom duration-300"
              style={{ maxHeight: "calc(100dvh - 40px)" }}
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Sticky Header with Close Button */}
              <div className="px-5 pt-2 pb-3 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${selectedCrop.color} rounded-xl flex items-center justify-center shadow-md`}>
                      {selectedCrop.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">My Farm</h3>
                      <button 
                        onClick={handleSyncLocation}
                        className="flex items-center gap-1 mt-0.5 active:opacity-60 transition-opacity"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#689f38]" />
                        <span className="text-xs text-gray-500 border-b border-dashed border-gray-400">
                          {location[0].toFixed(4)}, {location[1].toFixed(4)} (Tap to Sync GPS)
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full">
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-semibold text-amber-600">32°C</span>
                    </div>
                    <button
                      onClick={closeModal}
                      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors active:scale-95"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                {/* Crop Selection Dropdown */}
                <div className="px-5 py-3">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-2">Select Crop</p>
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                        isDropdownOpen 
                          ? "border-[#4caf50] bg-green-50" 
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedCrop.color} flex items-center justify-center shadow-sm`}>
                          {selectedCrop.icon}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-gray-800">{selectedCrop.name}</p>
                          <p className="text-xs text-gray-500">{selectedCrop.growth}% grown</p>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-10">
                        {crops.map((crop) => (
                          <button
                            key={crop.id}
                            onClick={() => {
                              setSelectedCrop(crop);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between gap-3 px-4 py-3 transition-colors ${
                              selectedCrop.id === crop.id 
                                ? "bg-green-50" 
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${crop.color} flex items-center justify-center`}>
                                {crop.icon}
                              </div>
                              <div className="text-left">
                                <p className="text-sm font-medium text-gray-800">{crop.name}</p>
                                <p className="text-xs text-gray-500">{crop.growth}% grown</p>
                              </div>
                            </div>
                            {selectedCrop.id === crop.id && (
                              <Check className="w-5 h-5 text-[#4caf50]" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats Row */}
                <div className="px-5 py-2 flex items-center gap-3">
                  <div className={`flex-1 ${selectedCrop.bgColor} rounded-xl p-3`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 bg-gradient-to-br ${selectedCrop.color} rounded-lg flex items-center justify-center`}>
                        <Leaf className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">Crop</p>
                        <p className="text-sm font-semibold text-gray-800">{selectedCrop.name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 bg-blue-50 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Droplets className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">Humidity</p>
                        <p className="text-sm font-semibold text-gray-800">{selectedCrop.humidity}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="px-5 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Growth Progress</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getHealthColor(selectedCrop.healthStatus)}`}>
                        {selectedCrop.healthStatus}
                      </span>
                      <span className="text-xs font-semibold text-[#4caf50]">{selectedCrop.growth}%</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${selectedCrop.color} rounded-full transition-all duration-500`}
                      style={{ width: `${selectedCrop.growth}%` }}
                    />
                  </div>
                </div>

                {/* Crop Details Grid */}
                <div className="px-5 py-2 grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-[10px] text-gray-500 uppercase">Planted</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{selectedCrop.plantedDate}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-[10px] text-gray-500 uppercase">Harvest</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{selectedCrop.harvestDate}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-[10px] text-gray-500 uppercase">Expected Yield</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{selectedCrop.expectedYield}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-[10px] text-gray-500 uppercase">Market Price</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{selectedCrop.marketPrice}</p>
                  </div>
                </div>

                {/* Prediction Box */}
                <div className="px-5 py-3">
                  <div className="bg-gradient-to-r from-[#e8f5e9] to-[#c8e6c9] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-[#4caf50]" />
                      <span className="text-xs font-semibold text-[#2e7d32] uppercase">AI Prediction</span>
                    </div>
                    <p className="text-sm text-gray-700">{selectedCrop.prediction}</p>
                  </div>
                </div>
              </div>

              {/* Fixed Footer CTA */}
              <div className="flex-shrink-0 px-5 py-4 border-t border-gray-100 bg-white">
                <button className={`w-full bg-gradient-to-r ${selectedCrop.color} hover:opacity-90 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]`}>
                  <span>View Full {selectedCrop.name} Report</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}