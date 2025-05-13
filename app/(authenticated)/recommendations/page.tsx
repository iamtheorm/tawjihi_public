"use client"
import {
  ArrowUpDown,
  Calendar,
  CreditCard,
  Download,
  Filter,
  PieChart,
  Search,
  Stamp,
  User,
  Wallet,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Sample recommendation data
const recommendations = [
  {
    id: "1",
    product: "Premium Credit Card",
    segment: "High Net Worth",
    customerCount: 320,
    conversionRate: 42,
    potential: "high",
    icon: CreditCard,
  },
  {
    id: "2",
    product: "Investment Portfolio",
    segment: "Mass Affluent",
    customerCount: 450,
    conversionRate: 38,
    potential: "high",
    icon: PieChart,
  },
  {
    id: "3",
    product: "Home Loan Refinance",
    segment: "Homeowners",
    customerCount: 620,
    conversionRate: 35,
    potential: "medium",
    icon: Wallet,
  },
  {
    id: "4",
    product: "Savings Account",
    segment: "Young Professionals",
    customerCount: 780,
    conversionRate: 28,
    potential: "medium",
    icon: Stamp,
  },
  {
    id: "5",
    product: "Travel Insurance",
    segment: "Frequent Travelers",
    customerCount: 240,
    conversionRate: 32,
    potential: "low",
    icon: Calendar,
  },
  {
    id: "6",
    product: "Business Credit Line",
    segment: "Small Business",
    customerCount: 180,
    conversionRate: 45,
    potential: "high",
    icon: Wallet,
  },
]

export default function RecommendationsPage() {
  return (
    <div className="w-[1400px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Product Recommendations</h1>
          <p className="page-description">View system-wide product suggestions by category or customer segment</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Campaign
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Recommendations</p>
              <p className="stat-value">2,590</p>
            </div>
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <CreditCard className="h-6 w-6" />
            </div>
          </div>
          <p className="stat-description">Total active recommendations across all customers</p>
        </Card>

        <Card className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Average Conversion</p>
              <p className="stat-value">38%</p>
            </div>
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <PieChart className="h-6 w-6" />
            </div>
          </div>
          <p className="stat-description">Average conversion rate across all products</p>
        </Card>

        <Card className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Top Segment</p>
              <p className="stat-value">High Net Worth</p>
            </div>
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <User className="h-6 w-6" />
            </div>
          </div>
          <p className="stat-description">Segment with highest recommendation acceptance</p>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-4 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            <TabsTrigger value="segment">By Segment</TabsTrigger>
          </TabsList>
          <div className="mt-4 flex items-center gap-2 sm:mt-0">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search recommendations..." className="pl-8 sm:w-[260px]" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Products" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="credit">Credit Cards</SelectItem>
                <SelectItem value="loans">Loans</SelectItem>
                <SelectItem value="investments">Investments</SelectItem>
                <SelectItem value="savings">Savings</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button variant="ghost" className="p-0 font-medium">
                        Product
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Segment</TableHead>
                    <TableHead>Customers</TableHead>
                    <TableHead>Conversion Rate</TableHead>
                    <TableHead>Potential</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recommendations.map((rec) => (
                    <TableRow key={rec.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-primary/10 p-1.5 text-primary">
                            <rec.icon className="h-4 w-4" />
                          </div>
                          <span className="font-medium">{rec.product}</span>
                        </div>
                      </TableCell>
                      <TableCell>{rec.segment}</TableCell>
                      <TableCell>{rec.customerCount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={rec.conversionRate} className="h-2 w-[60px]" />
                          <span>{rec.conversionRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            rec.potential === "high" ? "default" : rec.potential === "medium" ? "secondary" : "outline"
                          }
                        >
                          {rec.potential}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost">
                            View
                          </Button>
                          <Button size="sm">Campaign</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <strong>6</strong> of <strong>24</strong> recommendations
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Recommendation Heatmap</CardTitle>
              <CardDescription>Visualize recommendation strength across customer segments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  <TooltipProvider>
                    <div className="grid grid-cols-[180px_repeat(5,1fr)] gap-2">
                      <div className="col-start-2 text-center text-sm font-medium">High Net Worth</div>
                      <div className="text-center text-sm font-medium">Mass Affluent</div>
                      <div className="text-center text-sm font-medium">Young Professionals</div>
                      <div className="text-center text-sm font-medium">Small Business</div>
                      <div className="text-center text-sm font-medium">Retail</div>

                      <div className="text-sm font-medium">Premium Credit Card</div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/90 p-4 text-center text-white">92%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>320 customers, 42% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/70 p-4 text-center text-white">78%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>280 customers, 35% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/50 p-4 text-center text-white">64%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>190 customers, 28% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/30 p-4 text-center text-white">45%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>120 customers, 22% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/20 p-4 text-center text-white">32%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>85 customers, 18% conversion</p>
                        </TooltipContent>
                      </Tooltip>

                      <div className="text-sm font-medium">Investment Portfolio</div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/90 p-4 text-center text-white">90%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>280 customers, 40% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/80 p-4 text-center text-white">85%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>450 customers, 38% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/40 p-4 text-center text-white">55%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>220 customers, 25% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/30 p-4 text-center text-white">40%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>95 customers, 20% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/20 p-4 text-center text-white">30%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>75 customers, 15% conversion</p>
                        </TooltipContent>
                      </Tooltip>

                      <div className="text-sm font-medium">Home Loan Refinance</div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/70 p-4 text-center text-white">75%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>180 customers, 35% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/60 p-4 text-center text-white">70%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>620 customers, 35% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/40 p-4 text-center text-white">58%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>320 customers, 28% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/20 p-4 text-center text-white">35%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>90 customers, 18% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/10 p-4 text-center text-white">25%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>120 customers, 12% conversion</p>
                        </TooltipContent>
                      </Tooltip>

                      <div className="text-sm font-medium">Business Credit Line</div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/40 p-4 text-center text-white">52%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>85 customers, 25% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/30 p-4 text-center text-white">48%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>120 customers, 22% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/20 p-4 text-center text-white">35%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>75 customers, 18% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/90 p-4 text-center text-white">90%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>180 customers, 45% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/30 p-4 text-center text-white">42%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>95 customers, 20% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-6 rounded bg-primary/20"></div>
                  <span className="text-xs">Low</span>
                  <div className="h-3 w-6 rounded bg-primary/40"></div>
                  <div className="h-3 w-6 rounded bg-primary/60"></div>
                  <div className="h-3 w-6 rounded bg-primary/80"></div>
                  <div className="h-3 w-6 rounded bg-primary"></div>
                  <span className="text-xs">High</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segment" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>High Net Worth</CardTitle>
                <CardDescription>320 customers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Premium Credit Card</div>
                    <Badge>92%</Badge>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Investment Portfolio</div>
                    <Badge>90%</Badge>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Home Loan Refinance</div>
                    <Badge>75%</Badge>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View Customers</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mass Affluent</CardTitle>
                <CardDescription>450 customers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Investment Portfolio</div>
                    <Badge>85%</Badge>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Premium Credit Card</div>
                    <Badge>78%</Badge>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Home Loan Refinance</div>
                    <Badge>70%</Badge>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View Customers</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Small Business</CardTitle>
                <CardDescription>180 customers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Business Credit Line</div>
                    <Badge>90%</Badge>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Premium Credit Card</div>
                    <Badge>45%</Badge>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Investment Portfolio</div>
                    <Badge>40%</Badge>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View Customers</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
