"use client"

import { useRouter } from "next/navigation"

export const request = async (
  url: string,
  {
    method,
    body,
    query,
  }: {
    method: string
    body?: any
    query?: any
  },
): Promise<Response | undefined> => {
  try {
    const fetchUrl = new URL(url, process.env.NEXT_PUBLIC_BASE_API)
    fetchUrl.search = new URLSearchParams(query).toString()

    const response = await fetch(fetchUrl, {
      method,
      body,
      credentials: "include",
    })

    if (response.status === 401) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useRouter().replace("/login")
    }

    return response
  } catch (error) {
    console.error(error)
  }
}
