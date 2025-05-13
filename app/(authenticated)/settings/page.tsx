"use client";

import {
  AlertCircle,
  Bell,
  BellOff,
  FileText,
  Key,
  Lock,
  Save,
  SlidersHorizontal,
  UserCog,
  UserPlus,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Sample users data
const users = [
  {
    id: "1",
    name: "Ahmed Al-Balushi",
    email: "ahmed.b@example.com",
    role: "Admin",
    department: "Management",
    lastActive: "2 hours ago",
    status: "active",
  },
  {
    id: "2",
    name: "Fatima Al-Harrasi",
    email: "fatima.h@example.com",
    role: "Manager",
    department: "Sales",
    lastActive: "1 day ago",
    status: "active",
  },
  {
    id: "3",
    name: "Yusuf Al-Hashmi",
    email: "yusuf.h@example.com",
    role: "Advisor",
    department: "Customer Service",
    lastActive: "3 hours ago",
    status: "active",
  },
  {
    id: "4",
    name: "Zainab Al-Jabri",
    email: "zainab.j@example.com",
    role: "Analyst",
    department: "Data Science",
    lastActive: "5 days ago",
    status: "inactive",
  },
  {
    id: "5",
    name: "Khalid Al-Mamari",
    email: "khalid.m@example.com",
    role: "Manager",
    department: "Marketing",
    lastActive: "1 hour ago",
    status: "active",
  },
];

// Sample activity logs
const activityLogs = [
  {
    id: "1",
    user: "Ahmed Al-Balushi",
    action: "Updated system parameters",
    timestamp: "Aug 10, 2023 - 14:32",
    details: "Changed refresh cycle from 24h to 12h",
  },
  {
    id: "2",
    user: "Fatima Al-Harrasi",
    action: "Added new user",
    timestamp: "Aug 9, 2023 - 11:15",
    details: "Added Khalid Al-Mamari (Manager)",
  },
  {
    id: "3",
    user: "System",
    action: "Model updated",
    timestamp: "Aug 8, 2023 - 03:45",
    details: "Automatic model update v2.4.5",
  },
  {
    id: "4",
    user: "Yusuf Al-Hashmi",
    action: "Changed threshold",
    timestamp: "Aug 7, 2023 - 16:20",
    details: "Modified confidence threshold for Credit Cards",
  },
  {
    id: "5",
    user: "System",
    action: "Backup completed",
    timestamp: "Aug 6, 2023 - 01:12",
    details: "Weekly system backup",
  },
];

export default function SettingsPage() {
  return (
    <div className="w-[1400px]">
      <div>
        <h1 className="page-title">Admin Settings</h1>
        <p className="page-description">
          Manage roles, system parameters, and view activity logs
        </p>
      </div>
      
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="system">System Parameters</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Setup</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage user roles and access permissions
                  </CardDescription>
                </div>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "default" : "secondary"}>
                            {user.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.lastActive}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button size="icon" variant="ghost">
                                    <UserCog className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit User</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button size="icon" variant="ghost">
                                    <Key className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Reset Password</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button size="icon" variant="ghost">
                                    {user.status === "active" ? 
                                      <BellOff className="h-4 w-4" /> : 
                                      <Bell className="h-4 w-4" />
                                    }
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{user.status === "active" ? "Deactivate User" : "Activate User"}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Role Permissions</CardTitle>
                <CardDescription>
                  Configure access levels for different roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="mb-4 font-medium">Admin</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="admin-users">User Management</Label>
                        <Switch id="admin-users" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="admin-system">System Configuration</Label>
                        <Switch id="admin-system" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="admin-data">Data Export</Label>
                        <Switch id="admin-data" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="admin-model">Model Tuning</Label>
                        <Switch id="admin-model" defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <div className="mb-4 font-medium">Manager</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="manager-users">User Management</Label>
                        <Switch id="manager-users" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="manager-system">System Configuration</Label>
                        <Switch id="manager-system" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="manager-data">Data Export</Label>
                        <Switch id="manager-data" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="manager-model">Model Tuning</Label>
                        <Switch id="manager-model" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <div className="mb-4 font-medium">Advisor</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="advisor-users">User Management</Label>
                        <Switch id="advisor-users" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="advisor-system">System Configuration</Label>
                        <Switch id="advisor-system" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="advisor-data">Data Export</Label>
                        <Switch id="advisor-data" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="advisor-model">Model Tuning</Label>
                        <Switch id="advisor-model" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Save Role Permissions</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure system-wide security parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password-policy">Password Policy</Label>
                  <Select defaultValue="complex">
                    <SelectTrigger id="password-policy">
                      <SelectValue placeholder="Select policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                      <SelectItem value="standard">Standard (8+ chars, mixed case)</SelectItem>
                      <SelectItem value="complex">Complex (12+ chars, mixed case, numbers, symbols)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mfa-setting">Multi-Factor Authentication</Label>
                  <Select defaultValue="optional">
                    <SelectTrigger id="mfa-setting">
                      <SelectValue placeholder="Select MFA setting" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="disabled">Disabled</SelectItem>
                      <SelectItem value="optional">Optional</SelectItem>
                      <SelectItem value="required">Required</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout</Label>
                  <Select defaultValue="30">
                    <SelectTrigger id="session-timeout">
                      <SelectValue placeholder="Select timeout period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-attempts">Maximum Login Attempts</Label>
                  <Select defaultValue="5">
                    <SelectTrigger id="login-attempts">
                      <SelectValue placeholder="Select maximum attempts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 attempts</SelectItem>
                      <SelectItem value="5">5 attempts</SelectItem>
                      <SelectItem value="10">10 attempts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="font-medium">Audit Logging</div>
                    <div className="text-sm text-muted-foreground">
                      Log all admin activities for compliance
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Lock className="mr-2 h-4 w-4" />
                  Update Security Settings
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>System Parameters</CardTitle>
                <CardDescription>
                  Configure core system behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="data-refresh">Data Refresh Cycle</Label>
                  <Select defaultValue="12">
                    <SelectTrigger id="data-refresh">
                      <SelectValue placeholder="Select refresh cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      
                      <SelectItem value="12">Every 12 hours</SelectItem>
                      
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    How often the system pulls new customer data
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model-retrain">Model Retraining Frequency</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger id="model-retrain">
                      <SelectValue placeholder="Select retraining frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    How often the AI model is retrained with new data
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backup-schedule">Backup Schedule</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger id="backup-schedule">
                      <SelectValue placeholder="Select backup schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    How often system data is backed up
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="data-retention">Data Retention Period</Label>
                  <Select defaultValue="12">
                    <SelectTrigger id="data-retention">
                      <SelectValue placeholder="Select retention period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">12 months</SelectItem>
                      <SelectItem value="24">24 months</SelectItem>
                      <SelectItem value="36">36 months</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    How long historical data is kept in the system
                  </p>
                </div>
                
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="font-medium">Automatic Updates</div>
                    <div className="text-sm text-muted-foreground">
                      Allow system to update automatically
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save System Parameters
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>AI Model Configuration</CardTitle>
                <CardDescription>
                  Configure AI recommendation engine parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="confidence-threshold">Default Confidence Threshold</Label>
                  <Select defaultValue="75">
                    <SelectTrigger id="confidence-threshold">
                      <SelectValue placeholder="Select threshold" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="65">65%</SelectItem>
                      <SelectItem value="70">70%</SelectItem>
                      <SelectItem value="75">75%</SelectItem>
                      <SelectItem value="80">80%</SelectItem>
                      <SelectItem value="85">85%</SelectItem>
                      <SelectItem value="90">90%</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Minimum confidence level for recommendations to be shown
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max-recommendations">Maximum Recommendations Per Customer</Label>
                  <Select defaultValue="5">
                    <SelectTrigger id="max-recommendations">
                      <SelectValue placeholder="Select maximum" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 recommendations</SelectItem>
                      <SelectItem value="5">5 recommendations</SelectItem>
                      <SelectItem value="7">7 recommendations</SelectItem>
                      <SelectItem value="10">10 recommendations</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Maximum number of recommendations shown per customer
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="recommendation-cooldown">Recommendation Cooldown</Label>
                  <Select defaultValue="30">
                    <SelectTrigger id="recommendation-cooldown">
                      <SelectValue placeholder="Select cooldown period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Days before a declined recommendation can be shown again
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="feature-importance">Feature Importance Weighting</Label>
                  <Select defaultValue="balanced">
                    <SelectTrigger id="feature-importance">
                      <SelectValue placeholder="Select weighting" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transaction">Transaction-focused</SelectItem>
                      <SelectItem value="demographic">Demographic-focused</SelectItem>
                      <SelectItem value="behavioral">Behavioral-focused</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Which data features have more weight in the model
                  </p>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Reset Model to Default
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will reset all AI model parameters to their default values. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Reset Model</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Update Model Configuration
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Campaign Settings</CardTitle>
                  <CardDescription>
                    Configure automated marketing campaign parameters
                  </CardDescription>
                </div>
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  New Campaign
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="font-medium">Al Jawhar Credit Card Campaign</div>
                  <Badge>Active</Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="campaign1-segment">Target Segment</Label>
                    <Select defaultValue="hnw">
                      <SelectTrigger id="campaign1-segment">
                        <SelectValue placeholder="Select segment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hnw">High Net Worth</SelectItem>
                        <SelectItem value="ma">Mass Affluent</SelectItem>
                        <SelectItem value="yp">Young Professionals</SelectItem>
                        <SelectItem value="all">All Segments</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="campaign1-channel">Channel</Label>
                    <Select defaultValue="email">
                      <SelectTrigger id="campaign1-channel">
                        <SelectValue placeholder="Select channel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="app">Mobile App</SelectItem>
                        <SelectItem value="multi">Multi-channel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="campaign1-frequency">Frequency</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger id="campaign1-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">Pause</Button>
                  <Button size="sm">View Results</Button>
                </div>
              </div>
              
              <div className="rounded-lg border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="font-medium">Mutual Funds Promotion</div>
                  <Badge variant="outline">Scheduled</Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="campaign2-segment">Target Segment</Label>
                    <Select defaultValue="ma">
                      <SelectTrigger id="campaign2-segment">
                        <SelectValue placeholder="Select segment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hnw">High Net Worth</SelectItem>
                        <SelectItem value="ma">Mass Affluent</SelectItem>
                        <SelectItem value="yp">Young Professionals</SelectItem>
                        <SelectItem value="all">All Segments</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="campaign2-channel">Channel</Label>
                    <Select defaultValue="multi">
                      <SelectTrigger id="campaign2-channel">
                        <SelectValue placeholder="Select channel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="app">Mobile App</SelectItem>
                        <SelectItem value="multi">Multi-channel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="campaign2-frequency">Frequency</Label>
                    <Select defaultValue="biweekly">
                      <SelectTrigger id="campaign2-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">Cancel</Button>
                  <Button size="sm">Activate Now</Button>
                </div>
              </div>
              
              <div className="rounded-lg border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="font-medium">Family Protection Insurance</div>
                  <Badge variant="secondary">Draft</Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="campaign3-segment">Target Segment</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="campaign3-segment">
                        <SelectValue placeholder="Select segment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hnw">High Net Worth</SelectItem>
                        <SelectItem value="ma">Mass Affluent</SelectItem>
                        <SelectItem value="yp">Young Professionals</SelectItem>
                        <SelectItem value="all">All Segments</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="campaign3-channel">Channel</Label>
                    <Select defaultValue="email">
                      <SelectTrigger id="campaign3-channel">
                        <SelectValue placeholder="Select channel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="app">Mobile App</SelectItem>
                        <SelectItem value="multi">Multi-channel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="campaign3-frequency">Frequency</Label>
                    <Select defaultValue="monthly">
                      <SelectTrigger id="campaign3-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">Delete</Button>
                  <Button size="sm">Schedule</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Activity Logs</CardTitle>
                  <CardDescription>
                    System and user activity history
                  </CardDescription>
                </div>
                <Button variant="outline">
                  Export Logs
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="font-medium">{log.user}</div>
                        </TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell>{log.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
