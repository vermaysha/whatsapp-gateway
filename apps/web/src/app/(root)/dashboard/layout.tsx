import Navbar from "@/components/Navbar"
import type { Metadata } from "next"
import Sidebar from "@/components/Sidebar"
import { pageTitle } from "@/lib"

export const metadata: Metadata = {
  title: pageTitle("Loading"),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col bg-base-100">
        <Navbar />
        <div className="m-10">{children}</div>
        <footer className="footer footer-center p-4 bg-neutral text-neutral-content">
          <div className="">
            <p>
              Copyright © {new Date().getFullYear()} - All right reserved by
              Ashary Vermaysha.
            </p>
          </div>
        </footer>
      </div>
      <div className="drawer-side w-screen">
        <label htmlFor="my-drawer-3" className="drawer-overlay" />
        <Sidebar />
      </div>
    </div>
  )
}
