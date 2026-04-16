"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  MapPin,
  Camera,
  Mic,
  User,
  X,
  Edit3,
  Leaf,
  Package,
  Clock,
  ChevronRight,
  Truck,
  CheckCircle,
  Mail,
  CreditCard,
  Save,
  LogOut,
  Loader2,
} from "lucide-react"

import { useUI } from "../../components/map-dashboard/ui-context" // Access shared UI state

export default function ProfilePage() {
  const router = useRouter()
  const { address } = useUI() // Read shared address from context
  const [farmingMode, setFarmingMode] = useState<"organic" | "conventional">("organic")
  
  // Modal visibility state
  const [showEditModal, setShowEditModal] = useState(false)
  const [showLoggingOut, setShowLoggingOut] = useState(false)
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current)
    }
  }, [])

  const handleLogout = () => {
    setShowLoggingOut(true)
    logoutTimerRef.current = setTimeout(() => {
      router.push("/login")
    }, 1800)
  }

  // Real user data state (to demonstrate live updates)
  const [userInfo, setUserInfo] = useState({
    name: "Pak Ali",
    farm: "Green Valley Estate",
    email: "pak.ali.farm@gmail.com",
    payment: "Tng E-wallet",
    location: "Central Valley, CA 93210" // Kept for compatibility; UI shows shared address
  })

  // Temporary state for the edit form
  const [editForm, setEditForm] = useState({ ...userInfo })

  const handleSaveProfile = () => {
    setUserInfo(editForm)
    setShowEditModal(false)
  }

  const aiLogs = [
    { id: 1, type: "camera", icon: Camera, title: "Leaf Rust detected in Field B", method: "Camera Scan", time: "Yesterday", color: "bg-[#4caf50]" },
    { id: 2, type: "voice", icon: Mic, title: "Checked optimal harvest time", method: "Voice Query", time: "3 days ago", color: "bg-[#42a5f5]" },
  ]

  const orders = [
    {
      id: 1,
      product: "Fungicide Pro",
      orderDate: "Apr 7, 2026",
      deliveryDate: "Apr 11, 2026 (est.)",
      status: "In Transit",
      statusColor: "bg-amber-500/15 text-amber-700",
    },
    {
      id: 2,
      product: "Organic Fertilizer",
      orderDate: "Apr 3, 2026",
      deliveryDate: "Apr 5, 2026",
      status: "Delivered",
      statusColor: "bg-[#4caf50]/15 text-[#4caf50]",
    },
  ]

  return (
    <div className="min-h-screen bg-[#e8f5e9] pb-28 relative">
      {/* Header - Profile Identity */}
      <header className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#4caf50]/20 border-2 border-[#4caf50]/30 flex items-center justify-center overflow-hidden shadow-sm">
              <User className="w-8 h-8 text-[#4caf50]" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">{userInfo.name}</h1>
              <p className="text-sm text-gray-500 flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-[#4caf50]" />
                {userInfo.farm}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleLogout}
              className="bg-white/60 hover:bg-white p-2.5 rounded-full shadow-sm transition-all border border-white"
              aria-label="Log out"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
            <button
              type="button"
              onClick={() => {
                setEditForm({ ...userInfo })
                setShowEditModal(true)
              }}
              className="bg-white/60 hover:bg-white p-2.5 rounded-full shadow-sm transition-all border border-white"
              aria-label="Edit profile"
            >
              <Edit3 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Farm Details & AI Preferences */}
      <section className="px-5 mb-5">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/50">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Farm Details & Settings</h2>
          
          {/* Location */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
            <div className="bg-[#4caf50]/10 rounded-lg p-2">
              <MapPin className="w-5 h-5 text-[#4caf50]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Location</p>
              {/* Replaced hardcoded location with selected map address */}
              <p className="text-sm font-medium text-gray-800">{address}</p>
            </div>
          </div>

          {/* Email Account */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
            <div className="bg-orange-500/10 rounded-lg p-2">
              <Mail className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Account Email (Gmail)</p>
              <p className="text-sm font-medium text-gray-800">{userInfo.email}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
            <div className="bg-blue-500/10 rounded-lg p-2">
              <CreditCard className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Default Payment Method</p>
              <p className="text-sm font-medium text-gray-800">{userInfo.payment}</p>
            </div>
          </div>

          {/* AI Recommendation Mode */}
          <div>
            <p className="text-xs text-gray-500 mb-2">AI Recommendation Mode</p>
            <div className="flex gap-2">
              <button
                onClick={() => setFarmingMode("organic")}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  farmingMode === "organic"
                    ? "bg-[#4caf50] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Organic
              </button>
              <button
                onClick={() => setFarmingMode("conventional")}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  farmingMode === "conventional"
                    ? "bg-[#4caf50] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Standard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Diagnostic Log */}
      <section className="px-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-800">AI Diagnostic Log</h2>
          <button className="text-sm text-[#4caf50] font-medium">View All</button>
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/50">
          <div className="space-y-3">
            {aiLogs.map((log, index) => (
              <div key={log.id} className={`w-full flex items-start gap-3 p-3 rounded-xl hover:bg-[#4caf50]/5 transition-colors text-left ${index !== aiLogs.length - 1 ? "border-b border-gray-100" : ""}`}>
                <div className={`${log.color} rounded-lg p-2 flex-shrink-0`}>
                  <log.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{log.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{log.method}</span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{log.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order History */}
      <section className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-800">Recent Orders</h2>
          <button className="text-sm text-[#4caf50] font-medium">View All</button>
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/50">
          <div className="space-y-3">
            {orders.map((order, index) => (
              <div key={order.id} className={`flex items-center gap-3 p-3 rounded-xl ${index !== orders.length - 1 ? "border-b border-gray-100" : ""}`}>
                <div className="bg-gray-100 rounded-lg p-2 flex-shrink-0">
                  <Package className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{order.product}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    <span className="text-gray-500">Order date</span> {order.orderDate}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    <span className="text-gray-500">Delivery date</span> {order.deliveryDate}
                  </p>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${order.statusColor}`}>
                  {order.status === "In Transit" ? <Truck className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                  {order.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL: Edit Profile */}
      {showEditModal && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end bg-black/40 backdrop-blur-sm" style={{ animation: "fadeIn 0.2s ease-out" }}>
          <div 
            className="bg-white w-full h-[85vh] rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden"
            style={{ animation: "slideUpModal 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              
              {/* Profile Photo Mock */}
              <div className="flex flex-col items-center justify-center mb-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-[#4caf50]/20 border-4 border-white shadow-md flex items-center justify-center">
                    <User className="w-10 h-10 text-[#4caf50]" />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-[#4caf50] text-white p-2 rounded-full shadow-lg border-2 border-white">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full mt-1.5 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4caf50]/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Farm Name</label>
                  <input 
                    type="text" 
                    value={editForm.farm}
                    onChange={(e) => setEditForm({...editForm, farm: e.target.value})}
                    className="w-full mt-1.5 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4caf50]/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Email Address (Gmail)</label>
                  <input 
                    type="email" 
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full mt-1.5 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4caf50]/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Farm Location</label>
                  {/* Read-only because address syncs automatically from map/GPS */}
                  <input 
                    type="text" 
                    value={address}
                    readOnly
                    className="w-full mt-1.5 px-4 py-3.5 bg-gray-100 border border-gray-200 rounded-xl text-sm font-medium text-gray-500 cursor-not-allowed transition-all"
                  />
                  <p className="text-[10px] text-gray-400 mt-1 ml-1">Location is synced automatically via GPS/Map.</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Payment Method</label>
                  <div className="flex items-center justify-between w-full mt-1.5 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-medium text-gray-800">{editForm.payment}</span>
                    </div>
                    <button className="text-xs font-bold text-[#4caf50]">UPDATE</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer / Save Button */}
            <div className="p-5 bg-white border-t border-gray-100 safe-area-bottom">
              <button 
                onClick={handleSaveProfile}
                className="w-full bg-[#4caf50] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#43a047] active:scale-[0.98] transition-all shadow-lg shadow-[#4caf50]/20"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showLoggingOut && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm px-6"
          style={{ animation: "fadeIn 0.2s ease-out" }}
        >
          <div className="bg-white/80 backdrop-blur-md rounded-2xl px-10 py-7 shadow-lg border border-white/50 flex flex-col items-center gap-4 w-full max-w-[280px]">
            <Loader2 className="w-10 h-10 text-[#4caf50] animate-spin shrink-0" aria-hidden />
            <p className="text-sm font-semibold text-gray-800">Logging out</p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUpModal { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}