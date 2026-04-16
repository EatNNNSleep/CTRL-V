"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Phone, Mail, KeyRound, Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    phone: "",
    email: "",
    password: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      router.push("/home")
    }, 1500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-[#e8f5e9] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome</h1>
          <p className="text-muted-foreground text-sm">
            Please register to enter
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#e8f5e9] rounded-full p-1 flex gap-1">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isLogin
                  ? "bg-[#2a5d44] text-white"
                  : "text-[#2a5d44] hover:bg-[#d0e8d4]"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                !isLogin
                  ? "bg-[#2a5d44] text-white"
                  : "text-[#2a5d44] hover:bg-[#d0e8d4]"
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First Name - Sign Up only */}
          {!isLogin && (
            <div>
              <label className="text-xs text-muted-foreground ml-4 mb-1 block">
                First Name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2a5d44]">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Jullyan Shark"
                  className="w-full pl-12 pr-4 py-3.5 rounded-full border border-gray-200 bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#2a5d44] focus:ring-1 focus:ring-[#2a5d44] transition-all"
                />
              </div>
            </div>
          )}

          {/* Phone Number - Sign Up only */}
          {!isLogin && (
            <div>
              <label className="text-xs text-muted-foreground ml-4 mb-1 block">
                Your Number
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2a5d44]">
                  <Phone size={20} />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+6208234567890"
                  className="w-full pl-12 pr-4 py-3.5 rounded-full border border-gray-200 bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#2a5d44] focus:ring-1 focus:ring-[#2a5d44] transition-all"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="text-xs text-muted-foreground ml-4 mb-1 block">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2a5d44]">
                <Mail size={20} />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jullyanshark70@gmail.com"
                className="w-full pl-12 pr-4 py-3.5 rounded-full border border-gray-200 bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#2a5d44] focus:ring-1 focus:ring-[#2a5d44] transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-muted-foreground ml-4 mb-1 block">
              {isLogin ? "Password" : "Create Password"}
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2a5d44]">
                <KeyRound size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••••"
                className="w-full pl-12 pr-12 py-3.5 rounded-full border border-gray-200 bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#2a5d44] focus:ring-1 focus:ring-[#2a5d44] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2a5d44] hover:text-[#1e4532] transition-colors"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#2a5d44] hover:bg-[#1e4532] text-white font-medium py-4 rounded-full mt-8 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Please wait...</span>
              </>
            ) : isLogin ? (
              "Login"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
