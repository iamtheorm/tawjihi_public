"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, ResponsiveContainer, XAxis, YAxis, Area, CartesianGrid, BarChart, Bar } from "recharts"
import { AlertTriangle, ArrowUp, ArrowUpRight, DollarSign, TrendingUp, Users } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Cookies from 'js-cookie'
import { useState, useEffect } from "react"
import axios from 'axios'
import { exportToCSV } from "@/lib/utils"
import { baseUrl } from "@/lib/api"

interface DashboardSummary {
  activeCustomers: number
  conversionRate: number
  revenueImpact: number
  highValueLeads: number
}

interface CustomerActivity {
  month: string
  active: number
  dormant: number
}

interface ConversionRate {
  month: string
  rate: number
}

interface TopRecommendation {
  id: number
  product: string
  segment: string
  conversion: string
  potential: "High" | "Medium" | "Low"
}

interface Alert {
  id: number
  title: string
  description: string
  type: "warning" | "alert" | "opportunity"
}

interface DashboardData {
  customerActivity: CustomerActivity[]
  conversionRate: ConversionRate[]
  topRecommendations: TopRecommendation[]
  alerts: Alert[]
  summary: DashboardSummary
}

export default function DashboardPage() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    customerActivity: [],
    conversionRate: [],
    topRecommendations: [],
    alerts: [],
    summary: {
      activeCustomers: 0,
      conversionRate: 0,
      revenueImpact: 0,
      highValueLeads: 0
    }
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const headers = {
        'Content-Type': 'application/json'
      }

      // Fetch dashboard summary
      const summaryResponse = await axios.get(`${baseUrl}/dashboard/overview`, { headers })
      setDashboardData(prev => ({
        ...prev,
        summary: {
          activeCustomers: summaryResponse.data.active_customers,
          conversionRate: summaryResponse.data.conversion_rate,
          revenueImpact: summaryResponse.data.revenue_impact,
          highValueLeads: summaryResponse.data.new_customers
        }
      }))

      // Fetch customer activity
      const activityResponse = await axios.get(`${baseUrl}/dashboard/customer-activity`, { headers })
      setDashboardData(prev => ({
        ...prev,
        customerActivity: activityResponse.data
      }))

      // Fetch conversion rate
      const conversionResponse = await axios.get(`${baseUrl}/dashboard/conversion-rates`, { headers })
      setDashboardData(prev => ({
        ...prev,
        conversionRate: conversionResponse.data
      }))

      // Fetch top recommendations
      const recommendationsResponse = await axios.get(`${baseUrl}/dashboard/top-recommendations`, { headers })
      setDashboardData(prev => ({
        ...prev,
        topRecommendations: recommendationsResponse.data
      }))

      // Fetch alerts
      const alertsResponse = await axios.get(`${baseUrl}/dashboard/alerts`, { headers })
      setDashboardData(prev => ({
        ...prev,
        alerts: alertsResponse.data
      }))

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout. Please try again.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleExport = () => {
    try {
      // Export dashboard data
      const exportData = {
        overview: {
          active_customers: dashboardData.summary.activeCustomers,
          conversion_rate: dashboardData.summary.conversionRate,
          revenue_impact: dashboardData.summary.revenueImpact,
          new_customers: dashboardData.summary.highValueLeads
        },
        customer_activity: dashboardData.customerActivity,
        conversion_rates: dashboardData.conversionRate,
        top_recommendations: dashboardData.topRecommendations
      };

      // Export each section separately
      exportToCSV([exportData.overview], "dashboard_overview");
      exportToCSV(exportData.customer_activity, "customer_activity");
      exportToCSV(exportData.conversion_rates, "conversion_rates");
      exportToCSV(exportData.top_recommendations, "top_recommendations");
      
      toast.success("Dashboard data exported successfully");
    } catch (error) {
      console.error('Error exporting dashboard data:', error);
      toast.error("Failed to export dashboard data");
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-full">
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-banking-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <Button className="bg-banking-500 hover:bg-banking-600" onClick={handleExport}>Export Overview</Button>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="stat-card">
          <div className="flex items-start justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Customers</p>
              <p className="text-2xl font-bold">{dashboardData.summary.activeCustomers}</p>
            </div>
            <div className="rounded-full bg-banking-100 p-2 text-banking-500">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <div className="px-6 pb-4">
            <div className="flex items-center gap-1 text-sm text-success">
              <ArrowUp className="h-4 w-4" />
              <span>12% from last month</span>
            </div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="flex items-start justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold">{dashboardData.summary.conversionRate}%</p>
            </div>
            <div className="rounded-full bg-banking-100 p-2 text-banking-500">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <div className="px-6 pb-4">
            <div className="flex items-center gap-1 text-sm text-success">
              <ArrowUp className="h-4 w-4" />
              <span>8% increase</span>
            </div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="flex items-start justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Revenue Impact</p>
              <p className="text-2xl font-bold">{dashboardData.summary.revenueImpact} OMR</p>
            </div>
            <div className="rounded-full bg-banking-100 p-2 text-banking-500">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
          <div className="px-6 pb-4">
            <div className="flex items-center gap-1 text-sm text-success">
              <ArrowUp className="h-4 w-4" />
              <span>15% from last quarter</span>
            </div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="flex items-start justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">High-Value Leads</p>
              <p className="text-2xl font-bold">{dashboardData.summary.highValueLeads}</p>
            </div>
            <div className="rounded-full bg-banking-100 p-2 text-banking-500">
              <ArrowUpRight className="h-6 w-6" />
            </div>
          </div>
          <div className="px-6 pb-4">
            <div className="flex items-center gap-1 text-sm text-success">
              <ArrowUp className="h-4 w-4" />
              <span>24 new this week</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Activity</CardTitle>
            <CardDescription>Active vs. dormant customers over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                active: {
                  label: "Active Customers",
                  color: "hsl(var(--primary))",
                },
                dormant: {
                  label: "Dormant Customers",
                  color: "hsl(var(--muted-foreground))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardData.customerActivity} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="active"
                    stackId="1"
                    stroke="var(--color-active)"
                    fill="var(--color-active)"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="dormant"
                    stackId="1"
                    stroke="var(--color-dormant)"
                    fill="var(--color-dormant)"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendation Conversion Rate</CardTitle>
            <CardDescription>Percentage of accepted recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                rate: {
                  label: "Conversion Rate",
                  color: "hsl(var(--primary))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.conversionRate} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 60]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="rate" name="Conversion Rate %" fill="var(--color-rate)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Recommendations */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Recommendations</CardTitle>
            <CardDescription>Highest performing product recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.topRecommendations.map((rec) => (
                <div key={rec.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <div className="font-medium">{rec.product}</div>
                    <div className="text-sm text-muted-foreground">Segment: {rec.segment}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">{rec.conversion}</div>
                      <div className="text-xs text-muted-foreground">Conversion</div>
                    </div>
                    <Badge variant={rec.potential === "High" ? "default" : "secondary"}>{rec.potential}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Important notifications and behavioral triggers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                  <div
                    className={`rounded-full p-2 ${
                      alert.type === "warning"
                        ? "bg-warning/20 text-warning"
                        : alert.type === "alert"
                          ? "bg-destructive/20 text-destructive"
                          : "bg-success/20 text-success"
                    }`}
                  >
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{alert.title}</div>
                    <div className="text-sm text-muted-foreground">{alert.description}</div>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
