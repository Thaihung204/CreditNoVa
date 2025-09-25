"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, FileText } from "lucide-react"
import { AdvancedFilters, type FilterState } from "@/components/advanced-filters"
import { ExportButton, generatePDF } from "@/components/export-utils"

interface UserReport {
  userId: string
  url: string
  report: string
  creditScore: number
  voiceReport: string
  employerId: string
  loanAmount: number
  downPayment: number
  repaymentTime: string
  time: string
}

const mockUserReports: UserReport[] = [
  {
    userId: "USR001",
    url: "https://example.com/report1",
    report: "Credit Assessment",
    creditScore: 750,
    voiceReport: "Approved",
    employerId: "EMP001",
    loanAmount: 50000,
    downPayment: 10000,
    repaymentTime: "36 months",
    time: "2024-01-15 10:30 AM",
  },
  {
    userId: "USR002",
    url: "https://example.com/report2",
    report: "Risk Analysis",
    creditScore: 680,
    voiceReport: "Under Review",
    employerId: "EMP002",
    loanAmount: 25000,
    downPayment: 5000,
    repaymentTime: "24 months",
    time: "2024-01-14 02:15 PM",
  },
  {
    userId: "USR003",
    url: "https://example.com/report3",
    report: "Income Verification",
    creditScore: 820,
    voiceReport: "Approved",
    employerId: "EMP003",
    loanAmount: 75000,
    downPayment: 15000,
    repaymentTime: "48 months",
    time: "2024-01-13 09:45 AM",
  },
  {
    userId: "USR004",
    url: "https://example.com/report4",
    report: "Background Check",
    creditScore: 590,
    voiceReport: "Rejected",
    employerId: "EMP004",
    loanAmount: 20000,
    downPayment: 4000,
    repaymentTime: "18 months",
    time: "2024-01-12 04:20 PM",
  },
  {
    userId: "USR005",
    url: "https://example.com/report5",
    report: "Employment Verification",
    creditScore: 720,
    voiceReport: "Approved",
    employerId: "EMP005",
    loanAmount: 40000,
    downPayment: 8000,
    repaymentTime: "30 months",
    time: "2024-01-11 11:10 AM",
  },
]

type SortField = keyof UserReport
type SortDirection = "asc" | "desc"

export function UserReportsTable() {
  const [filters, setFilters] = useState<FilterState>({ search: "" })
  const [sortField, setSortField] = useState<SortField>("time")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredAndSortedReports = mockUserReports
    .filter((report) => {
      // Search filter
      const matchesSearch = filters.search
        ? report.userId.toLowerCase().includes(filters.search.toLowerCase()) ||
          report.report.toLowerCase().includes(filters.search.toLowerCase()) ||
          report.employerId.toLowerCase().includes(filters.search.toLowerCase())
        : true

      // Credit score range filter
      const matchesCreditScore =
        (!filters.creditScoreMin || report.creditScore >= filters.creditScoreMin) &&
        (!filters.creditScoreMax || report.creditScore <= filters.creditScoreMax)

      // Loan amount range filter
      const matchesLoanAmount =
        (!filters.loanAmountMin || report.loanAmount >= filters.loanAmountMin) &&
        (!filters.loanAmountMax || report.loanAmount <= filters.loanAmountMax)

      // Report type filter
      const matchesReportType = !filters.reportType || report.report === filters.reportType

      // Voice report filter
      const matchesVoiceReport = !filters.voiceReport || report.voiceReport === filters.voiceReport

      // Date range filter (simplified for demo)
      const matchesDateRange = true // Would implement actual date parsing in real app

      return (
        matchesSearch &&
        matchesCreditScore &&
        matchesLoanAmount &&
        matchesReportType &&
        matchesVoiceReport &&
        matchesDateRange
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

  const getVoiceReportBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
      case "Under Review":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Under Review</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return "text-green-600 font-semibold"
    if (score >= 650) return "text-yellow-600 font-semibold"
    return "text-red-600 font-semibold"
  }

  const exportHeaders = [
    "User ID",
    "URL",
    "Report",
    "Credit Score",
    "Voice Report",
    "Employer ID",
    "Loan Amount",
    "Down Payment",
    "Repayment Time",
    "Time",
  ]

  const handlePDFExport = () => {
    generatePDF(filteredAndSortedReports, exportHeaders, "User Reports - CreditNova")
  }

  const exportToCSV = () => {
    const headers = [
      "User ID",
      "URL",
      "Report",
      "Credit Score",
      "Voice Report",
      "Employer ID",
      "Loan Amount",
      "Down Payment",
      "Repayment Time",
      "Time",
    ]
    const csvContent = [
      headers.join(","),
      ...filteredAndSortedReports.map((report) =>
        [
          report.userId,
          report.url,
          report.report,
          report.creditScore,
          report.voiceReport,
          report.employerId,
          report.loanAmount,
          report.downPayment,
          report.repaymentTime,
          report.time,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "user-reports.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <AdvancedFilters onFiltersChange={setFilters} filterType="user-reports" />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>User Reports ({filteredAndSortedReports.length} results)</CardTitle>
            <div className="flex gap-2">
              <Button onClick={handlePDFExport} variant="outline" className="gap-2 bg-transparent">
                <FileText className="w-4 h-4" />
                Print PDF
              </Button>
              <ExportButton data={filteredAndSortedReports} filename="user-reports" headers={exportHeaders} />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("userId")}>
                    <div className="flex items-center gap-2">
                      User ID
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("report")}>
                    <div className="flex items-center gap-2">
                      Report
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("creditScore")}>
                    <div className="flex items-center gap-2">
                      Credit Score
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("voiceReport")}>
                    <div className="flex items-center gap-2">
                      Voice Report
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("employerId")}>
                    <div className="flex items-center gap-2">
                      Employer ID
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("loanAmount")}>
                    <div className="flex items-center gap-2">
                      Loan Amount
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("downPayment")}>
                    <div className="flex items-center gap-2">
                      Down Payment
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead>Repayment Time</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("time")}>
                    <div className="flex items-center gap-2">
                      Time
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedReports.map((report) => (
                  <TableRow key={report.userId}>
                    <TableCell className="font-medium">{report.userId}</TableCell>
                    <TableCell>
                      <a
                        href={report.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        View Report
                      </a>
                    </TableCell>
                    <TableCell>{report.report}</TableCell>
                    <TableCell className={getCreditScoreColor(report.creditScore)}>{report.creditScore}</TableCell>
                    <TableCell>{getVoiceReportBadge(report.voiceReport)}</TableCell>
                    <TableCell>{report.employerId}</TableCell>
                    <TableCell>${report.loanAmount.toLocaleString()}</TableCell>
                    <TableCell>${report.downPayment.toLocaleString()}</TableCell>
                    <TableCell>{report.repaymentTime}</TableCell>
                    <TableCell>{report.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAndSortedReports.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No reports found matching your criteria.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
