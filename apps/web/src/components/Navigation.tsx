"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"

export interface INavLink {
  icon: React.ReactNode
  href: string
  name: string
  newTab?: boolean
}

export interface INavigation {
  navLinks: INavLink[]
}

export function Navigation({ navLinks }: INavigation) {
  const pathname = usePathname()

  return (
    <>
      {navLinks.map((link, i) => {
        const isActive =
          link.href === "/"
            ? link.href.toLowerCase() === pathname?.toLowerCase()
            : pathname?.startsWith(link.href)

        return (
          <li key={i} className="mb-2">
            <Link
              href={link.href}
              className={isActive ? "active" : ""}
              target={link.newTab ? "_blank" : "_self"}
            >
              <span>{link.icon}</span>
              <span className="capitalize">{link.name}</span>
            </Link>
          </li>
        )
      })}
    </>
  )
}
