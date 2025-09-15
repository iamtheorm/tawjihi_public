"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Download, Filter, PieChartIcon, BarChart3, TrendingUp } from "lucide-react"
import { toast } from "sonner"
import Cookies from 'js-cookie'
import { exportToCSV } from "@/lib/utils"
import { baseUrl } from "@/lib/api"

const COLORS = ["#2fb3b6", "#36b9c8", "#4dc4d8", "#65cfe8", "#7edaf8"]

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState("2023")
  const [activeTab, setActiveTab] = useState("overview")
  const [summaryData, setSummaryData] = useState({
    total_customers: 0,
    total_assets: 0,
    net_cash_flow: 0
  })
  const [monthlyTrendsData, setMonthlyTrendsData] = useState([])
  const [customerSegmentData, setCustomerSegmentData] = useState([])
  const [productPerformanceData, setProductPerformanceData] = useState([])
  const [regionalPerformanceData, setRegionalPerformanceData] = useState([])
  const [customerGrowthData, setCustomerGrowthData] = useState([])

  const fetchData = async () => {
    try {
      setLoading(true)
      const headers = {
        'Content-Type': 'application/json'
      }

      // Fetch summary data
      const summaryResponse = await fetch(`${baseUrl}/analytics/summary`, { headers })
      if (!summaryResponse.ok) {
        throw new Error('Failed to fetch summary data')
      }
      const summary = await summaryResponse.json()
      setSummaryData(summary)

      // Fetch monthly trends
      const trendsResponse = await fetch(`${baseUrl}/analytics/monthly-trends?year=${selectedYear}`, { headers })
      if (!trendsResponse.ok) {
        throw new Error('Failed to fetch monthly trends')
      }
      const trends = await trendsResponse.json()
      setMonthlyTrendsData(trends)

      // Fetch customer segments
      const segmentsResponse = await fetch(`${baseUrl}/analytics/customer-segments`, { headers })
      if (!segmentsResponse.ok) {
        throw new Error('Failed to fetch customer segments')
      }
      const segments = await segmentsResponse.json()
      setCustomerSegmentData(segments)

      // Fetch product performance
      const productsResponse = await fetch(`${baseUrl}/analytics/product-performance?period=${selectedYear}-Q2`, { headers })
      if (!productsResponse.ok) {
        throw new Error('Failed to fetch product performance')
      }
      const products = await productsResponse.json()
      setProductPerformanceData(products)

      // Fetch regional performance
      const regionsResponse = await fetch(`${baseUrl}/analytics/regional-performance?period=${selectedYear}-Q2`, { headers })
      if (!regionsResponse.ok) {
        throw new Error('Failed to fetch regional performance')
      }
      const regions = await regionsResponse.json()
      setRegionalPerformanceData(regions)

      // Fetch customer growth
      const growthResponse = await fetch(`${baseUrl}/analytics/customer-growth?year=${selectedYear}`, { headers })
      if (!growthResponse.ok) {
        throw new Error('Failed to fetch customer growth')
      }
      const growth = await growthResponse.json()
      setCustomerGrowthData(growth)

    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error("Failed to fetch analytics data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [selectedYear])

  const handleExport = () => {
    try {
      switch (activeTab) {
        case "overview":
          // Export monthly trends and customer segments
          exportToCSV(monthlyTrendsData, "monthly_trends");
          exportToCSV(customerSegmentData, "customer_segments");
          break;
        case "customers":
          exportToCSV(customerGrowthData, "customer_growth");
          break;
        case "products":
          exportToCSV(productPerformanceData, "product_performance");
          break;
        case "regions":
          exportToCSV(regionalPerformanceData, "regional_performance");
          break;
      }
      toast.success("Data exported successfully");
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error("Failed to export data");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-banking-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-sm text-muted-foreground">Comprehensive analytics and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button className="bg-banking-500 hover:bg-banking-600" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 mt-6">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="regions">Regions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <div className="flex items-start justify-between p-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                  <p className="text-2xl font-bold">{summaryData?.total_customers?.toLocaleString() || 0}</p>
                </div>
                <div className="rounded-full bg-banking-100 p-2 text-banking-500">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
              <div className="px-6 pb-4">
                <div className="flex items-center gap-1 text-sm text-success">
                  <span>↑ 8.5% from last month</span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start justify-between p-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Assets</p>
                  <p className="text-2xl font-bold">{summaryData?.total_assets?.toLocaleString() || 0} OMR</p>
                </div>
                <div className="rounded-full bg-banking-100 p-2 text-banking-500">
                  <BarChart3 className="h-6 w-6" />
                </div>
              </div>
              <div className="px-6 pb-4">
                <div className="flex items-center gap-1 text-sm text-success">
                  <span>↑ 12.3% from last quarter</span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start justify-between p-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Net Cash Flow</p>
                  <p className="text-2xl font-bold">{summaryData?.net_cash_flow?.toLocaleString() || 0} OMR</p>
                </div>
                <div className="rounded-full bg-banking-100 p-2 text-banking-500">
                  <PieChartIcon className="h-6 w-6" />
                </div>
              </div>
              <div className="px-6 pb-4">
                <div className="flex items-center gap-1 text-sm text-success">
                  <span>↑ 5.2% from last month</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Financial Trends</CardTitle>
                <CardDescription>Deposits, withdrawals, and net cash flow</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    deposits: {
                      label: "Deposits",
                      color: "#2fb3b6",
                    },
                    withdrawals: {
                      label: "Withdrawals",
                      color: "#ff9580",
                    },
                    net_flow: {
                      label: "Net Flow",
                      color: "#8884d8",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrendsData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="deposits"
                        stroke="var(--color-deposits)"
                        fill="var(--color-deposits)"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="withdrawals"
                        stroke="var(--color-withdrawals)"
                        fill="var(--color-withdrawals)"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="net_flow"
                        stroke="var(--color-net_flow)"
                        fill="var(--color-net_flow)"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
                <CardDescription>Distribution of customers by segment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customerSegmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {customerSegmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Growth Trend</CardTitle>
              <CardDescription>Monthly customer acquisition and retention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={customerGrowthData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="new_customers" stroke="#2fb3b6" name="New Customers" />
                    <Line type="monotone" dataKey="churned_customers" stroke="#ff9580" name="Churned Customers" />
                    <Line type="monotone" dataKey="net_growth" stroke="#8884d8" name="Net Growth" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>Performance metrics by product category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={productPerformanceData}
                    margin={{ top: 10, right: 30, left: -10, bottom: 80 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      interval={0}
                      tick={{ fontSize: 12 }}
                      angle={-30}
                      textAnchor="end"
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="current" fill="#2fb3b6" name="Current Performance" />
                    <Bar dataKey="previous" fill="#8884d8" name="Previous Performance" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regional Performance</CardTitle>
              <CardDescription>Key metrics by region</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  customers: {
                    label: "Customers",
                    color: "#2fb3b6",
                  },
                  revenue: {
                    label: "Revenue (OMR)",
                    color: "#8884d8",
                  },
                  growth: {
                    label: "Growth (%)",
                    color: "#82ca9d",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionalPerformanceData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar yAxisId="left" dataKey="customers" fill="var(--color-customers)" />
                    <Bar yAxisId="left" dataKey="revenue" fill="var(--color-revenue)" />
                    <Bar yAxisId="right" dataKey="growth" fill="var(--color-growth)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
