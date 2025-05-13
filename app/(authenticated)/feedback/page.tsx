"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts"
import { Book, BrainCircuit, Check, Clock, Download, RefreshCw, ThumbsDown, ThumbsUp, X, ArrowUp } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data
const feedbackData = [
  { month: "Jan", accepted: 120, declined: 45, ignored: 35 },
  { month: "Feb", accepted: 132, declined: 42, ignored: 30 },
  { month: "Mar", accepted: 145, declined: 38, ignored: 25 },
  { month: "Apr", accepted: 155, declined: 35, ignored: 20 },
  { month: "May", accepted: 165, declined: 32, ignored: 18 },
  { month: "Jun", accepted: 178, declined: 30, ignored: 15 },
  { month: "Jul", accepted: 190, declined: 28, ignored: 12 },
]

const accuracyData = [
  { month: "Jan", accuracy: 78 },
  { month: "Feb", accuracy: 80 },
  { month: "Mar", accuracy: 82 },
  { month: "Apr", accuracy: 85 },
  { month: "May", accuracy: 87 },
  { month: "Jun", accuracy: 88 },
  { month: "Jul", accuracy: 90 },
]

const recentFeedback = [
  {
    id: "1",
    customer: "Emma Thompson",
    product: "Premium Credit Card",
    status: "accepted",
    reason: "Perfect match for customer's travel needs",
    date: "Aug 10, 2023",
    agent: "John Davis",
  },
  {
    id: "2",
    customer: "Michael Chen",
    product: "Investment Portfolio",
    status: "declined",
    reason: "Customer already invested in similar products",
    date: "Aug 9, 2023",
    agent: "Sarah Wilson",
  },
  {
    id: "3",
    customer: "Jennifer Lopez",
    product: "Home Loan Refinance",
    status: "accepted",
    reason: "Significant savings on interest rate",
    date: "Aug 8, 2023",
    agent: "Robert Kim",
  },
  {
    id: "4",
    customer: "David Smith",
    product: "Savings Account",
    status: "ignored",
    reason: "No feedback provided",
    date: "Aug 7, 2023",
    agent: "Lisa Johnson",
  },
  {
    id: "5",
    customer: "Anna Williams",
    product: "Business Credit Line",
    status: "accepted",
    reason: "Perfectly timed for business expansion",
    date: "Aug 6, 2023",
    agent: "Michael Scott",
  },
]

const modelUpdates = [
  {
    id: "1",
    date: "Aug 8, 2023",
    description: "Improved travel detection algorithm by 15%",
    impact: "Better credit card recommendations for frequent travelers",
  },
  {
    id: "2",
    date: "Aug 1, 2023",
    description: "Added new data points for income prediction",
    impact: "More accurate investment portfolio recommendations",
  },
  {
    id: "3",
    date: "Jul 25, 2023",
    description: "Enhanced small business categorization",
    impact: "Better targeting for business-specific products",
  },
  {
    id: "4",
    date: "Jul 18, 2023",
    description: "Integrated housing market data for mortgage recommendations",
    impact: "More timely refinancing suggestions",
  },
  {
    id: "5",
    date: "Jul 10, 2023",
    description: "Seasonal spending pattern recognition improved",
    impact: "Better timing for savings and credit product recommendations",
  },
]

