"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowUpDown, FileText, Phone, Mail, Calendar, RefreshCw, AlertTriangle } from "lucide-react"
import { useCreditSurveys } from "@/hooks/use-credit-survey"
import { CreditSurvey } from "@/lib/api"

type SortField = keyof CreditSurvey
type SortDirection = "asc" | "desc"

export function CreditSurveysTable() {
  const { surveys, loading, error, deleteSurvey, refetch } = useCreditSurveys()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<SortField>("createdAt")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredAndSortedSurveys = surveys
    .filter((survey) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        survey.fullName.toLowerCase().includes(searchLower) ||
        survey.email.toLowerCase().includes(searchLower) ||
        survey.phoneNumber.includes(searchTerm) ||
        survey.companyName.toLowerCase().includes(searchLower)
      )
    })
    .sort((a, b) => {
      const aValue = a[sortField] ?? ""
      const bValue = b[sortField] ?? ""
      
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Không xác định'
    }
  }

  const getStatusBadge = (survey: CreditSurvey) => {
    const hasDocuments = survey.salarySlipImage && survey.utilityBillImage
    if (hasDocuments) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Hoàn thành</Badge>
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Thiếu giấy tờ</Badge>
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa hồ sơ này?')) {
      try {
        setDeletingId(id)
        await deleteSurvey(id)
      } catch (error) {
        console.error('Error deleting survey:', error)
        alert('Có lỗi xảy ra khi xóa hồ sơ')
      } finally {
        setDeletingId(null)
      }
    }
  }

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Danh sách hồ sơ vay vốn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Danh sách hồ sơ vay vốn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 mb-4 font-medium">Lỗi khi tải dữ liệu</p>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
              {error}
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={refetch} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Thử lại
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="default"
              >
                Tải lại trang
              </Button>
            </div>
            
            {/* Debug info */}
            <details className="mt-6 text-left">
              <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                Thông tin debug
              </summary>
              <div className="mt-2 p-3 bg-gray-50 rounded-md text-xs text-gray-600">
                <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'https://116.105.30.238:7099/api'}/survey</p>
                <p><strong>Error:</strong> {error}</p>
                <p><strong>Time:</strong> {new Date().toLocaleString('vi-VN')}</p>
              </div>
            </details>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Success state
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Danh sách hồ sơ vay vốn ({surveys.length})</CardTitle>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80"
            />
            <Button
              onClick={refetch}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Làm mới
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredAndSortedSurveys.length === 0 ? (
          <div className="text-center p-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm ? "Không tìm thấy hồ sơ nào phù hợp" : "Chưa có hồ sơ vay vốn nào"}
            </p>
            {searchTerm && (
              <Button
                onClick={() => setSearchTerm("")}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("fullName")}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Họ và tên
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("email")}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Liên hệ
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Công ty</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("monthlyIncome")}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Thu nhập
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("createdAt")}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Ngày tạo
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedSurveys.map((survey) => (
                  <TableRow key={survey.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{survey.fullName}</div>
                        <div className="text-sm text-gray-500">
                          {survey.gender} • {survey.maritalStatus}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-1 text-gray-400" />
                          {survey.phoneNumber}
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="w-3 h-3 mr-1 text-gray-400" />
                          {survey.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{survey.companyName}</div>
                        <div className="text-sm text-gray-500">{survey.occupation}</div>
                        <div className="text-xs text-gray-400">{survey.companyType}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatCurrency(survey.monthlyIncome)}</div>
                      <div className="text-sm text-gray-500">{survey.salaryPaymentMethod}</div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(survey)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(survey.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // TODO: Implement view details
                            alert(`Chi tiết hồ sơ của ${survey.fullName}`)
                          }}
                        >
                          Xem
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(survey.id)}
                          disabled={deletingId === survey.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          {deletingId === survey.id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            "Xóa"
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}