"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, User, Users } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate login validation
    if (username === "123@123" && password === "123") {
      // Store admin session
      localStorage.setItem("userType", "admin")
      localStorage.setItem("isLoggedIn", "true")

      // Success feedback
      setTimeout(() => {
        router.push("/dashboard")
      }, 500)
    } else {
      setError("Tên đăng nhập hoặc mật khẩu không đúng")
      setLoading(false)
    }
  }

  const handleGuestLogin = () => {
    // Store guest session
    localStorage.setItem("userType", "guest")
    localStorage.setItem("isLoggedIn", "true")

    // Redirect to guest form (app.jsx equivalent)
    router.push("/guest-form")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">CreditNova</h1>
          </div>
          <p className="text-gray-600">Chào mừng bạn đến với hệ thống quản lý tín dụng</p>
        </div>

        {/* Login Options */}
        <div className="space-y-4">
          {/* Admin Login Card */}
          <Card className="border-2 hover:border-orange-200 transition-colors">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-orange-500" />
                Đăng nhập Admin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Tên đăng nhập</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Nhập tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={loading}
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập Admin"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Guest Login Card */}
          <Card className="border-2 hover:border-orange-200 transition-colors">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-orange-500" />
                Đăng nhập Khách
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">
                Truy cập trực tiếp vào form điền thông tin mà không cần đăng nhập
              </p>
              <Button
                onClick={handleGuestLogin}
                variant="outline"
                className="w-full border-orange-500 text-orange-500 hover:bg-orange-50 bg-transparent"
              >
                Tiếp tục với tư cách Khách
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>© 2025 CreditNova. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </div>
  )
}
