"use client"
import { Divider } from "@/components/Divider"
import { Input } from "@/components/Input"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarLink,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarSubLink,
} from "@/components/Sidebar"
import { cx } from "@/lib/utils"
import { RiArrowDownSFill } from "@remixicon/react"
import { Users, CreditCard, Package, Gift, BookUser, ShoppingCart, Truck } from "lucide-react"
import * as React from "react"
import { UserProfile } from "./UserProfile"
import { usePathname } from "next/navigation"

const navigation = [
  {
    name: "Customer Management",
    href: "/customer",
    icon: BookUser,
    notifications: false,
    active: false,
  },
  {
    name: "Credit",
    href: "/credit", 
    icon: CreditCard,
    notifications: false,
    active: false,
  },
] as const

type NavigationItem = {
  name: string
  href: string
  icon: React.ComponentType
  active?: boolean
  children?: Array<{
    name: string
    href: string
    active: boolean
  }>
}

const navigation2: NavigationItem[] = [
  {
    name: "Product Management",
    href: "/products",
    icon: Package,
    children: [
      {
        name: "Master Data",
        href: "/productsfjkd",
        active: false,
      },
      {
        name: "Promotion Management",
        href: "/products/promotion",
        active: false,
      },
    ],
  },
  {
    name: "User Management",
    href: "/user",
    icon: Users,
    active: false,
  },
  {
    name: "Order Management",
    href: "/orders",
    icon: ShoppingCart,
    active: false,
  },
  {
    name: "Delivery Management", 
    href: "/delivery",
    icon: Truck,
    active: false,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = React.useState<string[]>([
    navigation2[0].name,
  ])

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  const toggleMenu = (name: string) => {
    setOpenMenus((prev: string[]) =>
      prev.includes(name)
        ? prev.filter((item: string) => item !== name)
        : [...prev, name],
    )
  }

  return (
    <Sidebar {...props} className="bg-gray-50 dark:bg-gray-925">
      <SidebarHeader className="px-3 py-">
        <img src="/logo.png" alt="Beaches" className="my-2 w-[180px]" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <Input
              type="search"
              placeholder="Search items..."
              className="[&>input]:sm:py-1.5"
            />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="pt-0">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarLink
                    href={item.href}
                    isActive={isActive(item.href)}
                    icon={item.icon}
                    notifications={item.notifications}
                  >
                    {item.name}
                  </SidebarLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <div className="px-3">
          <Divider className="my-0 py-0" />
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigation2.map((item) => (
                <SidebarMenuItem key={item.name}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => toggleMenu(item.name)}
                        className={cx(
                          "flex w-full items-center justify-between gap-x-2.5 rounded-md p-2 text-base text-gray-900 transition hover:bg-gray-200/50 sm:text-sm dark:text-gray-400 hover:dark:bg-gray-900 hover:dark:text-gray-50",
                          isActive(item.href) && "bg-gray-200/50 dark:bg-gray-900 dark:text-gray-50", 
                          "focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:focus:ring-neutral-300"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <item.icon
                            className="size-[18px] shrink-0"
                            aria-hidden="true"
                          />
                          {item.name}
                        </div>
                        <RiArrowDownSFill
                          className={cx(
                            openMenus.includes(item.name)
                              ? "rotate-0"
                              : "-rotate-90",
                            "size-5 shrink-0 transform text-gray-400 transition-transform duration-150 ease-in-out dark:text-gray-600",
                          )}
                          aria-hidden="true"
                        />
                      </button>
                      {openMenus.includes(item.name) && (
                        <SidebarMenuSub>
                          <div className="absolute inset-y-0 left-4 w-px bg-gray-300 dark:bg-gray-800" />
                          {item.children.map((child) => (
                            <SidebarMenuItem key={child.name}>
                              <SidebarSubLink
                                href={child.href}
                                isActive={isActive(child.href)}
                              >
                                {child.name}
                              </SidebarSubLink>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenuSub>
                      )}
                    </>
                  ) : (
                    <a
                      href={item.href}
                      className={cx(
                        "flex w-full items-center justify-between gap-x-2.5 rounded-md p-2 text-base text-gray-900 transition hover:bg-gray-200/50 sm:text-sm dark:text-gray-400 hover:dark:bg-gray-900 hover:dark:text-gray-50",
                        isActive(item.href) && "bg-white shadow-md font-semibold dark:bg-gray-900 dark:text-gray-50",
                        "focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:focus:ring-neutral-300"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon
                          className="size-[18px] shrink-0"
                          aria-hidden="true"
                        />
                        {item.name}
                      </div>
                    </a>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="border-t border-gray-200 dark:border-gray-800" />
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  )
}
