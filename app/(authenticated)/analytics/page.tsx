"use client"

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

// Sample data for charts
const monthlyTrendsData = [
  { month: "Jan", deposits: 1200000, withdrawals: 800000, netFlow: 400000 },
  { month: "Feb", deposits: 1350000, withdrawals: 900000, netFlow: 450000 },
  { month: "Mar", deposits: 1500000, withdrawals: 950000, netFlow: 550000 },
  { month: "Apr", deposits: 1400000, withdrawals: 1000000, netFlow: 400000 },
  { month: "May", deposits: 1600000, withdrawals: 1100000, netFlow: 500000 },
  { month: "Jun", deposits: 1800000, withdrawals: 1200000, netFlow: 600000 },
  { month: "Jul", deposits: 2000000, withdrawals: 1300000, netFlow: 700000 },
]

const monthlyInvestmentGrowthData = [
  { month: 'Jan', investmentGrowth: 500 },
  { month: 'Feb', investmentGrowth: 1300 },
  { month: 'Mar', investmentGrowth: 1900 },
  { month: 'Apr', investmentGrowth: 2900 },
  { month: 'May', investmentGrowth: 3600 },
  { month: 'Jun', investmentGrowth: 4600 },
  { month: 'Jul', investmentGrowth: 5600 },
];


const customerData = [
  { month: "Jan", new: 100, churned: 20, net: 80 },
  { month: "Feb", new: 150, churned: 30, net: 120 },
  { month: "Mar", new: 200, churned: 40, net: 160 },
  { month: "Apr", new: 180, churned: 35, net: 145 },
  { month: "May", new: 220, churned: 25, net: 195 },
  { month: "Jun", new: 240, churned: 50, net: 190 },
  { month: "Jul", new: 260, churned: 45, net: 215 },
  { month: "Aug", new: 280, churned: 60, net: 220 },
  { month: "Sep", new: 300, churned: 55, net: 245 },
  { month: "Oct", new: 320, churned: 50, net: 270 },
  { month: "Nov", new: 340, churned: 65, net: 275 },
  { month: "Dec", new: 360, churned: 70, net: 290 },
];



const customerSegmentData = [
  { name: "High Net Worth", value: 35 },
  { name: "Mass Affluent", value: 25 },
  { name: "Retail", value: 30 },
  { name: "Small Business", value: 10 },
]

const COLORS = ["#2fb3b6", "#36b9c8", "#4dc4d8", "#65cfe8", "#7edaf8"]

const regionPerformanceData = [
  { region: "Muscat", customers: 2500, revenue: 1200000, growth: 15 },
  { region: "Salalah", customers: 1200, revenue: 600000, growth: 12 },
  { region: "Sohar", customers: 950, revenue: 450000, growth: 8 },
  { region: "Nizwa", customers: 780, revenue: 350000, growth: 10 },
  { region: "Sur", customers: 650, revenue: 280000, growth: 7 },
]

const productPerformanceData = [
  { name: "Savings Accounts", current: 850, previous: 720 },
  { name: "Current Accounts", current: 650, previous: 600 },
  { name: "Home Finance", current: 450, previous: 380 },
  { name: "Personal Finance", current: 380, previous: 350 },
  { name: "Credit Cards", current: 520, previous: 420 },
  { name: "Investment Products", current: 280, previous: 220 },
]

export default function AnalyticsPage() {
  return (
    <div className="w-[1400px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Analytics Dashboard</h1>
          <p className="page-description">Comprehensive analytics and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="2023">
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
          <Button className="bg-banking-500 hover:bg-banking-600">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="regions">Regions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="stat-card"> 
              <div className="flex items-start justify-between">
                <div>
                  <p className="stat-title">Total Customers</p>
                  <p className="stat-value">6,080</p>
                </div>
                <div className="rounded-full bg-banking-100 p-2 text-banking-500">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-success">
                <span>↑ 8.5% from last month</span>
              </div>
            </Card>

            <Card className="stat-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="stat-title">Total Assets</p>
                  <p className="stat-value">245M OMR</p>
                </div>
                <div className="rounded-full bg-banking-100 p-2 text-banking-500">
                  <BarChart3 className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-success">
                <span>↑ 12.3% from last quarter</span>
              </div>
            </Card>

            <Card className="stat-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="stat-title">Net Cash Flow</p>
                  <p className="stat-value">3.6M OMR</p>
                </div>
                <div className="rounded-full bg-banking-100 p-2 text-banking-500">
                  <PieChartIcon className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-success">
                <span>↑ 5.2% from last month</span>
              </div>
            </Card>
          </div>

  <div style={{ display: 'flex', width: '100%', gap: '2rem' }}>
  <Card style={{ width: '50%' }}>
    <CardHeader>
      <CardTitle>Monthly Financial Trends</CardTitle>
      <CardDescription>Deposits, withdrawals, and net cash flow</CardDescription>
    </CardHeader>
    <CardContent style={{ display: 'flex', alignItems: 'center' }}>
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
          netFlow: {
            label: "Net Flow",
            color: "#8884d8",
          },
        }}
        className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyTrendsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
              dataKey="netFlow"
              stroke="var(--color-netFlow)"
              fill="var(--color-netFlow)"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  </Card>

  <Card style={{ width: '50%' }}>
  <CardHeader>
    <CardTitle>Investment Growth Trend</CardTitle>
    <CardDescription>Monthly Investment Growth over time</CardDescription>
  </CardHeader>
  <CardContent style={{ display: 'flex', alignItems: 'center' }}>
    <ChartContainer
      config={{
        investmentGrowth: {
          label: "Investment Growth",
          color: "#82ca9d",
        },
      }}
      className="h-80"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={monthlyInvestmentGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="investmentGrowth"
            stroke="var(--color-investmentGrowth)"
            fill="var(--color-investmentGrowth)"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  </CardContent>
</Card>

</div>
          
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
                <CardDescription>Distribution of customers by segment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customerSegmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
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

            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
                <CardDescription>Current vs previous period</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    current: {
                      label: "Current Period",
                      color: "#2fb3b6",
                    },
                    previous: {
                      label: "Previous Period",
                      color: "#8884d8",
                    },
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productPerformanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="current" fill="var(--color-current)" />
                      <Bar dataKey="previous" fill="var(--color-previous)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

<TabsContent value="customers" className="space-y-6">
  <Card className="w-[700px]">
    <CardHeader>
      <CardTitle>Customer Growth Trend</CardTitle>
      <CardDescription>Monthly customer acquisition and retention</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={customerData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="new" stroke="#2fb3b6" name="New Customers" />
            <Line type="monotone" dataKey="churned" stroke="#ff9580" name="Churned Customers" />
            <Line type="monotone" dataKey="net" stroke="#8884d8" name="Net Growth" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>


</TabsContent>


    <TabsContent value="products" className="space-y-6">
  <Card className="w-[700px]">
    <CardHeader>
      <CardTitle>Product Performance</CardTitle>
      <CardDescription>Performance metrics by product category</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-80 pt-4"> {/* Added top padding to prevent overlap */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={productPerformanceData}
            margin={{ top: 10, right: 30, left: 0, bottom: 80 }} // increased bottom margin
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
          <Card className="w-[700px]">
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
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionPerformanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
