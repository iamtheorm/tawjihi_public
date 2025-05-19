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
import { useState } from "react"

// Sample data for charts and metrics
const customerActivityData = [
  { month: "Jan", active: 420, dormant: 80 },
  { month: "Feb", active: 450, dormant: 70 },
  { month: "Mar", active: 480, dormant: 60 },
  { month: "Apr", active: 520, dormant: 50 },
  { month: "May", active: 550, dormant: 40 },
  { month: "Jun", active: 580, dormant: 35 },
  { month: "Jul", active: 620, dormant: 30 },
]

const conversionRateData = [
  { month: "Jan", rate: 32 },
  { month: "Feb", rate: 34 },
  { month: "Mar", rate: 38 },
  { month: "Apr", rate: 40 },
  { month: "May", rate: 45 },
  { month: "Jun", rate: 48 },
  { month: "Jul", rate: 52 },
]

const topRecommendations = [
  {
    id: 1,
    product: "Al Jawhar Credit Card",
    segment: "High Net Worth",
    conversion: "48%",
    potential: "High",
  },
  {
    id: 2,
    product: "Home Loan",
    segment: "Homeowners",
    conversion: "42%",
    potential: "Medium",
  },
  {
    id: 3,
    product: "Mutual Funds - Fund 1",
    segment: "Young Professionals",
    conversion: "37%",
    potential: "High",
  },
  {
    id: 4,
    product: "Personal Loan",
    segment: "Small Business",
    conversion: "35%",
    potential: "Medium",
  },
]

const alerts = [
  {
    id: 1,
    title: "High Spending Alert",
    description: "15 customers in Muscat with unusual spending patterns detected",
    type: "warning",
  },
  {
    id: 2,
    title: "Dormant Account Increase",
    description: "5% increase in dormant accounts in Salalah region",
    type: "alert",
  },
  {
    id: 3,
    title: "New Opportunity",
    description: "35 customers eligible for Family Protection Insurance",
    type: "opportunity",
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      
      // Remove the token cookie with the same options it was set with
      Cookies.remove('token', {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
      
      // Show success message
      toast.success('Logged out successfully')
      
      // Redirect to login page
      router.push('/')
    } catch (error) {
      toast.error('Failed to logout. Please try again.')
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="w-[1400px]">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Dashboard Overview</h1>
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Active Customers</p>
              <p className="stat-value">5,320</p>
            </div>
            <div className="rounded-full bg-banking-100 p-2 text-banking-500">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-success">
            <ArrowUp className="h-4 w-4" />
            <span>12% from last month</span>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Conversion Rate</p>
              <p className="stat-value">46%</p>
            </div>
            <div className="rounded-full bg-banking-100 p-2 text-banking-500">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-success">
            <ArrowUp className="h-4 w-4" />
            <span>8% increase</span>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Revenue Impact</p>
              <p className="stat-value">1.2M OMR</p>
            </div>
            <div className="rounded-full bg-banking-100 p-2 text-banking-500">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-success">
            <ArrowUp className="h-4 w-4" />
            <span>15% from last quarter</span>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">High-Value Leads</p>
              <p className="stat-value">328</p>
            </div>
            <div className="rounded-full bg-banking-100 p-2 text-banking-500">
              <ArrowUpRight className="h-6 w-6" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-success">
            <ArrowUp className="h-4 w-4" />
            <span>24 new this week</span>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
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
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={customerActivityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conversionRateData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Recommendations</CardTitle>
            <CardDescription>Highest performing product recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRecommendations.map((rec) => (
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
              {alerts.map((alert) => (
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
                  <div>
                    <div className="font-medium">{alert.title}</div>
                    <div className="text-sm text-muted-foreground">{alert.description}</div>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto shrink-0">
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
