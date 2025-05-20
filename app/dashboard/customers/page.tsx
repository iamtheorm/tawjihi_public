"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import AddCustomerModal from "@/components/AddCustomerModal"

interface Customer {
  id: string
  name: string
  email: string
  account: string
  segment: string
  status: string
  recommendation: string
  potential: string
  created_at: string
  updated_at: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [filters, setFilters] = useState({
    search: "",
    segment: "",
    status: "",
    potential: ""
  })

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      if (filters.search) queryParams.append("search", filters.search)
      if (filters.segment) queryParams.append("segment", filters.segment)
      if (filters.status) queryParams.append("status", filters.status)
      if (filters.potential) queryParams.append("potential", filters.potential)

      const response = await fetch(`http://localhost:8000/customers?${queryParams}`)
      if (!response.ok) throw new Error("Failed to fetch customers")
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      toast.error("Failed to fetch customers")
      console.error("Error fetching customers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/customers/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete customer")
      toast.success("Customer deleted successfully")
      fetchCustomers()
    } catch (error) {
      toast.error("Failed to delete customer")
      console.error("Error deleting customer:", error)
    }
  }

  const handleAddCustomer = () => {
    setShowAddModal(true)
  }

  const handleCustomerAdded = () => {
    toast.success("Customer added successfully")
    setShowAddModal(false)
    fetchCustomers()
  }

  useEffect(() => {
    fetchCustomers()
  }, [filters])

  // ... rest of the component code ...

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Button onClick={handleAddCustomer}>Add Customer</Button>
      </div>

      {/* ... rest of the JSX ... */}

      <AddCustomerModal 
        open={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onAdd={handleCustomerAdded}
      />
    </div>
  )
} 