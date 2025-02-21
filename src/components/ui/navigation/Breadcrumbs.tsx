"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  const breadcrumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`
    const label = segment.charAt(0).toUpperCase() + segment.slice(1)
    const isCurrent = index === segments.length - 1

    return {
      href,
      label,
      isCurrent
    }
  })

  if (!breadcrumbs.length) return null

  return (
    <nav aria-label="Breadcrumb" className="ml-2">
      <ol role="list" className="flex items-center space-x-3 text-sm">
        <li className="flex">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-gray-500 transition hover:text-gray-700 dark:text-gray-400 hover:dark:text-gray-300"
            >
              Home
            </Link>
            <ChevronRight
              className="ml-3 size-4 shrink-0 text-gray-600 dark:text-gray-400"
              aria-hidden="true"
            />
          </div>
        </li>
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex">
            <div className="flex items-center">
              <Link
                href={item.href}
                className={
                  item.isCurrent
                    ? "text-gray-900 dark:text-gray-50"
                    : "text-gray-500 transition hover:text-gray-700 dark:text-gray-400 hover:dark:text-gray-300"
                }
                aria-current={item.isCurrent ? "page" : undefined}
              >
                {item.label}
              </Link>
              {index < breadcrumbs.length - 1 && (
                <ChevronRight
                  className="ml-3 size-4 shrink-0 text-gray-600 dark:text-gray-400"
                  aria-hidden="true"
                />
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
