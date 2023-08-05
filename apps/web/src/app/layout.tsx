import AuthState from "@/contexts/AuthContext"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { pageTitle } from "@/lib"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: pageTitle("Loading"),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthState>{children}</AuthState>
      </body>
    </html>
  )
}
