"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  AlertTriangle,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  Star,
  MapPin,
  Leaf,
  Droplets,
  Package,
  Sparkles,
  X,
  ChevronRight
} from "lucide-react"

interface Product {
  id: number
  name: string
  category: string
  price: number
  rating: number
  inStock: boolean
  description: string
  image: string
}

interface CartItem {
  product: Product
  quantity: number
}

const categories = [
  { id: "all", label: "All Products", icon: Package },
  { id: "treatments", label: "Treatments", icon: Leaf },
  { id: "fertilizers", label: "Fertilizers", icon: Droplets },
  { id: "seeds", label: "Seeds", icon: Sparkles },
]

const products: Product[] = [
  {
    id: 1,
    name: "Fungicide Pro",
    category: "treatments",
    price: 45.99,
    rating: 4.8,
    inStock: true,
    description: "Broad-spectrum fungal control",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    name: "Organic Pest Shield",
    category: "treatments",
    price: 32.50,
    rating: 4.6,
    inStock: true,
    description: "Natural pest deterrent",
    image: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=200&h=200&fit=crop",
  },
  {
    id: 3,
    name: "NitroMax 20-20-20",
    category: "fertilizers",
    price: 28.99,
    rating: 4.9,
    inStock: true,
    description: "Balanced NPK formula",
    image: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=200&h=200&fit=crop",
  },
  {
    id: 4,
    name: "Root Boost Plus",
    category: "fertilizers",
    price: 19.99,
    rating: 4.5,
    inStock: false,
    description: "Root development enhancer",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=200&h=200&fit=crop",
  },
  {
    id: 5,
    name: "Heirloom Tomato Seeds",
    category: "seeds",
    price: 12.99,
    rating: 4.7,
    inStock: true,
    description: "Non-GMO variety pack",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=200&h=200&fit=crop",
  },
  {
    id: 6,
    name: "Disease-Resistant Corn",
    category: "seeds",
    price: 24.99,
    rating: 4.4,
    inStock: true,
    description: "High-yield hybrid seeds",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=200&h=200&fit=crop",
  },
]

