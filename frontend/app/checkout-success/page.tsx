"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Home } from "lucide-react"

interface OrderData {
  id: string
  date: string
  type: string
  address: string
  subTotal: number
  delivery: number
}

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const [orderData, setOrderData] = useState<OrderData>({
    id: "CC-00000000",
    date: new Date().toLocaleString("en-MY", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    type: "Delivery",
    address: "N/A",
    subTotal: 0,
    delivery: 0,
  })

  useEffect(() => {
    const rawOrder = sessionStorage.getItem("latestOrder")
    if (!rawOrder) return

    try {
      const parsedOrder = JSON.parse(rawOrder) as Partial<OrderData>
      setOrderData({
        id: parsedOrder.id || "CC-00000000",
        date: parsedOrder.date || new Date().toLocaleString("en-MY", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        type: parsedOrder.type || "Delivery",
        address: parsedOrder.address || "N/A",
        subTotal: Number(parsedOrder.subTotal ?? 0),
        delivery: Number(parsedOrder.delivery ?? 0),
      })
    } catch {
      // Keep fallback data if storage parsing fails.
    }
  }, [])

  const total = orderData.subTotal + orderData.delivery
  const formatRM = (amount: number) => amount.toFixed(2)

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      {/* Receipt Card - max-w-sm to keep it slim and mobile-sized */}
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-xl overflow-hidden flex flex-col">
        
        {/* Header Section */}
        <div className="flex flex-col items-center pt-8 pb-4 px-6">
          <CheckCircle2 className="w-16 h-16 text-[#4caf50] mb-3" strokeWidth={1.5} />
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Payment Successful</h1>
          <p className="text-2xl font-black text-[#4caf50] mt-1">RM {formatRM(total)}</p>
        </div>

        {/* Dashed Divider */}
        <div className="relative flex items-center justify-center px-4 my-2">
          <div className="absolute w-full border-t-2 border-dashed border-neutral-100"></div>
          <div className="absolute left-[-8px] w-4 h-4 bg-neutral-100 rounded-full"></div>
          <div className="absolute right-[-8px] w-4 h-4 bg-neutral-100 rounded-full"></div>
        </div>

        {/* Order Details Section */}
        <div className="px-6 py-4 space-y-3.5 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-neutral-500">Order ID</span>
            <span className="font-semibold text-neutral-800">{orderData.id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500">Order Type</span>
            <span className="font-semibold text-neutral-800">{orderData.type}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500">Address</span>
            <span className="font-semibold text-neutral-800 truncate max-w-[150px]">{orderData.address}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500">Date</span>
            <span className="font-semibold text-neutral-800">{orderData.date}</span>
          </div>
        </div>

        {/* Dashed Divider */}
        <div className="w-full border-t-2 border-dashed border-neutral-100 my-1"></div>

        {/* Pricing Section */}
        <div className="px-6 py-4 space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-neutral-500">Sub Total</span>
            <span className="font-medium text-neutral-800">RM {formatRM(orderData.subTotal)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500">Delivery Charge</span>
            <span className="font-medium text-neutral-800">+ RM {formatRM(orderData.delivery)}</span>
          </div>
        </div>

        {/* Action Button Section */}
        <div className="p-6 pt-4 mt-auto">
          <button 
            onClick={() => router.push("/home")}
            className="w-full bg-[#4caf50] text-white py-3.5 rounded-2xl font-semibold hover:bg-[#43a047] transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Home className="w-5 h-5" />
            Return to Home
          </button>
        </div>

      </div>
    </div>
  )
}