export default function FeedbackPage() {
  return (
    <div className="w-[1400px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">AI Feedback & Learning</h1>
          <p className="page-description">Review recommendation performance and AI learning progress</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Acceptance Rate</p>
              <p className="stat-value">72%</p>
            </div>
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <ThumbsUp className="h-6 w-6" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-success">
            <span>↑ 4% from last month</span>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Model Accuracy</p>
              <p className="stat-value">90%</p>
            </div>
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <BrainCircuit className="h-6 w-6" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-success">
            <span>↑ 2% improvement</span>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Learning Iterations</p>
              <p className="stat-value">42</p>
            </div>
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <RefreshCw className="h-6 w-6" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Last update: 2 days ago</span>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6 mt-6">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="feedback">Recent Feedback</TabsTrigger>
          <TabsTrigger value="model">Model Updates</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recommendation Response Trends</CardTitle>
                <CardDescription>How users respond to AI recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    accepted: {
                      label: "Accepted",
                      color: "hsl(var(--success))",
                    },
                    declined: {
                      label: "Declined",
                      color: "hsl(var(--destructive))",
                    },
                    ignored: {
                      label: "Ignored",
                      color: "hsl(var(--muted-foreground))",
                    },
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={feedbackData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="accepted" stackId="a" fill="var(--color-accepted)" />
                      <Bar dataKey="declined" stackId="a" fill="var(--color-declined)" />
                      <Bar dataKey="ignored" stackId="a" fill="var(--color-ignored)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Model Accuracy Improvement</CardTitle>
                <CardDescription>ML model accuracy over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    accuracy: {
                      label: "Accuracy",
                      color: "hsl(var(--primary))",
                    },
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={accuracyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[70, 100]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="accuracy"
                        stroke="var(--color-accuracy)"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recommendation Performance by Category</CardTitle>
              <CardDescription>Acceptance rates across different product types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-2 border-transparent hover:border-primary/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Credit Cards</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-3xl font-bold">82%</div>
                    <p className="text-xs text-muted-foreground">Acceptance rate</p>
                    <div className="mt-4 flex items-center text-sm text-success">
                      <ArrowUp className="mr-1 h-4 w-4" />
                      <span>5% from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-transparent hover:border-primary/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Investments</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-3xl font-bold">74%</div>
                    <p className="text-xs text-muted-foreground">Acceptance rate</p>
                    <div className="mt-4 flex items-center text-sm text-success">
                      <ArrowUp className="mr-1 h-4 w-4" />
                      <span>3% from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-transparent hover:border-primary/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Loans</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-3xl font-bold">68%</div>
                    <p className="text-xs text-muted-foreground">Acceptance rate</p>
                    <div className="mt-4 flex items-center text-sm text-success">
                      <ArrowUp className="mr-1 h-4 w-4" />
                      <span>2% from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-transparent hover:border-primary/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Savings</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-3xl font-bold">65%</div>
                    <p className="text-xs text-muted-foreground">Acceptance rate</p>
                    <div className="mt-4 flex items-center text-sm text-destructive">
                      <X className="mr-1 h-4 w-4" />
                      <span>1% from last month</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Recommendation Feedback</CardTitle>
              <CardDescription>Recent feedback from sales teams on AI recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentFeedback.map((feedback) => (
                  <div key={feedback.id} className="flex items-start gap-4 border-b pb-6 last:border-0 last:pb-0">
                    <div
                      className={`rounded-full p-2 ${
                        feedback.status === "accepted"
                          ? "bg-success/20 text-success"
                          : feedback.status === "declined"
                            ? "bg-destructive/20 text-destructive"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {feedback.status === "accepted" ? (
                        <ThumbsUp className="h-5 w-5" />
                      ) : feedback.status === "declined" ? (
                        <ThumbsDown className="h-5 w-5" />
                      ) : (
                        <Clock className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{feedback.customer}</div>
                          <div className="text-xs text-muted-foreground">{feedback.product}</div>
                        </div>
                        <Badge
                          variant={
                            feedback.status === "accepted"
                              ? "default"
                              : feedback.status === "declined"
                                ? "destructive"
                                : "outline"
                          }
                        >
                          {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="mt-2 text-sm">{feedback.reason}</div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="mr-2 h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {feedback.agent
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">{feedback.agent}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{feedback.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" size="sm">
                Previous
              </Button>
              <Button variant="ghost" size="sm">
                Next
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="model" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Model Learning Log</CardTitle>
              <CardDescription>Updates and improvements to the recommendation engine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {modelUpdates.map((update) => (
                  <div key={update.id} className="space-y-2 border-b pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-primary/10 p-1.5 text-primary">
                          <BrainCircuit className="h-4 w-4" />
                        </div>
                        <span className="font-medium">Model Update</span>
                      </div>
                      <Badge variant="outline">{update.date}</Badge>
                    </div>
                    <div className="rounded-lg bg-muted p-4">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="font-medium">{update.description}</span>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span className="font-medium">Impact: </span>
                        {update.impact}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Current model version:</span> v2.4.5
              </div>
              <Button variant="outline" size="sm">
                <Book className="mr-2 h-4 w-4" />
                View Full Changelog
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Confidence Threshold Adjustments</CardTitle>
              <CardDescription>Model confidence threshold settings for recommendation display</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium">Premium Products</div>
                  <div className="mt-1 flex items-center justify-between">
                    <div className="text-2xl font-bold">85%</div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium">Investment Products</div>
                  <div className="mt-1 flex items-center justify-between">
                    <div className="text-2xl font-bold">80%</div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium">Loan Products</div>
                  <div className="mt-1 flex items-center justify-between">
                    <div className="text-2xl font-bold">75%</div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium">Basic Products</div>
                  <div className="mt-1 flex items-center justify-between">
                    <div className="text-2xl font-bold">70%</div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-6 rounded-lg border bg-muted/30 p-4">
                <div className="text-sm font-medium">About confidence thresholds</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Confidence thresholds determine when a recommendation is shown to bank employees. Higher thresholds
                  mean fewer but more accurate recommendations, while lower thresholds increase coverage but may include
                  less relevant suggestions.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