export default function StorePage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeCategory, setActiveCategory] = useState("all")
  const [cart, setCart] = useState<CartItem[]>([])

  // ================= Delivery Address States =================
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "Pak Ali",
    phone: "+60 12-345 6789",
    street: "123 Jalan Pertanian",
    postcode: "41000",
    city: "Klang, Selangor"
  })
  // Temporary form state for editing
  const [addressForm, setAddressForm] = useState({ ...deliveryInfo })

  const handleCheckout = () => {
    const subTotalSnapshot = Number(
      cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)
    )
    setIsProcessing(true) 
    setTimeout(() => {
      const deliveryCharge = 0
      const orderSummary = {
        id: `CC-${Date.now().toString().slice(-8)}`,
        date: new Date().toLocaleString("en-MY", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        type: "Delivery",
        address: `${deliveryInfo.name}, ${deliveryInfo.street}, ${deliveryInfo.city}`,
        subTotal: subTotalSnapshot,
        delivery: deliveryCharge,
      }
      sessionStorage.setItem("latestOrder", JSON.stringify(orderSummary))
      router.push('/checkout-success')
    }, 1500)
  }

  const handleSaveAddress = () => {
    setDeliveryInfo(addressForm)
    setShowAddressModal(false)
  }

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory)

  const getCartQuantity = (productId: number) => {
    const item = cart.find((item) => item.product.id === productId)
    return item ? item.quantity : 0
  }

  const addToCart = (product: Product) => {
    if (!product.inStock) return
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === productId)
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      }
      return prev.filter((item) => item.product.id !== productId)
    })
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const checkoutAmount = Number(totalPrice.toFixed(2))

  return (
    <div className="min-h-screen bg-[#e8f5e9] pb-28 relative">
      {/* Header - Store & Editable Delivery Address */}
      <header className="px-5 pt-6 pb-4">
        <h1 className="text-xl font-semibold text-gray-800">Store</h1>
        <button 
          onClick={() => {
            setAddressForm({ ...deliveryInfo })
            setShowAddressModal(true)
          }}
          className="flex items-center justify-between w-full mt-2 bg-white/60 hover:bg-white/80 p-3 rounded-2xl border border-white/50 shadow-sm active:scale-[0.98] transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <div className="bg-[#4caf50]/10 p-2 rounded-xl flex-shrink-0">
              <MapPin className="h-5 w-5 text-[#4caf50]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivery Address</p>
              <p className="text-sm font-semibold text-gray-800 truncate">
                {deliveryInfo.street}, {deliveryInfo.city}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
        </button>
      </header>

      {/* Content */}
      <div className="px-5 space-y-4">
        {/* AI Action Plan Hero */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/50">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-red-500 font-medium uppercase tracking-wide">
                AI Alert 
              </p>
              <h2 className="text-gray-800 font-semibold mt-0.5">
                Leaf Rust Detected
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Early-stage infection identified. Immediate treatment recommended.
              </p>
            </div>
          </div>

          <div className="bg-[#4caf50]/10 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop"
                alt="Fungicide Pro"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#4caf50] font-medium">
                Recommended Solution
              </p>
              <h3 className="text-gray-800 font-semibold">Fungicide Pro</h3>
              <p className="text-[#4caf50] font-bold text-lg">RM {products[0].price.toFixed(2)}</p>
            </div>
            {getCartQuantity(1) > 0 ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => removeFromCart(1)}
                  className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <span className="w-6 text-center font-semibold text-gray-800">
                  {getCartQuantity(1)}
                </span>
                <button
                  onClick={() => addToCart(products[0])}
                  className="w-8 h-8 rounded-lg bg-[#4caf50] flex items-center justify-center hover:bg-[#43a047] transition-colors"
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(products[0])}
                className="px-4 py-2.5 rounded-xl font-medium text-sm bg-[#4caf50] text-white hover:bg-[#43a047] transition-all"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="overflow-x-auto -mx-5 px-5 scrollbar-hide">
          <div className="flex gap-2 pb-1">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                    activeCategory === cat.id
                      ? "bg-[#4caf50] text-white shadow-md"
                      : "bg-white/80 backdrop-blur-md text-gray-600 border border-white/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Products List */}
        <div className="space-y-3">
          <h2 className="text-gray-800 font-semibold text-base">
            {activeCategory === "all"
              ? "All Products"
              : categories.find((c) => c.id === activeCategory)?.label}
          </h2>

          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/50"
            >
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-gray-800 font-semibold truncate">
                        {product.name}
                      </h3>
                      <p className="text-gray-500 text-sm capitalize">
                        {product.category}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${
                        product.inStock
                          ? "bg-[#4caf50]/10 text-[#4caf50]"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  <p className="text-gray-400 text-xs mt-1">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[#4caf50] font-bold text-lg">
                        RM {product.price.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{product.rating}</span>
                      </div>
                    </div>

                    {!product.inStock ? (
                      <button
                        disabled
                        className="px-4 py-2 rounded-xl font-medium text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
                      >
                        Unavailable
                      </button>
                    ) : getCartQuantity(product.id) > 0 ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="w-6 text-center font-semibold text-gray-800">
                          {getCartQuantity(product.id)}
                        </span>
                        <button
                          onClick={() => addToCart(product)}
                          className="w-8 h-8 rounded-lg bg-[#4caf50] flex items-center justify-center hover:bg-[#43a047] transition-colors"
                        >
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product)}
                        className="px-4 py-2 rounded-xl font-medium text-sm bg-[#4caf50] text-white hover:bg-[#43a047] transition-all flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Cart Summary */}
      {totalItems > 0 && (
        <div
          className="fixed left-4 right-4 bottom-24 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-4 z-40"
          style={{ animation: "slideUp 0.3s ease-out" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#4caf50]/10 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-[#4caf50]" />
              </div>
              <div>
                <p className="text-gray-800 font-semibold">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </p>
                <p className="text-[#4caf50] font-bold">RM {checkoutAmount.toFixed(2)}</p>
              </div>
            </div>
            <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center min-w-[120px] ${
                    isProcessing 
                    ? "bg-[#4caf50]/70 text-white cursor-wait" 
                    : "bg-[#4caf50] text-white hover:bg-[#43a047]"
                }`}
                >
                {isProcessing ? (
                    <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                    </span>
                ) : (
                    "Checkout"
                )}
                </button>
          </div>
        </div>
      )}

      {/* ================= DELIVERY ADDRESS MODAL ================= */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end bg-black/40 backdrop-blur-sm" style={{ animation: "fadeIn 0.2s ease-out" }}>
          <div className="bg-white w-full max-h-[90vh] overflow-y-auto rounded-t-[2.5rem] shadow-2xl p-6 pb-12 relative" style={{ animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>
            
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white/90 backdrop-blur-md pt-2 pb-2 z-10">
              <div>
                <h3 className="text-xl font-extrabold text-gray-800">Delivery Address</h3>
                <p className="text-xs font-medium text-gray-400 mt-1">Where should we deliver your items?</p>
              </div>
              <button onClick={() => setShowAddressModal(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors flex-shrink-0">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-5">
              {/* Recipient Name */}
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block ml-1 uppercase tracking-wider">Recipient Name</label>
                <input 
                  type="text" 
                  value={addressForm.name} 
                  onChange={(e) => setAddressForm({...addressForm, name: e.target.value})} 
                  placeholder="e.g., John Doe" 
                  className="w-full bg-gray-50 border border-gray-200 py-3.5 px-4 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4caf50] focus:ring-1 focus:ring-[#4caf50] transition-all" 
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block ml-1 uppercase tracking-wider">Phone Number</label>
                <input 
                  type="tel" 
                  value={addressForm.phone} 
                  onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})} 
                  placeholder="+60 12-345 6789" 
                  className="w-full bg-gray-50 border border-gray-200 py-3.5 px-4 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4caf50] focus:ring-1 focus:ring-[#4caf50] transition-all" 
                />
              </div>

              {/* Street Address */}
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block ml-1 uppercase tracking-wider">Street Address</label>
                <input 
                  type="text" 
                  value={addressForm.street} 
                  onChange={(e) => setAddressForm({...addressForm, street: e.target.value})} 
                  placeholder="123 Farm Road, Suite A" 
                  className="w-full bg-gray-50 border border-gray-200 py-3.5 px-4 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4caf50] focus:ring-1 focus:ring-[#4caf50] transition-all" 
                />
              </div>

              {/* Postcode & City */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-bold text-gray-500 mb-2 block ml-1 uppercase tracking-wider">Postcode</label>
                  <input 
                    type="text" 
                    value={addressForm.postcode} 
                    onChange={(e) => setAddressForm({...addressForm, postcode: e.target.value})} 
                    placeholder="41000" 
                    className="w-full bg-gray-50 border border-gray-200 py-3.5 px-4 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4caf50] focus:ring-1 focus:ring-[#4caf50] transition-all" 
                  />
                </div>
                <div className="flex-[2]">
                  <label className="text-xs font-bold text-gray-500 mb-2 block ml-1 uppercase tracking-wider">City / State</label>
                  <input 
                    type="text" 
                    value={addressForm.city} 
                    onChange={(e) => setAddressForm({...addressForm, city: e.target.value})} 
                    placeholder="Klang, Selangor" 
                    className="w-full bg-gray-50 border border-gray-200 py-3.5 px-4 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4caf50] focus:ring-1 focus:ring-[#4caf50] transition-all" 
                  />
                </div>
              </div>
              
              <button 
                onClick={handleSaveAddress} 
                disabled={!addressForm.name.trim() || !addressForm.street.trim()} 
                className="w-full mt-4 bg-[#4caf50] text-white py-4 rounded-full font-bold text-base hover:bg-[#43a047] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[#4caf50]/30"
              >
                Save Delivery Address
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}