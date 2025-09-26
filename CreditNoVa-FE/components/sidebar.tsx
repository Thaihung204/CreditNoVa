"use client"

import { Home, CreditCard, Settings, Menu, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const router = useRouter()

  const menuItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: CreditCard, label: "Credit Prediction", active: false },
    { icon: Settings, label: "Setting", active: false },
  ]

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userType")
    router.push("/login")
  }

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-border transition-all duration-300 z-50 flex flex-col",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg">CreditNova</span>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={onToggle} className="p-2">
          {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 flex-1">
        {menuItems.map((item, index) => (
          <Button
            key={index}
            variant={item.active ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 h-12",
              item.active && "bg-orange-500 hover:bg-orange-600 text-white",
              collapsed && "px-3",
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 h-12 text-red-600 hover:text-red-700 hover:bg-red-50",
            collapsed && "px-3",
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Đăng xuất</span>}
        </Button>
      </div>
    </div>
  )
}
