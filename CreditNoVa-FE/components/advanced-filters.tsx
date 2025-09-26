"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  filterType: "user-reports" | "personal-info"
}

export interface FilterState {
  search: string
  creditScoreMin?: number
  creditScoreMax?: number
  loanAmountMin?: number
  loanAmountMax?: number
  incomeMin?: number
  incomeMax?: number
  reportType?: string
  voiceReport?: string
  gender?: string
  maritalStatus?: string
  housingType?: string
  industry?: string
  dateFrom?: string
  dateTo?: string
}

export function AdvancedFilters({ onFiltersChange, filterType }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    search: "",
  })

  const updateFilter = (key: keyof FilterState, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters: FilterState = { search: "" }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => key !== "search" && value !== undefined && value !== "")
      .length
  }

  const renderUserReportsFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label>Credit Score Range</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.creditScoreMin || ""}
            onChange={(e) => updateFilter("creditScoreMin", e.target.value ? Number(e.target.value) : undefined)}
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.creditScoreMax || ""}
            onChange={(e) => updateFilter("creditScoreMax", e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Loan Amount Range ($)</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.loanAmountMin || ""}
            onChange={(e) => updateFilter("loanAmountMin", e.target.value ? Number(e.target.value) : undefined)}
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.loanAmountMax || ""}
            onChange={(e) => updateFilter("loanAmountMax", e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Report Type</Label>
        <Select
          value={filters.reportType || "All Report Types"}
          onValueChange={(value) => updateFilter("reportType", value || undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Report Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Report Types">All Report Types</SelectItem>
            <SelectItem value="Credit Assessment">Credit Assessment</SelectItem>
            <SelectItem value="Risk Analysis">Risk Analysis</SelectItem>
            <SelectItem value="Income Verification">Income Verification</SelectItem>
            <SelectItem value="Background Check">Background Check</SelectItem>
            <SelectItem value="Employment Verification">Employment Verification</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Voice Report Status</Label>
        <Select
          value={filters.voiceReport || "All Statuses"}
          onValueChange={(value) => updateFilter("voiceReport", value || undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Statuses">All Statuses</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
            <SelectItem value="Under Review">Under Review</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Date Range</Label>
        <div className="flex gap-2">
          <Input
            type="date"
            value={filters.dateFrom || ""}
            onChange={(e) => updateFilter("dateFrom", e.target.value || undefined)}
          />
          <Input
            type="date"
            value={filters.dateTo || ""}
            onChange={(e) => updateFilter("dateTo", e.target.value || undefined)}
          />
        </div>
      </div>
    </div>
  )

  const renderPersonalInfoFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label>Gender</Label>
        <Select
          value={filters.gender || "All Genders"}
          onValueChange={(value) => updateFilter("gender", value || undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Genders" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Genders">All Genders</SelectItem>
            <SelectItem value="Nam">Nam</SelectItem>
            <SelectItem value="Nữ">Nữ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Marital Status</Label>
        <Select
          value={filters.maritalStatus || "All Statuses"}
          onValueChange={(value) => updateFilter("maritalStatus", value || undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Statuses">All Statuses</SelectItem>
            <SelectItem value="Độc thân">Độc thân</SelectItem>
            <SelectItem value="Đã kết hôn">Đã kết hôn</SelectItem>
            <SelectItem value="Ly hôn">Ly hôn</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Housing Type</Label>
        <Select
          value={filters.housingType || "All Housing Types"}
          onValueChange={(value) => updateFilter("housingType", value || undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Housing Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Housing Types">All Housing Types</SelectItem>
            <SelectItem value="Sở hữu nhà">Sở hữu nhà</SelectItem>
            <SelectItem value="Thuê nhà">Thuê nhà</SelectItem>
            <SelectItem value="Ở cùng gia đình">Ở cùng gia đình</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Industry</Label>
        <Select
          value={filters.industry || "All Industries"}
          onValueChange={(value) => updateFilter("industry", value || undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Industries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Industries">All Industries</SelectItem>
            <SelectItem value="Công nghệ thông tin">Công nghệ thông tin</SelectItem>
            <SelectItem value="Tài chính">Tài chính</SelectItem>
            <SelectItem value="Y tế">Y tế</SelectItem>
            <SelectItem value="Giáo dục">Giáo dục</SelectItem>
            <SelectItem value="Thương mại">Thương mại</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Monthly Income Range (VND)</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.incomeMin || ""}
            onChange={(e) => updateFilter("incomeMin", e.target.value ? Number(e.target.value) : undefined)}
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.incomeMax || ""}
            onChange={(e) => updateFilter("incomeMax", e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
      </div>
    </div>
  )

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                <CardTitle className="text-lg">Advanced Filters</CardTitle>
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {getActiveFiltersCount()} active
                  </Badge>
                )}
              </div>
              {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Search Input */}
            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                placeholder={
                  filterType === "user-reports"
                    ? "Search by User ID, Report, or Employer ID..."
                    : "Search by name, ID, company, or occupation..."
                }
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
              />
            </div>

            {/* Specific Filters */}
            {filterType === "user-reports" ? renderUserReportsFilters() : renderPersonalInfoFilters()}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={clearFilters} className="gap-2 bg-transparent">
                <X className="w-4 h-4" />
                Clear All
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
