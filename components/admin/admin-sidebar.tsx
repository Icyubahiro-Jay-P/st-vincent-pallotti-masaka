"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarDays,
  GraduationCap,
  HeartHandshake,
  Inbox,
  LayoutDashboard,
  Menu,
  Milestone,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  UserCircle,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { SignOutButton } from "@/components/admin/sign-out-button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/programs", label: "Programs", icon: GraduationCap },
  { href: "/admin/milestones", label: "Milestones", icon: Milestone },
  { href: "/admin/values", label: "Values", icon: HeartHandshake },
  { href: "/admin/homepage", label: "Homepage", icon: LayoutDashboard },
  { href: "/admin/admissions", label: "Admissions", icon: Inbox },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/admins", label: "Admins", icon: Users },
  { href: "/admin/profile", label: "Profile", icon: UserCircle },
]

const COLLAPSED_KEY = "admin-sidebar-collapsed"

// Trigger and content for the mobile nav and the collapse toggle render in
// different parts of the tree (header vs. sidebar) but share state, so they
// need this context.
const AdminSidebarContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
  collapsed: boolean
  toggleCollapsed: () => void
} | null>(null)

export function AdminSidebarProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const [collapsed, setCollapsed] = React.useState(false)

  React.useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(COLLAPSED_KEY) === "true")
    } catch {
      // localStorage unavailable (private browsing), keep default
    }
  }, [])

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev
      try {
        window.localStorage.setItem(COLLAPSED_KEY, String(next))
      } catch {
        // localStorage unavailable, collapsed state won't persist
      }
      return next
    })
  }

  return (
    <AdminSidebarContext.Provider
      value={{ open, setOpen, collapsed, toggleCollapsed }}
    >
      {children}
    </AdminSidebarContext.Provider>
  )
}

function useAdminSidebar() {
  const ctx = React.useContext(AdminSidebarContext)
  if (!ctx) {
    throw new Error("useAdminSidebar must be used within AdminSidebarProvider")
  }
  return ctx
}

export function AdminMobileNavTrigger() {
  const { setOpen } = useAdminSidebar()
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="lg:hidden"
      onClick={() => setOpen(true)}
    >
      <Menu />
      <span className="sr-only">Open menu</span>
    </Button>
  )
}

export function AdminSidebarCollapseToggle() {
  const { collapsed, toggleCollapsed } = useAdminSidebar()
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleCollapsed}
      className="hidden lg:inline-flex"
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
    </Button>
  )
}

function useActivePath(href: string) {
  const pathname = usePathname()
  return pathname.startsWith(href)
}

function NavLink({
  href,
  label,
  icon: Icon,
  collapsed,
}: {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  collapsed?: boolean
}) {
  const isActive = useActivePath(href)

  return (
    <Link
      href={href}
      title={label}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 border-l-2 border-transparent px-4 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "border-primary bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span className={cn(collapsed && "sr-only")}>{label}</span>
    </Link>
  )
}

export function AdminSidebar() {
  const { open, setOpen, collapsed } = useAdminSidebar()

  return (
    <>
      <nav
        aria-label="Admin"
        className={cn(
          "hidden shrink-0 flex-col border-r border-border bg-background transition-[width] duration-200 lg:flex",
          collapsed ? "w-14" : "w-56"
        )}
      >
        <div className="flex flex-1 flex-col gap-1 py-4">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} collapsed={collapsed} />
          ))}
        </div>
        <div className="border-t border-border p-2">
          <SignOutButton
            className="w-full justify-center"
            hideLabel={collapsed}
          />
        </div>
      </nav>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <SheetHeader>
            <SheetTitle>Admin</SheetTitle>
            <SheetDescription className="sr-only">
              Admin navigation menu
            </SheetDescription>
          </SheetHeader>
          <nav aria-label="Admin" className="flex flex-col gap-1 px-2">
            {navItems.map((item) => (
              <SheetClose
                key={item.href}
                render={<Link href={item.href} />}
                className="flex items-center gap-3 rounded-none px-2 py-2.5 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground"
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </SheetClose>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}
