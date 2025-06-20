import React, { useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { baseUrl } from "@/lib/api"

interface AddCustomerModalProps {
  open: boolean
  onClose: () => void
  onAdd: () => void
}

export default function AddCustomerModal({ open, onClose, onAdd }: AddCustomerModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [account, setAccount] = useState("")
  const [segment, setSegment] = useState("")
  const [status, setStatus] = useState("")
  const [recommendation, setRecommendation] = useState("")
  const [potential, setPotential] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Name is required")
      return false
    }
    if (!email.trim()) {
      toast.error("Email is required")
      return false
    }
    if (!account.trim()) {
      toast.error("Account is required")
      return false
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address")
      return false
    }
    return true
  }

  const handleAdd = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const customerData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        account: account.trim(),
        segment: segment.trim(),
        status: status.trim(),
        recommendation: recommendation.trim(),
        potential: potential.trim(),
      }

      console.log("Sending customer data:", customerData) // Debug log

      const res = await fetch(`${baseUrl}/customers/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      })

      const data = await res.json()
      console.log("Response from server:", data) // Debug log

      if (!res.ok) {
        throw new Error(data.detail || "Failed to add customer")
      }

      toast.success("Customer added successfully")
      onAdd()
      onClose()
      // Reset form
      setName("")
      setEmail("")
      setAccount("")
      setSegment("")
      setStatus("")
      setRecommendation("")
      setPotential("")
    } catch (err: any) {
      console.error("Error adding customer:", err)
      toast.error(err.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Customer</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <Label>Name *</Label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter customer name"
              required
            />
          </div>
          <div>
            <Label>Email *</Label>
            <Input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter customer email"
              required
            />
          </div>
          <div>
            <Label>Account *</Label>
            <Input 
              value={account} 
              onChange={(e) => setAccount(e.target.value)}
              placeholder="Enter account number"
              required
            />
          </div>
          <div>
            <Label>Segment</Label>
            <Input 
              value={segment} 
              onChange={(e) => setSegment(e.target.value)}
              placeholder="Enter customer segment"
            />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">active</SelectItem>
                <SelectItem value="dormant">dormant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Recommendation</Label>
            <Select value={recommendation} onValueChange={setRecommendation}>
              <SelectTrigger>
                <SelectValue placeholder="Select recommendation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Potential</Label>
            <Select value={potential} onValueChange={setPotential}>
              <SelectTrigger>
                <SelectValue placeholder="Select potential" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleAdd} disabled={isLoading}>
            {isLoading ? "Adding..." : "Add"}
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}