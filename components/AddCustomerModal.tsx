import React, { useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

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
  const [error, setError] = useState("")

  const handleAdd = async () => {
    try {
      const res = await fetch("http://localhost:8000/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          account,
          segment,
          status,
          recommendation,
          potential,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.detail || "Failed to add customer")
      }

      onAdd()
      onClose()
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Something went wrong")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Customer</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label>Account</Label>
            <Input value={account} onChange={(e) => setAccount(e.target.value)} />
          </div>
          <div>
            <Label>Segment</Label>
            <Input value={segment} onChange={(e) => setSegment(e.target.value)} />
          </div>
          <div>
            <Label>Status</Label>
            <Input value={status} onChange={(e) => setStatus(e.target.value)} />
          </div>
          <div>
            <Label>Recommendation</Label>
            <Input value={recommendation} onChange={(e) => setRecommendation(e.target.value)} />
          </div>
          <div>
            <Label>Potential</Label>
            <Input value={potential} onChange={(e) => setPotential(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleAdd}>Add</Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
