import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// const isAuthenticated = (req: NextRequest): boolean => {
//   return req.cookies.get("user") !== undefined
// }

export async function middleware(request: NextRequest) {
  // if (request.nextUrl.pathname.startsWith("/_next")) {
  //   return NextResponse.next()
  // }

  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url), {
      status: 307,
    })
  }

  // const isLoggedIn = isAuthenticated(request)

  // console.log(request.cookies.getAll())

  // if (request.nextUrl.pathname === '/login' && isLoggedIn) {
  //   console.log('redirect to dashboard', isLoggedIn, request.nextUrl.pathname !== '/login')
  //   // return NextResponse.redirect(new URL('/dashboard', request.url), {
  //   //   status: 307,
  //   //   statusText: 'Already logged in.',
  //   // })
  // } else if (isLoggedIn === false && request.nextUrl.pathname !== '/login') {
  //   console.log('redirect to login', isLoggedIn, request.nextUrl.pathname !== '/login')
  //   // return NextResponse.redirect(new URL('/login', request.url), {
  //   //   status: 307,
  //   //   statusText: 'Unauthorized, please login.',
  //   // })
  // }

  // return NextResponse.next()
}
