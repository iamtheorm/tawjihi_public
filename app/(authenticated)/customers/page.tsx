"use client"

import * as React from "react"
import {
  ArrowUpDown,
  CreditCard,
  Download,
  Filter,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  UserPlus,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

// Sample customer data with Omani names
const customers = [
  {
    id: "1",
    name: "Ahmed Al-Farsi",
    email: "ahmed.f@example.com",
    accountNumber: "3845792164",
    segment: "High Net Worth",
    region: "Muscat",
    status: "active",
    lastActivity: "2 hours ago",
    recommendedProduct: "Premium Sharia-Compliant Card",
    potential: "high",
  },
  {
    id: "2",
    name: "Fatima Al-Balushi",
    email: "fatima.b@example.com",
    accountNumber: "9273518462",
    segment: "Mass Affluent",
    region: "Salalah",
    status: "active",
    lastActivity: "5 hours ago",
    recommendedProduct: "Sukuk Investment Portfolio",
    potential: "medium",
  },
  {
    id: "3",
    name: "Khalid Al-Habsi",
    email: "khalid.h@example.com",
    accountNumber: "1629384750",
    segment: "Retail",
    region: "Sohar",
    status: "inactive",
    lastActivity: "3 days ago",
    recommendedProduct: "Savings Account",
    potential: "low",
  },
  {
    id: "4",
    name: "Aisha Al-Zadjali",
    email: "aisha.z@example.com",
    accountNumber: "5647382910",
    segment: "Small Business",
    region: "Nizwa",
    status: "active",
    lastActivity: "1 day ago",
    recommendedProduct: "Business Finance Line",
    potential: "high",
  },
  {
    id: "5",
    name: "Mohammed Al-Kindi",
    email: "mohammed.k@example.com",
    accountNumber: "7891234560",
    segment: "High Net Worth",
    region: "Muscat",
    status: "active",
    lastActivity: "12 hours ago",
    recommendedProduct: "Wealth Management",
    potential: "high",
  },
  {
    id: "6",
    name: "Laila Al-Rawahi",
    email: "laila.r@example.com",
    accountNumber: "4567891230",
    segment: "Mass Affluent",
    region: "Sur",
    status: "dormant",
    lastActivity: "2 weeks ago",
    recommendedProduct: "Retirement Plan",
    potential: "medium",
  },
]

export default function CustomersPage() {
  const router = useRouter()
  const [selectedCustomers, setSelectedCustomers] = React.useState<string[]>([])

  const toggleCustomer = (customerId: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId) ? prev.filter((id) => id !== customerId) : [...prev, customerId],
    )
  }

  const toggleAllCustomers = () => {
    setSelectedCustomers((prev) => (prev.length === customers.length ? [] : customers.map((c) => c.id)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Customer Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-banking-500 hover:bg-banking-600">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Customers</CardTitle>
              <CardDescription>Manage your customer base and view recommendations</CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search customers..." className="pl-8 sm:w-[300px]" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <div className="p-2">
                    <div className="mb-2 text-xs font-medium">Segment</div>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All segments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All segments</SelectItem>
                        <SelectItem value="hnw">High Net Worth</SelectItem>
                        <SelectItem value="ma">Mass Affluent</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="sb">Small Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <div className="mb-2 text-xs font-medium">Region</div>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All regions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All regions</SelectItem>
                        <SelectItem value="muscat">Muscat</SelectItem>
                        <SelectItem value="salalah">Salalah</SelectItem>
                        <SelectItem value="sohar">Sohar</SelectItem>
                        <SelectItem value="nizwa">Nizwa</SelectItem>
                        <SelectItem value="sur">Sur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <div className="mb-2 text-xs font-medium">Status</div>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="dormant">Dormant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <div className="mb-2 text-xs font-medium">Potential</div>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All potentials" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All potentials</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedCustomers.length === customers.length}
                      onCheckedChange={toggleAllCustomers}
                    />
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium">
                      Customer
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Segment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Recommendation</TableHead>
                  <TableHead>Potential</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    onClick={() => router.push("/customers/profile")}
                    className="cursor-pointer"
                  >
                    <TableCell className="w-[50px]" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedCustomers.includes(customer.id)}
                        onCheckedChange={() => toggleCustomer(customer.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">{customer.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{customer.accountNumber}</TableCell>
                    <TableCell>{customer.segment}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          customer.status === "active"
                            ? "default"
                            : customer.status === "inactive"
                              ? "secondary"
                              : "outline"
                        }
                        className={customer.status === "active" ? "bg-banking-500 hover:bg-banking-600" : ""}
                      >
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-banking-500" />
                        <span>{customer.recommendedProduct}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          customer.potential === "high"
                            ? "default"
                            : customer.potential === "medium"
                              ? "secondary"
                              : "outline"
                        }
                        className={customer.potential === "high" ? "bg-banking-500 hover:bg-banking-600" : ""}
                      >
                        {customer.potential.charAt(0).toUpperCase() + customer.potential.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Edit customer</DropdownMenuItem>
                          <DropdownMenuItem>Contact customer</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Add tag</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            Showing <strong>6</strong> of <strong>35</strong> customers
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
    </div>
  )
}
