'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import {
  AreaChart,
  Area,
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
  AlertCircle,
  Calendar,
  ChevronRight,
  Flag,
  Home,
  MessageSquare,
  Phone,
  Send,
  ThumbsUp,
  UserCircle,
  Mail,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { baseUrl } from "@/lib/api"

// Sample data for features not yet implemented in backend
const transactionData = [
  { month: "Jan", spending: 3200, saving: 1800 },
  { month: "Feb", spending: 3800, saving: 1600 },
  { month: "Mar", spending: 4200, saving: 1900 },
  { month: "Apr", spending: 3600, saving: 2100 },
  { month: "May", spending: 4500, saving: 2200 },
  { month: "Jun", spending: 5200, saving: 1700 },
  { month: "Jul", spending: 4800, saving: 2400 },
]

const spendingCategories = [
  { name: "Travel", value: 35 },
  { name: "Dining", value: 25 },
  { name: "Retail", value: 20 },
  { name: "Entertainment", value: 15 },
  { name: "Other", value: 5 },
]

const recentInteractions = [
  {
    id: 1,
    type: "call",
    date: "Jul 12, 2023",
    summary: "Discussed retirement planning options and investment portfolio",
    agent: "Mohammed Al-Balushi",
  },
  {
    id: 2,
    type: "email",
    date: "Jun 28, 2023",
    summary: "Sent information about Premium Sharia-Compliant Card benefits",
    agent: "Fatima Al-Zadjali",
  },
  {
    id: 3,
    type: "meeting",
    date: "May 15, 2023",
    summary: "In-branch meeting to review portfolio performance",
    agent: "Khalid Al-Habsi",
  },
]

const COLORS = ["#2fb3b6", "#36b9c8", "#4dc4d8", "#65cfe8", "#7edaf8"]

