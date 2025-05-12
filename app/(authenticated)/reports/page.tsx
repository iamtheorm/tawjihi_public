"use client"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Calendar,
  Check,
  CreditCard,
  Download,
  FileText,
  Filter,
  Printer,
  RefreshCw,
  Search,
  Share,
  UserCircle,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample data for charts
const conversionData = [
  { month: "Jan", rate: 32 },
  { month: "Feb", rate: 34 },
  { month: "Mar", rate: 36 },
  { month: "Apr", rate: 38 },
  { month: "May", rate: 40 },
  { month: "Jun", rate: 42 },
  { month: "Jul", rate: 45 },
]

const productPerformanceData = [
  { name: "Credit Cards", value: 35 },
  { name: "Loans", value: 25 },
  { name: "Investments", value: 20 },
  { name: "Savings", value: 15 },
  { name: "Insurance", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const teamPerformanceData = [
  {
    name: "Team A",
    recommendations: 320,
    conversions: 190,
    conversionRate: 59,
  },
  {
    name: "Team B",
    recommendations: 280,
    conversions: 145,
    conversionRate: 52,
  },
  {
    name: "Team C",
    recommendations: 350,
    conversions: 175,
    conversionRate: 50,
  },
  {
    name: "Team D",
    recommendations: 310,
    conversions: 135,
    conversionRate: 44,
  },
  {
    name: "Team E",
    recommendations: 290,
    conversions: 120,
    conversionRate: 41,
  },
]

const recentReports = [
  {
    id: "1",
    name: "Q2 Performance Summary",
    type: "Quarterly Report",
    generated: "Jul 15, 2023",
    format: "PDF",
  },
  {
    id: "2",
    name: "High Value Customer Analysis",
    type: "Segment Analysis",
    generated: "Jul 10, 2023",
    format: "Excel",
  },
  {
    id: "3",
    name: "Product Recommendation Trends",
    type: "Monthly Report",
    generated: "Jul 5, 2023",
    format: "PDF",
  },
  {
    id: "4",
    name: "Team Performance Metrics",
    type: "Team Report",
    generated: "Jul 1, 2023",
    format: "PDF",
  },
  {
    id: "5",
    name: "Regional Customer Distribution",
    type: "Geographic Analysis",
    generated: "Jun 25, 2023",
    format: "Excel",
  },
]

export default function ReportsPage() {
  return (
    <div className="w-[1400px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Reports & Export</h1>
          <p className="page-description">Generate and export reports and analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Report
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            New Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
          <TabsTrigger value="team">Team Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="stat-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="stat-title">Recommendations</p>
                  <p className="stat-value">1,550</p>
                </div>
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <CreditCard className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-success">
                <span>Generated this month</span>
              </div>
            </Card>

            <Card className="stat-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="stat-title">Conversions</p>
                  <p className="stat-value">698</p>
                </div>
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <Check className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-success">
                <span>45% conversion rate</span>
              </div>
            </Card>

            <Card className="stat-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="stat-title">Revenue Impact</p>
                  <p className="stat-value">OMR 1.2M</p>
                </div>
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <RefreshCw className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-success">
                <span>Estimated from conversions</span>
              </div>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate Trend</CardTitle>
                <CardDescription>Recommendation acceptance rate over time</CardDescription>
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
                    <AreaChart data={conversionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 60]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="rate"
                        stroke="var(--color-rate)"
                        fill="var(--color-rate)"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
                <CardDescription>Recommendations by product type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productPerformanceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {productPerformanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {productPerformanceData.map((item, index) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Export Reports</CardTitle>
                <CardDescription>Generate and download reports</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Printer className="mr-2 h-4 w-4" />
                Print View
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Select defaultValue="monthly">
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly Performance</SelectItem>
                        <SelectItem value="quarterly">Quarterly Summary</SelectItem>
                        <SelectItem value="segment">Segment Analysis</SelectItem>
                        <SelectItem value="product">Product Performance</SelectItem>
                        <SelectItem value="team">Team Performance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Regions</SelectItem>
                        <SelectItem value="north">North</SelectItem>
                        <SelectItem value="east">East</SelectItem>
                        <SelectItem value="south">South</SelectItem>
                        <SelectItem value="west">West</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Select defaultValue="pdf">
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="csv">CSV File</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="shrink-0">
                    <Download className="mr-2 h-4 w-4" />
                    Generate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Recent Reports</CardTitle>
                  <CardDescription>Previously generated reports</CardDescription>
                </div>
                <div className="mt-4 flex items-center gap-2 sm:mt-0">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search reports..." className="pl-8 sm:w-[300px]" />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Generated</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <div className="font-medium">{report.name}</div>
                        </TableCell>
                        <TableCell>{report.type}</TableCell>
                        <TableCell>{report.generated}</TableCell>
                        <TableCell>
                          <Badge variant={report.format === "PDF" ? "default" : "secondary"}>{report.format}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost">
                              <Share className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                Showing <strong>5</strong> of <strong>12</strong> reports
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Automatically generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                    <div>
                      <div className="font-medium">Monthly Performance Summary</div>
                      <div className="text-sm text-muted-foreground">First day of each month</div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 sm:mt-0">
                      <Badge>Active</Badge>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                    <div>
                      <div className="font-medium">Team Performance Report</div>
                      <div className="text-sm text-muted-foreground">Every Monday at 9 AM</div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 sm:mt-0">
                      <Badge>Active</Badge>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                    <div>
                      <div className="font-medium">Quarterly Business Review</div>
                      <div className="text-sm text-muted-foreground">Last day of each quarter</div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 sm:mt-0">
                      <Badge>Active</Badge>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule New Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
              <CardDescription>Recommendation to conversion rates by team</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  recommendations: {
                    label: "Recommendations",
                    color: "hsl(var(--primary))",
                  },
                  conversions: {
                    label: "Conversions",
                    color: "hsl(var(--success))",
                  },
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamPerformanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="recommendations" fill="var(--color-recommendations)" />
                    <Bar dataKey="conversions" fill="var(--color-conversions)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="text-sm font-medium">Team Performance Breakdown</div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Team</TableHead>
                        <TableHead>Recommendations</TableHead>
                        <TableHead>Conversions</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamPerformanceData.map((team) => (
                        <TableRow key={team.name}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{team.name.split(" ")[1]}</AvatarFallback>
                              </Avatar>
                              <div className="font-medium">{team.name}</div>
                            </div>
                          </TableCell>
                          <TableCell>{team.recommendations}</TableCell>
                          <TableCell>{team.conversions}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                team.conversionRate > 55
                                  ? "default"
                                  : team.conversionRate > 45
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {team.conversionRate}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <UserCircle className="mr-2 h-4 w-4" />
                Team Members
              </Button>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
