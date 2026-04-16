import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

import { UIProvider } from "@/components/map-dashboard/ui-context"
import { BottomNavigation } from "@/components/map-dashboard/bottom-navigation"
import { GlobalAIOverlay } from "@/components/global-ai-overlay"

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Tani-Agent - Your intelligent agricultural assistant',
  description: 'Smart farming map dashboard with crop monitoring and disease alerts',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <UIProvider>
          {children} 
          <BottomNavigation />
          <GlobalAIOverlay />
        </UIProvider>
      </body>
    </html>
  )
}