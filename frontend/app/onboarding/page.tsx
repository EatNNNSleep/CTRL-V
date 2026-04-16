"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

const featureSlides = [
  {
    title: "Welcome to TANI-Agent",
    description:
      "Having trouble managing your farm? Meet your intelligent agricultural assistant designed to transform your farming experience.",
    imagePath: "/images/illustration1.jpg",
  },
  {
    title: "Interactive Farm Map",
    description: "Monitor your fields in real-time and pinpoint environmental risks instantly.",
    imagePath: "/images/illustration2.jpg",
  },
  {
    title: "AI Disease Scan",
    description: "Instantly identify crop diseases with your camera and get accurate diagnoses.",
    imagePath: "/images/illustration3.jpg",
  },
  {
    title: "Voice Assistant",
    description: "Ask questions naturally and get real-time, data-driven farming advice.",
    imagePath: "/images/illustration4.jpg",
  },
  {
    title: "Smart Agri-Store",
    description: "Get targeted treatments and fertilizers delivered directly to your farm.",
    imagePath: "/images/illustration5.jpg",
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)

  const isLastSlide = currentSlide === featureSlides.length - 1
  const currentFeature = featureSlides[currentSlide]

  const handleNext = () => {
    if (isLastSlide) {
      router.push("/login")
    } else {
      setCurrentSlide((prev) => prev + 1)
    }
  }

  const handleSkip = () => {
    console.log("Skip clicked - navigate to main app")
  }

  return (
    <div className="h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Skip Button */}
      {!isLastSlide && (
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors"
        >
          Skip
        </button>
      )}

      {/* Illustration Section */}
      <div className="flex-1 flex items-center justify-center px-6 pt-12 pb-4">
        <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] aspect-square">
          {featureSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-all duration-500 ease-out ${
                index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <Image
                src={slide.imagePath}
                alt={slide.title}
                fill
                className="object-contain"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col items-center px-6 sm:px-8 pb-8 sm:pb-12">
        {/* Text Content */}
        <div className="flex flex-col items-center text-center mb-6" key={currentSlide}>
          <h1
            className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] leading-tight mb-3 animate-fadeSlideUp"
            style={{ animationDelay: "0ms" }}
          >
            {currentFeature.title}
          </h1>
          <p
            className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-xs sm:max-w-sm animate-fadeSlideUp"
            style={{ animationDelay: "100ms" }}
          >
            {currentFeature.description}
          </p>
        </div>

        {/* Pagination Indicators */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {featureSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-6 h-2 bg-[#4a7c59]"
                  : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleNext}
          className="w-full max-w-xs bg-[#4a7c59] hover:bg-[#3d6549] text-white font-semibold text-base py-4 rounded-xl shadow-lg shadow-[#4a7c59]/20 active:scale-[0.98] transition-all"
        >
          {isLastSlide ? "START" : "NEXT"}
        </button>
      </div>

      {/* Global Animations */}
      <style jsx global>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeSlideUp {
          animation: fadeSlideUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
