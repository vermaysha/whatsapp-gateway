"use client"

import Loading from "@/components/Loading"
import { AuthContext } from "@/contexts/AuthContext"
import { Suspense, useContext } from "react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading, isAuthenticated } = useContext(AuthContext)

  return (
    <>
      {isLoading === true || isAuthenticated === null ? (
        <Loading />
      ) : (
        <Suspense fallback={<Loading />}>{children}</Suspense>
      )}
    </>
  )
}
