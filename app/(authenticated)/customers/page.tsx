"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useDebounce } from "@/hooks/useDebounce"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import AddCustomerModal from "@/components/AddCustomerModal"
import {
  Download, UserPlus, Trash2, Search, ArrowUpDown,
  CreditCard, MoreHorizontal, Filter, SlidersHorizontal
} from "lucide-react"
import { toast } from "sonner"

const ITEMS_PER_PAGE = 5

export default function CustomersPage() {
  const router = useRouter()
  const [selectedCustomers, setSelectedCustomers] = React.useState<string[]>([])
  const [customers, setCustomers] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [totalCustomers, setTotalCustomers] = React.useState(0)

  const [searchTerm, setSearchTerm] = React.useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const [segmentFilter, setSegmentFilter] = React.useState("all")
  const [regionFilter, setRegionFilter] = React.useState("all")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [potentialFilter, setPotentialFilter] = React.useState("all")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const page = Math.max(1, currentPage)
      const skip = (page - 1) * ITEMS_PER_PAGE
      const limit = ITEMS_PER_PAGE

      let url = `http://localhost:8000/customers/?skip=${skip}&limit=${limit}`
      
      if (debouncedSearchTerm) url += `&search=${encodeURIComponent(debouncedSearchTerm)}`
      if (segmentFilter !== 'all') url += `&segment=${encodeURIComponent(segmentFilter)}`
      if (statusFilter !== 'all') url += `&status=${encodeURIComponent(statusFilter)}`
      if (potentialFilter !== 'all') url += `&potential=${encodeURIComponent(potentialFilter)}`

      const [customersRes, countRes] = await Promise.all([
        fetch(url, {
          headers: {
            'Content-Type': 'application/json'
          },
          cache: 'no-store'
        }),
        fetch("http://localhost:8000/customers/count/", {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      ])
      
      if (!customersRes.ok) {
        const errorData = await customersRes.json()
        throw new Error(errorData.detail || "Failed to fetch customers")
      }
      
      const data = await customersRes.json()
      console.log("Fetched customers:", data)
      setCustomers(data)
      
      if (countRes.ok) {
        const countData = await countRes.json()
        setTotalCustomers(countData.total)
      }
    } catch (err: any) {
      console.error("Error fetching customers:", err)
      setError(err.message || "Unknown error")
      toast.error(err.message || "Failed to fetch customers")
    } finally {
      setLoading(false)
    }
  }

  const fetchRef = React.useRef<(() => Promise<void>) | null>(null)

  React.useEffect(() => {
    if (currentPage < 1) {
      setCurrentPage(1)
      return
    }

    if (fetchRef.current) {
      fetchRef.current = null
    }

    fetchRef.current = fetchCustomers
    fetchRef.current()
  }, [currentPage, debouncedSearchTerm, segmentFilter, statusFilter, potentialFilter])

  const toggleCustomer = (customerId: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    )
  }

  const toggleAllCustomers = () => {
    setSelectedCustomers((prev) =>
      prev.length === paginatedCustomers.length
        ? []
        : paginatedCustomers.map((c) => c.id)
    )
  }

  const getSegmentLabel = (code: string) => {
    const map: Record<string, string> = {
      hnw: "High Net Worth",
      ma: "Mass Affluent",
      retail: "Retail",
      sb: "Small Business",
    }
    return map[code] || code
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSegment =
      segmentFilter === "all" ||
      customer.segment?.toLowerCase() === getSegmentLabel(segmentFilter).toLowerCase()

    const matchesRegion =
      regionFilter === "all" ||
      customer.region?.toLowerCase() === regionFilter.toLowerCase()

    const matchesStatus =
      statusFilter === "all" ||
      customer.status?.toLowerCase() === statusFilter.toLowerCase()

    const matchesPotential =
      potentialFilter === "all" ||
      customer.potential?.toLowerCase() === potentialFilter.toLowerCase()

    return matchesSearch && matchesSegment && matchesRegion && matchesStatus && matchesPotential
  })

  const totalPages = Math.ceil(totalCustomers / ITEMS_PER_PAGE)
  const paginatedCustomers = customers

  console.log("Total customers:", customers.length)
  console.log("Filtered customers:", filteredCustomers.length)
  console.log("Current page:", currentPage)
  console.log("Total pages:", totalPages)
  console.log("Paginated customers:", paginatedCustomers.length)

  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages))
    setCurrentPage(validPage)
  }

  if (loading) return <div>Loading customers...</div>
  if (error) return <div>Error loading customers: {error}</div>

  return (
    <div className="w-[1400px]">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Customer Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            className="bg-banking-500 hover:bg-banking-600"
            onClick={() => setIsAddModalOpen(true)}
          >
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
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search customers..."
                  className="pl-8 sm:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={(e) => e.target.select()}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[220px] space-y-4 p-2">
                  <div>
                    <div className="mb-1 text-xs font-medium">Segment</div>
                    <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                      <SelectTrigger><SelectValue placeholder="All segments" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All segments</SelectItem>
                        <SelectItem value="hnw">High Net Worth</SelectItem>
                        <SelectItem value="ma">Mass Affluent</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="sb">Small Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-medium">Region</div>
                    <Select value={regionFilter} onValueChange={setRegionFilter}>
                      <SelectTrigger><SelectValue placeholder="All regions" /></SelectTrigger>
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
                  <div>
                    <div className="mb-1 text-xs font-medium">Status</div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger><SelectValue placeholder="All statuses" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="dormant">Dormant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-medium">Potential</div>
                    <Select value={potentialFilter} onValueChange={setPotentialFilter}>
                      <SelectTrigger><SelectValue placeholder="All potentials" /></SelectTrigger>
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
                      checked={
                        selectedCustomers.length === paginatedCustomers.length &&
                        paginatedCustomers.length > 0
                      }
                      onCheckedChange={toggleAllCustomers}
                    />
                  </TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Segment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Recommendation</TableHead>
                  <TableHead>Potential</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCustomers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    onClick={() => router.push(`/customers/profile/${customer.id}`)}
                    className="cursor-pointer"
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedCustomers.includes(customer.id)}
                        onCheckedChange={() => toggleCustomer(customer.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {customer.name?.split(" ").map((n: string) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {customer.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{customer.account}</TableCell>
                    <TableCell>{customer.segment}</TableCell>
                    <TableCell>
                      <Badge className={
                        customer.status?.toLowerCase() === "active"
                          ? "bg-banking-500 text-white hover:bg-banking-600"
                          : "bg-muted text-muted-foreground"
                      }>
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-banking-500" />
                        <span>{customer.recommendation}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        customer.potential?.toLowerCase() === "high"
                          ? "bg-banking-500 text-white"
                          : customer.potential?.toLowerCase() === "medium"
                            ?"bg-blue-100 text-blue-800"
                            : "bg-outline text-muted-foreground"
                      }>
                        {customer.potential}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
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
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      <AddCustomerModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={async () => {
          await fetchCustomers()
          setCurrentPage(1) // Reset to first page after adding
          setIsAddModalOpen(false)
        }}
      />
    </div>
  )
}