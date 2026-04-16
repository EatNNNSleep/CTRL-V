"use client";

import { AlertTriangle, ChevronRight, Shield, Pill, ShoppingCart, ArrowLeft, Check, X } from "lucide-react";
import { useState } from "react";
// 1. IMPORT useRouter
import { useRouter } from "next/navigation";

interface Medicine {
  id: string;
  name: string;
  type: string;
  price: number;
  image: string;
  rating: number;
  inStock: boolean;
}

const preventionTips = [
  "Remove and destroy infected plant debris immediately",
  "Apply fungicide spray every 7-10 days during wet weather",
  "Ensure proper spacing between plants for air circulation",
  "Water plants at the base to keep leaves dry",
  "Rotate crops annually to prevent disease buildup",
];

const recommendedMedicines: Medicine[] = [
  {
    id: "1",
    name: "FungiClear Pro",
    type: "Fungicide Spray",
    price: 45.90,
    image: "FC",
    rating: 4.8,
    inStock: true,
  },
  {
    id: "2",
    name: "RustAway Plus",
    type: "Leaf Treatment",
    price: 32.50,
    image: "RA",
    rating: 4.5,
    inStock: true,
  },
  {
    id: "3",
    name: "CropShield 360",
    type: "Preventive Spray",
    price: 58.00,
    image: "CS",
    rating: 4.9,
    inStock: false,
  },
  {
    id: "4",
    name: "BioGuard Natural",
    type: "Organic Treatment",
    price: 28.90,
    image: "BG",
    rating: 4.3,
    inStock: true,
  },
];

export function AlertBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [cart, setCart] = useState<string[]>([]);
  // 2. ADD ROUTER AND PROCESSING STATE
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleCart = (id: string) => {
    setCart(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const closeModal = () => {
    setShowDetails(false);
  };

  // 3. ADD CHECKOUT HANDLER EXACTLY LIKE THE STORE
  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      router.push('/checkout-success');
    }, 1500);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Compact Alert Banner */}
      <div 
        className="bg-red-50 border border-red-200 rounded-xl shadow-md cursor-pointer active:scale-[0.98] transition-transform"
        onClick={() => setShowDetails(true)}
      >
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="flex-shrink-0 w-7 h-7 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-red-700 truncate">Leaf Rust Alert - 5km</p>
          </div>
          <ChevronRight className="w-4 h-4 text-red-500 flex-shrink-0" />
        </div>
      </div>

      {/* Full Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-[100]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={closeModal}
          />

          {/* Modal Container */}
          <div className="absolute inset-0 flex items-end justify-center pointer-events-none pb-[160px] px-4">
            <div 
              className="w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col pointer-events-auto animate-in slide-in-from-bottom duration-300 overflow-hidden"
              style={{ maxHeight: "calc(100dvh - 220px)" }}
            >
              {/* Header */}
              <div className="flex-shrink-0 px-5 pt-3 pb-3 border-b border-gray-100 bg-white">
                <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
                <div className="flex items-center gap-3">
                  <button
                    onClick={closeModal}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors active:scale-95"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-800">Disease Alert</h2>
                    <p className="text-xs text-gray-500">Leaf Rust - 5km from your farm</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors active:scale-95"
                  >
                    <X className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto overscroll-contain bg-white">
                {/* Threat Level */}
                <div className="px-5 py-4 bg-red-50 border-b border-red-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-red-600 font-medium">Threat Level</p>
                      <p className="text-lg font-bold text-red-700">Moderate Risk</p>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`w-5 h-2 rounded-full ${
                            level <= 3 ? "bg-red-500" : "bg-red-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Prevention Tips */}
                <div className="px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-[#4caf50]" />
                    <h3 className="font-semibold text-gray-800">Prevention Tips</h3>
                  </div>
                  <div className="space-y-2">
                    {preventionTips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-[#4caf50]" />
                        </div>
                        <p className="text-sm text-gray-600">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Medicines */}
                <div className="px-5 py-4 pb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Pill className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-gray-800">Recommended Products</h3>
                  </div>
                  <div className="space-y-3">
                    {recommendedMedicines.map((medicine) => (
                      <div
                        key={medicine.id}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          cart.includes(medicine.id)
                            ? "border-[#4caf50] bg-green-50"
                            : "border-gray-100 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-xs">{medicine.image}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-semibold text-gray-800 text-sm">{medicine.name}</h4>
                                <p className="text-xs text-gray-500">{medicine.type}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-[#4caf50] text-sm">RM {medicine.price.toFixed(2)}</p>
                                <div className="flex items-center gap-1">
                                  <span className="text-yellow-500 text-xs">★</span>
                                  <span className="text-xs text-gray-500">{medicine.rating}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                medicine.inStock 
                                  ? "bg-green-100 text-green-700" 
                                  : "bg-red-100 text-red-600"
                              }`}>
                                {medicine.inStock ? "In Stock" : "Out of Stock"}
                              </span>
                              <button
                                onClick={() => medicine.inStock && toggleCart(medicine.id)}
                                disabled={!medicine.inStock}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                                  cart.includes(medicine.id)
                                    ? "bg-[#4caf50] text-white"
                                    : medicine.inStock
                                    ? "bg-white border border-gray-200 text-gray-700 hover:border-[#4caf50]"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                              >
                                {cart.includes(medicine.id) ? "Added ✓" : "Add to Cart"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer with Cart */}
              <div className="flex-shrink-0 px-5 py-4 border-t border-gray-100 bg-white">
                <div className="flex items-center gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 active:scale-[0.98] transition-all"
                  >
                    Back to Map
                  </button>
                  {cart.length > 0 && (
                    /* 4. REPLACE CHECKOUT BUTTON WITH STORE LOGIC */
                    <button 
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className={`flex-1 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all ${
                        isProcessing 
                          ? "bg-[#4caf50]/70 text-white cursor-wait" 
                          : "bg-[#4caf50] text-white shadow-lg shadow-green-500/25"
                      }`}
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing...
                        </span>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          <span>Checkout ({cart.length})</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}