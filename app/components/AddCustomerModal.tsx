"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface AddCustomerModalProps {
  open: boolean
  onClose: () => void
  onAdd: () => void
}

export default function AddCustomerModal({ open, onClose, onAdd }: AddCustomerModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    account: "",
    segment: "",
    status: "",
    recommendation: "",
    potential: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:8000/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to add customer")
      }
      toast.success("Customer added successfully")
      onAdd()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add customer")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="account">Account</Label>
            <Input
              id="account"
              value={formData.account}
              onChange={(e) => setFormData({ ...formData, account: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="segment">Segment</Label>
            <Select value={formData.segment} onValueChange={(value) => setFormData({ ...formData, segment: value })}>
              <SelectTrigger><SelectValue placeholder="Select segment" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="High Net Worth">High Net Worth</SelectItem>
                <SelectItem value="Mass Affluent">Mass Affluent</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="Small Business">Small Business</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="dormant">Dormant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="potential">Potential</Label>
            <Select value={formData.potential} onValueChange={(value) => setFormData({ ...formData, potential: value })}>
              <SelectTrigger><SelectValue placeholder="Select potential" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Add Customer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 