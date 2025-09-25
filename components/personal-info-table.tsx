"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, FileText } from "lucide-react"
import { AdvancedFilters, type FilterState } from "@/components/advanced-filters"
import { ExportButton, generatePDF } from "@/components/export-utils"

interface PersonalInfo {
  fullName: string
  birthDate: string
  gender: string
  idNumber: string
  maritalStatus: string
  permanentAddress: string
  temporaryAddress: string
  housingType: string
  occupation: string
  position: string
  companyName: string
  industry: string
  workDuration: string
  monthlyIncome: number
}

const mockPersonalInfo: PersonalInfo[] = [
  {
    fullName: "Nguyễn Văn An",
    birthDate: "1985-03-15",
    gender: "Nam",
    idNumber: "123456789012",
    maritalStatus: "Đã kết hôn",
    permanentAddress: "123 Đường ABC, Quận 1, TP.HCM",
    temporaryAddress: "123 Đường ABC, Quận 1, TP.HCM",
    housingType: "Sở hữu nhà",
    occupation: "Kỹ sư phần mềm",
    position: "Senior Developer",
    companyName: "Tech Solutions Ltd",
    industry: "Công nghệ thông tin",
    workDuration: "5 năm",
    monthlyIncome: 25000000,
  },
  {
    fullName: "Trần Thị Bình",
    birthDate: "1990-07-22",
    gender: "Nữ",
    idNumber: "987654321098",
    maritalStatus: "Độc thân",
    permanentAddress: "456 Đường XYZ, Quận 3, TP.HCM",
    temporaryAddress: "789 Đường DEF, Quận 7, TP.HCM",
    housingType: "Thuê nhà",
    occupation: "Kế toán",
    position: "Accountant",
    companyName: "Finance Corp",
    industry: "Tài chính",
    workDuration: "3 năm",
    monthlyIncome: 18000000,
  },
  {
    fullName: "Lê Minh Cường",
    birthDate: "1988-12-10",
    gender: "Nam",
    idNumber: "456789123456",
    maritalStatus: "Đã kết hôn",
    permanentAddress: "789 Đường GHI, Quận 5, TP.HCM",
    temporaryAddress: "789 Đường GHI, Quận 5, TP.HCM",
    housingType: "Ở cùng gia đình",
    occupation: "Bác sĩ",
    position: "Doctor",
    companyName: "City Hospital",
    industry: "Y tế",
    workDuration: "8 năm",
    monthlyIncome: 35000000,
  },
  {
    fullName: "Phạm Thị Dung",
    birthDate: "1992-05-18",
    gender: "Nữ",
    idNumber: "789123456789",
    maritalStatus: "Ly hôn",
    permanentAddress: "321 Đường JKL, Quận 2, TP.HCM",
    temporaryAddress: "654 Đường MNO, Quận 4, TP.HCM",
    housingType: "Thuê nhà",
    occupation: "Giáo viên",
    position: "Teacher",
    companyName: "ABC School",
    industry: "Giáo dục",
    workDuration: "4 năm",
    monthlyIncome: 15000000,
  },
  {
    fullName: "Hoàng Văn Em",
    birthDate: "1987-09-25",
    gender: "Nam",
    idNumber: "147258369147",
    maritalStatus: "Đã kết hôn",
    permanentAddress: "987 Đường PQR, Quận 6, TP.HCM",
    temporaryAddress: "987 Đường PQR, Quận 6, TP.HCM",
    housingType: "Sở hữu nhà",
    occupation: "Kinh doanh",
    position: "Sales Manager",
    companyName: "Trading Co.",
    industry: "Thương mại",
    workDuration: "6 năm",
    monthlyIncome: 22000000,
  },
]

type SortField = keyof PersonalInfo
type SortDirection = "asc" | "desc"

