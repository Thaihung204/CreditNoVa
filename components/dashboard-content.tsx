"use client"
import { Card, CardContent } from "@/components/ui/card"
import { DynamicCharts } from "@/components/dynamic-charts"
import { UserReportsTable } from "@/components/user-reports-table"
import { PersonalInfoTable } from "@/components/personal-info-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DashboardContent() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transactions</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-orange-500">$12,500</div>
            <div className="text-sm text-muted-foreground">Total Revenue</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-orange-500">$12,500</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-orange-500">$12,500</div>
            <div className="text-sm text-muted-foreground">Pending Reports</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <DynamicCharts />

      {/* Tables Section */}
      <Tabs defaultValue="user-reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="user-reports">User Reports</TabsTrigger>
          <TabsTrigger value="personal-info">Personal Information</TabsTrigger>
        </TabsList>

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
