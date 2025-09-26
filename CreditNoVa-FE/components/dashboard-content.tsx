"use client"
import { Card, CardContent } from "@/components/ui/card"
import { DynamicCharts } from "@/components/dynamic-charts"
import { UserReportsTable } from "@/components/user-reports-table"
import { PersonalInfoTable } from "@/components/personal-info-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCreditSurveys } from "@/hooks/use-credit-survey"
import { CreditSurveysTable } from "@/components/credit-surveys-table"

export function DashboardContent() {
  const { surveys, loading, error } = useCreditSurveys()

  // Calculate stats from surveys data
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Credit Survey Dashboard</h1>
        {loading && <div className="text-sm text-muted-foreground">Đang tải dữ liệu...</div>}
        {error && <div className="text-sm text-red-500">Lỗi: {error}</div>}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6"></div>

      {/* Charts Section */}
      <DynamicCharts />

      {/* Tables Section */}
      <Tabs defaultValue="credit-surveys" className="space-y-4">
        <TabsList>
          <TabsTrigger value="credit-surveys">Credit Surveys</TabsTrigger>
          <TabsTrigger value="user-reports">User Reports</TabsTrigger>
          <TabsTrigger value="personal-info">Personal Information</TabsTrigger>
        </TabsList>

        <TabsContent value="credit-surveys">
          <CreditSurveysTable />
        </TabsContent>

        <TabsContent value="user-reports">
          <UserReportsTable />
        </TabsContent>

        <TabsContent value="personal-info">
          <PersonalInfoTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