export function PersonalInfoTable() {
  const [filters, setFilters] = useState<FilterState>({ search: "" })
  const [sortField, setSortField] = useState<SortField>("fullName")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredAndSortedInfo = mockPersonalInfo
    .filter((person) => {
      const matchesSearch = filters.search
        ? person.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
          person.idNumber.includes(filters.search) ||
          person.companyName.toLowerCase().includes(filters.search.toLowerCase()) ||
          person.occupation.toLowerCase().includes(filters.search.toLowerCase())
        : true

      const matchesGender = !filters.gender || person.gender === filters.gender

      const matchesMaritalStatus = !filters.maritalStatus || person.maritalStatus === filters.maritalStatus

      const matchesHousingType = !filters.housingType || person.housingType === filters.housingType

      const matchesIndustry = !filters.industry || person.industry === filters.industry

      const matchesIncome =
        (!filters.incomeMin || person.monthlyIncome >= filters.incomeMin) &&
        (!filters.incomeMax || person.monthlyIncome <= filters.incomeMax)

      return (
        matchesSearch && matchesGender && matchesMaritalStatus && matchesHousingType && matchesIndustry && matchesIncome
      )
    })
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      return 0
    })

  const getMaritalStatusBadge = (status: string) => {
    switch (status) {
      case "Đã kết hôn":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Đã kết hôn</Badge>
      case "Độc thân":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Độc thân</Badge>
      case "Ly hôn":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Ly hôn</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getHousingTypeBadge = (type: string) => {
    switch (type) {
      case "Sở hữu nhà":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Sở hữu nhà</Badge>
      case "Thuê nhà":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Thuê nhà</Badge>
      case "Ở cùng gia đình":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Ở cùng gia đình</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const exportHeaders = [
    "Họ tên",
    "Ngày sinh",
    "Giới tính",
    "Số CMND/CCCD",
    "Tình trạng hôn nhân",
    "Địa chỉ thường trú",
    "Địa chỉ tạm trú",
    "Hình thức cư trú",
    "Nghề nghiệp",
    "Vị trí công việc",
    "Tên công ty",
    "Ngành nghề",
    "Thời gian làm việc",
    "Thu nhập hàng tháng",
  ]

  const handlePDFExport = () => {
    generatePDF(filteredAndSortedInfo, exportHeaders, "Personal Information - CreditNova")
  }

  return (
    <div className="space-y-4">
      <AdvancedFilters onFiltersChange={setFilters} filterType="personal-info" />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Personal Information ({filteredAndSortedInfo.length} results)</CardTitle>
            <div className="flex gap-2">
              <Button onClick={handlePDFExport} variant="outline" className="gap-2 bg-transparent">
                <FileText className="w-4 h-4" />
                Print PDF
              </Button>
              <ExportButton data={filteredAndSortedInfo} filename="personal-information" headers={exportHeaders} />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer min-w-[150px]" onClick={() => handleSort("fullName")}>
                    <div className="flex items-center gap-2">
                      Họ tên
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("birthDate")}>
                    <div className="flex items-center gap-2">
                      Ngày sinh
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("gender")}>
                    <div className="flex items-center gap-2">
                      Giới tính
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead>Số CMND/CCCD</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("maritalStatus")}>
                    <div className="flex items-center gap-2">
                      Tình trạng hôn nhân
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="min-w-[200px]">Địa chỉ thường trú</TableHead>
                  <TableHead className="min-w-[200px]">Địa chỉ tạm trú</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("housingType")}>
                    <div className="flex items-center gap-2">
                      Hình thức cư trú
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("occupation")}>
                    <div className="flex items-center gap-2">
                      Nghề nghiệp
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead>Vị trí công việc</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("companyName")}>
                    <div className="flex items-center gap-2">
                      Tên công ty
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead>Ngành nghề</TableHead>
                  <TableHead>Thời gian làm việc</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("monthlyIncome")}>
                    <div className="flex items-center gap-2">
                      Thu nhập hàng tháng
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedInfo.map((person, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{person.fullName}</TableCell>
                    <TableCell>{person.birthDate}</TableCell>
                    <TableCell>{person.gender}</TableCell>
                    <TableCell className="font-mono">{person.idNumber}</TableCell>
                    <TableCell>{getMaritalStatusBadge(person.maritalStatus)}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={person.permanentAddress}>
                      {person.permanentAddress}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" title={person.temporaryAddress}>
                      {person.temporaryAddress}
                    </TableCell>
                    <TableCell>{getHousingTypeBadge(person.housingType)}</TableCell>
                    <TableCell>{person.occupation}</TableCell>
                    <TableCell>{person.position}</TableCell>
                    <TableCell>{person.companyName}</TableCell>
                    <TableCell>{person.industry}</TableCell>
                    <TableCell>{person.workDuration}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {formatCurrency(person.monthlyIncome)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAndSortedInfo.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No personal information found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
