"use client"

import { request } from "@/lib"
import { createContext, useEffect, useState } from "react"
import { IAuthContext, ILogin } from "./AuthContext.interface"
import { usePathname, useRouter } from "next/navigation"

const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  isLoading: false,
  setIsLoading: (flag: boolean) => {},
  loginToAccount: () => {
    return Promise.resolve(undefined)
  },
  logoutUser: () => {
    return Promise.resolve(undefined)
  },
})

const AuthState = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const router = useRouter()
  const pathName = usePathname()

  const loginToAccount = async (
    login: ILogin,
  ): Promise<Response | undefined> => {
    const body = new URLSearchParams()
    body.set("username", login.username)
    body.set("password", login.password)

    const res = await request("/auth/login", {
      method: "POST",
      body,
    })

    if (res?.status === 200) {
      setIsAuthenticated(true)
      const maxAge = Date.now() + 365 * 24 * 60 * 60 // 1y
      document.cookie = `user=${login.username};max-age=${maxAge};path=/`
    }

    return res
  }

  const logoutUser = async () => {
    await request("/auth/logout", {
      method: "DELETE",
    })

    setIsAuthenticated(false)
    document.cookie = `user=;max-age=0;path=/`
  }

  const verifyUser = async () => {
    const res = await request("/auth/verify", {
      method: "GET",
    })
    const status = res?.status

    if (status === 200) {
      setIsAuthenticated(true)
      if (pathName === "/login" && isAuthenticated) {
        router.replace("/dashboard")
      }
    } else {
      await logoutUser()
      router.replace("/login")
    }
  }

  useEffect(() => {
    if (isAuthenticated === false) {
      // logoutUser()
    }
  }, [isAuthenticated])

  useEffect(() => {
    verifyUser().then(() => {
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    if (isLoading === true) {
      // Get the current page scroll position in the vertical direction
      const scrollTop = document.documentElement.scrollTop

      // Get the current page scroll position in the horizontal direction

      const scrollLeft = document.documentElement.scrollLeft

      // if any scroll is attempted,
      // set this to the previous value
      window.onscroll = () => {
        window.scrollTo(scrollLeft, scrollTop)
      }
      return
    }
    window.onscroll = () => {}
  }, [isLoading])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        setIsLoading,
        loginToAccount,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
export default AuthState