export default function CustomerProfilePage() {
  const params = useParams();
  const customerId = params.id;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingRecommendations, setGeneratingRecommendations] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${baseUrl}/customer-profile/${customerId}`);
      setProfile(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateNewRecommendations = async () => {
    setGeneratingRecommendations(true);
    try {
      const response = await axios.post(`${baseUrl}/recommendations/generate/${customerId}`);
      if (response.status === 200) {
        // Refresh the profile to get updated recommendations
        await fetchProfile();
        // You could add a toast notification here if you have one
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGeneratingRecommendations(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [customerId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile found</div>;

  const { customer, recommendations } = profile;

  return (
    <div className="container mx-auto px-4 py-6 max-w-full">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customer Profile</h1>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Dashboard</span>
            <ChevronRight className="mx-1 h-4 w-4" />
            <span>Customers</span>
            <ChevronRight className="mx-1 h-4 w-4" />
            <span>{customer.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Contact
          </Button>
          <Button className="bg-banking-500 hover:bg-banking-600">
            <Flag className="mr-2 h-4 w-4" />
            Set Follow-up
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mt-6">
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-2xl bg-banking-100 text-banking-700">
                {customer.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{customer.name}</CardTitle>
              <CardDescription>Customer since {new Date(customer.created_at).toLocaleDateString()}</CardDescription>
              <Badge className="mt-1 bg-banking-500 hover:bg-banking-600">{customer.segment}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Account</div>
                <div className="text-sm font-medium">{customer.account}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Status</div>
                <div className="flex items-center">
                  <div className="mr-1 h-2 w-2 rounded-full bg-success"></div>
                  <span className="text-sm font-medium">{customer.status}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Potential</div>
                <div className="text-sm font-medium">{customer.potential}</div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="text-sm font-medium">Contact Information</div>
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-banking-500" />
                  <span className="text-sm">{customer.email}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="text-sm font-medium">Customer Value Score</div>
              <div className="flex justify-between">
                <div className="text-xs text-muted-foreground">Overall Value</div>
                <div className="text-xs font-medium">87/100</div>
              </div>
              <Progress value={87} className="h-2 bg-banking-100" indicatorClassName="bg-banking-500" />
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Loyalty</div>
                  <Progress value={92} className="h-1.5 bg-banking-100" indicatorClassName="bg-banking-500" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Profitability</div>
                  <Progress value={85} className="h-1.5 bg-banking-100" indicatorClassName="bg-banking-500" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Engagement</div>
                  <Progress value={78} className="h-1.5 bg-banking-100" indicatorClassName="bg-banking-500" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Risk</div>
                  <Progress value={30} className="h-1.5 bg-banking-100" indicatorClassName="bg-banking-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <Tabs defaultValue="transactions" className="h-full">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Customer Insights</CardTitle>
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  <TabsTrigger value="interactions">Interactions</TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>Financial behavior and product recommendations</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <TabsContent value="transactions" className="m-0 space-y-6 p-6">
                <ChartContainer
                  config={{
                    spending: {
                      label: "Spending",
                      color: "#2fb3b6",
                    },
                    saving: {
                      label: "Saving",
                      color: "hsl(var(--success))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={transactionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="spending"
                        stackId="1"
                        stroke="var(--color-spending)"
                        fill="var(--color-spending)"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="saving"
                        stackId="1"
                        stroke="var(--color-saving)"
                        fill="var(--color-saving)"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <div className="mb-4 text-sm font-medium">Spending by Category</div>
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                          <Pie
                            data={spendingCategories}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={70}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {spendingCategories.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div>
                    <div className="mb-4 text-sm font-medium">Transaction Summary</div>
                    <div className="space-y-4 rounded-lg border p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Avg. Transaction</div>
                          <div className="text-lg font-medium">842 OMR</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Monthly Spend</div>
                          <div className="text-lg font-medium">4,580 OMR</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Highest Category</div>
                          <div className="text-lg font-medium">Travel</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Transactions/Month</div>
                          <div className="text-lg font-medium">32</div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Recent Large Transactions</div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Oman Air</span>
                            <span className="font-medium">1,456 OMR</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Grand Hyatt Muscat</span>
                            <span className="font-medium">985 OMR</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Lulu Hypermarket</span>
                            <span className="font-medium">749 OMR</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="recommendations" className="m-0 space-y-6 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">AI-Powered Recommendations</h3>
                    <p className="text-sm text-muted-foreground">
                      Personalized product recommendations based on customer profile and behavior
                    </p>
                  </div>
                  <Button 
                    onClick={generateNewRecommendations}
                    disabled={generatingRecommendations}
                    className="bg-banking-500 hover:bg-banking-600"
                  >
                    {generatingRecommendations ? "Generating..." : "Generate New Recommendations"}
                  </Button>
                </div>
                <div className="space-y-4">
                  {recommendations && recommendations.length > 0 ? recommendations.map((rec: any, index: number) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="flex-1 p-6">
                          <div className="flex items-center justify-between">
                            <div className="font-semibold">{rec.title}</div>
                            <Badge
                              variant={rec.priority === "high" ? "default" : "secondary"}
                              className={rec.priority === "high" ? "bg-banking-500 hover:bg-banking-600" : ""}
                            >
                              {rec.priority} Priority
                            </Badge>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            {rec.description}
                          </div>
                          <div className="mt-4 flex items-center gap-2">
                            <Button size="sm" className="bg-banking-500 hover:bg-banking-600">
                              Push Product
                            </Button>
                            <Button size="sm" variant="outline">
                              <Calendar className="mr-2 h-4 w-4" />
                              Schedule Follow-up
                            </Button>
                          </div>
                        </div>
                        <div className="flex w-full flex-col justify-between border-l bg-muted/30 p-6 md:w-1/3">
                          <div className="space-y-2">                            <div className="text-sm font-medium">AI Confidence Score</div>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={rec.confidence ? rec.confidence * 100 : (rec.priority === "high" ? 90 : 70)}
                                className="h-2 flex-1 bg-banking-100"
                                indicatorClassName="bg-banking-500"
                              />
                              <span className="text-sm font-medium">
                                {rec.confidence ? `${(rec.confidence * 100).toFixed(0)}%` : (rec.priority === "high" ? "90%" : "70%")}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {rec.segment ? `AI Generated • ${rec.segment}` : "Based on customer segment and behavior"}
                            </div>
                          </div>

                          <div className="mt-4 flex items-center gap-4">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <ThumbsUp className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <AlertCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )) : (
                    <div className="text-center py-6 text-sm text-muted-foreground">
                      No recommendations available. Click "Generate New Recommendations" to receive suggestions.
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="interactions" className="m-0 space-y-6 p-6">
                <div className="space-y-6">
                  <div className="rounded-lg border">
                    <div className="flex items-center justify-between border-b p-4">
                      <div className="text-sm font-medium">Recent Interactions</div>
                      <Button size="sm" variant="outline">
                        View All
                      </Button>
                    </div>
                    <div className="divide-y">
                      {recentInteractions.map((interaction) => (
                        <div key={interaction.id} className="flex items-start gap-4 p-4">
                          <div
                            className={`rounded-full p-2 ${
                              interaction.type === "call"
                                ? "bg-banking-100 text-banking-500"
                                : interaction.type === "email"
                                  ? "bg-info/10 text-info"
                                  : "bg-success/10 text-success"
                            }`}
                          >
                            {interaction.type === "call" ? (
                              <Phone className="h-4 w-4" />
                            ) : interaction.type === "email" ? (
                              <Mail className="h-4 w-4" />
                            ) : (
                              <UserCircle className="h-4 w-4" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">
                                {interaction.type === "call"
                                  ? "Phone Call"
                                  : interaction.type === "email"
                                    ? "Email Communication"
                                    : "In-person Meeting"}
                              </div>
                              <div className="text-sm text-muted-foreground">{interaction.date}</div>
                            </div>
                            <div className="mt-1 text-sm">{interaction.summary}</div>
                            <div className="mt-2 text-xs text-muted-foreground">Agent: {interaction.agent}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Add Note</CardTitle>
                      <CardDescription>Record details about your interaction with this customer</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea placeholder="Enter your notes here..." className="min-h-32" />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">Clear</Button>
                      <Button className="bg-banking-500 hover:bg-banking-600">
                        <Send className="mr-2 h-4 w-4" />
                        Save Note
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}