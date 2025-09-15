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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { baseUrl } from "@/lib/api"

interface AddCustomerModalProps {
  open: boolean
  onClose: () => void
  onAdd: () => void
}

interface CustomerFormData {
  // Basic Information
  name: string
  email: string
  account: string
  segment: string
  status: string
  recommendation: string
  potential: string
  
  // Personal Details
  age: string
  gender: string
  marital_status_csv: string
  number_of_children: string
  nationality: string
  religion: string
  education_level: string
  
  // Financial Information
  income_omr: string
  employment_type: string
  occupation_sector: string
  credit_score: string
  debt_to_income: string
  account_type: string
  account_tenure_months: string
  
  // Assets & Property
  property_value_omr: string
  vehicle_value_omr: string
  vehicle_owner: string
  drivers_license: string
  residence_status: string
  
  // Banking & Financial Behavior
  credit_utilization_pct: string
  monthly_groceries_spend: string
  business_account_owner: string
  already_has_products: string
  do_not_need_products: string
  recent_transactions: string
  
  // Lifestyle & Preferences
  international_travel_frequency: string
  avg_days_abroad_per_year: string
  digital_engagement_score: string
  digital_channel_preference: string
  health_score: string
  risk_tolerance: string
  
  // Insurance & Benefits
  student_status: string
  employer_insurance: string
}

export default function AddCustomerModal({ open, onClose, onAdd }: AddCustomerModalProps) {
  const [formData, setFormData] = useState<CustomerFormData>({
    // Basic Information
    name: "",
    email: "",
    account: "",
    segment: "",
    status: "",
    recommendation: "",
    potential: "",
    
    // Personal Details
    age: "",
    gender: "",
    marital_status_csv: "",
    number_of_children: "",
    nationality: "",
    religion: "",
    education_level: "",
    
    // Financial Information
    income_omr: "",
    employment_type: "",
    occupation_sector: "",
    credit_score: "",
    debt_to_income: "",
    account_type: "",
    account_tenure_months: "",
    
    // Assets & Property
    property_value_omr: "",
    vehicle_value_omr: "",
    vehicle_owner: "",
    drivers_license: "",
    residence_status: "",
    
    // Banking & Financial Behavior
    credit_utilization_pct: "",
    monthly_groceries_spend: "",
    business_account_owner: "",
    already_has_products: "",
    do_not_need_products: "",
    recent_transactions: "",
    
    // Lifestyle & Preferences
    international_travel_frequency: "",
    avg_days_abroad_per_year: "",
    digital_engagement_score: "",
    digital_channel_preference: "",
    health_score: "",
    risk_tolerance: "",
    
    // Insurance & Benefits
    student_status: "",
    employer_insurance: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const updateFormField = (field: keyof CustomerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required")
      return false
    }
    if (!formData.email.trim()) {
      toast.error("Email is required")
      return false
    }
    if (!formData.account.trim()) {
      toast.error("Account is required")
      return false
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address")
      return false
    }
    
    // Validate numeric fields
    const numericFields = ['age', 'income_omr', 'credit_score', 'number_of_children', 'account_tenure_months', 'property_value_omr', 'vehicle_value_omr', 'monthly_groceries_spend', 'international_travel_frequency', 'avg_days_abroad_per_year', 'digital_engagement_score', 'health_score', 'already_has_products', 'do_not_need_products', 'recent_transactions']
    
    for (const field of numericFields) {
      const value = formData[field as keyof CustomerFormData]
      if (value && isNaN(Number(value))) {
        toast.error(`${field.replace(/_/g, ' ')} must be a number`)
        return false
      }
    }
    
    // Validate percentage fields
    const percentageFields = ['debt_to_income', 'credit_utilization_pct']
    for (const field of percentageFields) {
      const value = formData[field as keyof CustomerFormData]
      if (value && (isNaN(Number(value)) || Number(value) < 0 || Number(value) > 100)) {
        toast.error(`${field.replace(/_/g, ' ')} must be a percentage between 0 and 100`)
        return false
      }
    }
    
    return true
  }

  const resetForm = () => {
    setFormData({
      // Basic Information
      name: "",
      email: "",
      account: "",
      segment: "",
      status: "",
      recommendation: "",
      potential: "",
      
      // Personal Details
      age: "",
      gender: "",
      marital_status_csv: "",
      number_of_children: "",
      nationality: "",
      religion: "",
      education_level: "",
      
      // Financial Information
      income_omr: "",
      employment_type: "",
      occupation_sector: "",
      credit_score: "",
      debt_to_income: "",
      account_type: "",
      account_tenure_months: "",
      
      // Assets & Property
      property_value_omr: "",
      vehicle_value_omr: "",
      vehicle_owner: "",
      drivers_license: "",
      residence_status: "",
      
      // Banking & Financial Behavior
      credit_utilization_pct: "",
      monthly_groceries_spend: "",
      business_account_owner: "",
      already_has_products: "",
      do_not_need_products: "",
      recent_transactions: "",
      
      // Lifestyle & Preferences
      international_travel_frequency: "",
      avg_days_abroad_per_year: "",
      digital_engagement_score: "",
      digital_channel_preference: "",
      health_score: "",
      risk_tolerance: "",
      
      // Insurance & Benefits
      student_status: "",
      employer_insurance: "",
    })
  }

  const handleAdd = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      // Prepare customer data, converting string values to appropriate types
      const customerData: any = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        account: formData.account.trim(),
      }

      // Add optional string fields
      const stringFields = ['segment', 'status', 'recommendation', 'potential', 'employment_type', 'marital_status_csv', 'nationality', 'religion', 'education_level', 'occupation_sector', 'account_type', 'vehicle_owner', 'drivers_license', 'residence_status', 'business_account_owner', 'digital_channel_preference', 'risk_tolerance', 'student_status', 'employer_insurance', 'gender']
      
      stringFields.forEach(field => {
        const value = formData[field as keyof CustomerFormData]
        if (value && value.trim()) {
          customerData[field] = value.trim()
        }
      })

      // Add optional numeric fields
      const numericFields = ['age', 'income_omr', 'credit_score', 'number_of_children', 'account_tenure_months', 'property_value_omr', 'vehicle_value_omr', 'debt_to_income', 'credit_utilization_pct', 'monthly_groceries_spend', 'international_travel_frequency', 'avg_days_abroad_per_year', 'digital_engagement_score', 'health_score', 'already_has_products', 'do_not_need_products', 'recent_transactions']
      
      numericFields.forEach(field => {
        const value = formData[field as keyof CustomerFormData]
        if (value && value.trim()) {
          customerData[field] = Number(value)
        }
      })

      const res = await fetch(`${baseUrl}/customers/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || "Failed to add customer")
      }

      toast.success("Customer added successfully")
      onAdd()
      onClose()
      resetForm()
    } catch (err: any) {
      console.error("Error adding customer:", err)
      toast.error(err.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[60vh] w-full">
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input 
                    id="name"
                    value={formData.name} 
                    onChange={(e) => updateFormField('name', e.target.value)}
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email"
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => updateFormField('email', e.target.value)}
                    placeholder="Enter customer email"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="account">Account *</Label>
                  <Input 
                    id="account"
                    value={formData.account} 
                    onChange={(e) => updateFormField('account', e.target.value)}
                    placeholder="Enter account number"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="segment">Segment</Label>
                  <Input 
                    id="segment"
                    value={formData.segment} 
                    onChange={(e) => updateFormField('segment', e.target.value)}
                    placeholder="Enter customer segment"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => updateFormField('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="dormant">Dormant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="recommendation">Recommendation</Label>
                  <Select value={formData.recommendation} onValueChange={(value) => updateFormField('recommendation', value)}>
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
                  <Label htmlFor="potential">Potential</Label>
                  <Select value={formData.potential} onValueChange={(value) => updateFormField('potential', value)}>
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
            </TabsContent>

            <TabsContent value="personal" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age"
                    type="number"
                    value={formData.age} 
                    onChange={(e) => updateFormField('age', e.target.value)}
                    placeholder="Enter age"
                    min="18"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => updateFormField('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="marital_status_csv">Marital Status</Label>
                  <Select value={formData.marital_status_csv} onValueChange={(value) => updateFormField('marital_status_csv', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="number_of_children">Number of Children</Label>
                  <Input 
                    id="number_of_children"
                    type="number"
                    value={formData.number_of_children} 
                    onChange={(e) => updateFormField('number_of_children', e.target.value)}
                    placeholder="Enter number of children"
                    min="0"
                    max="20"
                  />
                </div>
                <div>
                  <Label htmlFor="nationality">Nationality</Label>
                  <Select value={formData.nationality} onValueChange={(value) => updateFormField('nationality', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BD">Bangladesh</SelectItem>
                      <SelectItem value="EG">Egypt</SelectItem>
                      <SelectItem value="IN">India</SelectItem>
                      <SelectItem value="OM">Oman</SelectItem>
                      <SelectItem value="PH">Philippines</SelectItem>
                      <SelectItem value="PK">Pakistan</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="religion">Religion</Label>
                  <Select value={formData.religion} onValueChange={(value) => updateFormField('religion', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select religion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Muslim">Muslim</SelectItem>
                      <SelectItem value="Christian">Christian</SelectItem>
                      <SelectItem value="Hindu">Hindu</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="education_level">Education Level</Label>
                  <Select value={formData.education_level} onValueChange={(value) => updateFormField('education_level', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High School">High School</SelectItem>
                      <SelectItem value="Associate">Associate</SelectItem>
                      <SelectItem value="Bachelor">Bachelor</SelectItem>
                      <SelectItem value="Master">Master</SelectItem>
                      <SelectItem value="Doctorate">Doctorate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="student_status">Student Status</Label>
                  <Select value={formData.student_status} onValueChange={(value) => updateFormField('student_status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select student status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="financial" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="income_omr">Income (OMR)</Label>
                  <Input 
                    id="income_omr"
                    type="number"
                    value={formData.income_omr} 
                    onChange={(e) => updateFormField('income_omr', e.target.value)}
                    placeholder="Enter monthly income"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="employment_type">Employment Type</Label>
                  <Select value={formData.employment_type} onValueChange={(value) => updateFormField('employment_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Salaried">Salaried</SelectItem>
                      <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                      <SelectItem value="Student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="occupation_sector">Occupation Sector</Label>
                  <Select value={formData.occupation_sector} onValueChange={(value) => updateFormField('occupation_sector', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select occupation sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Government">Government</SelectItem>
                      <SelectItem value="Private">Private</SelectItem>
                      <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                      <SelectItem value="Student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="credit_score">Credit Score</Label>
                  <Input 
                    id="credit_score"
                    type="number"
                    value={formData.credit_score} 
                    onChange={(e) => updateFormField('credit_score', e.target.value)}
                    placeholder="Enter credit score"
                    min="300"
                    max="850"
                  />
                </div>
                <div>
                  <Label htmlFor="debt_to_income">Debt to Income (%)</Label>
                  <Input 
                    id="debt_to_income"
                    type="number"
                    value={formData.debt_to_income} 
                    onChange={(e) => updateFormField('debt_to_income', e.target.value)}
                    placeholder="Enter debt to income ratio"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="account_type">Account Type</Label>
                  <Select value={formData.account_type} onValueChange={(value) => updateFormField('account_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Savings">Savings</SelectItem>
                      <SelectItem value="Salary">Salary</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Joint">Joint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="account_tenure_months">Account Tenure (Months)</Label>
                  <Input 
                    id="account_tenure_months"
                    type="number"
                    value={formData.account_tenure_months} 
                    onChange={(e) => updateFormField('account_tenure_months', e.target.value)}
                    placeholder="Enter account tenure"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="credit_utilization_pct">Credit Utilization (%)</Label>
                  <Input 
                    id="credit_utilization_pct"
                    type="number"
                    value={formData.credit_utilization_pct} 
                    onChange={(e) => updateFormField('credit_utilization_pct', e.target.value)}
                    placeholder="Enter credit utilization"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="business_account_owner">Business Account Owner</Label>
                  <Select value={formData.business_account_owner} onValueChange={(value) => updateFormField('business_account_owner', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business account status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="employer_insurance">Employer Insurance</Label>
                  <Select value={formData.employer_insurance} onValueChange={(value) => updateFormField('employer_insurance', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select insurance status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="assets" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="property_value_omr">Property Value (OMR)</Label>
                  <Input 
                    id="property_value_omr"
                    type="number"
                    value={formData.property_value_omr} 
                    onChange={(e) => updateFormField('property_value_omr', e.target.value)}
                    placeholder="Enter property value"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicle_value_omr">Vehicle Value (OMR)</Label>
                  <Input 
                    id="vehicle_value_omr"
                    type="number"
                    value={formData.vehicle_value_omr} 
                    onChange={(e) => updateFormField('vehicle_value_omr', e.target.value)}
                    placeholder="Enter vehicle value"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicle_owner">Vehicle Owner</Label>
                  <Select value={formData.vehicle_owner} onValueChange={(value) => updateFormField('vehicle_owner', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle ownership" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="drivers_license">Driver's License</Label>
                  <Select value={formData.drivers_license} onValueChange={(value) => updateFormField('drivers_license', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select license status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="residence_status">Residence Status</Label>
                  <Select value={formData.residence_status} onValueChange={(value) => updateFormField('residence_status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select residence status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Owned">Owned</SelectItem>
                      <SelectItem value="Rented">Rented</SelectItem>
                      <SelectItem value="Family">Family</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="monthly_groceries_spend">Monthly Groceries Spend (OMR)</Label>
                  <Input 
                    id="monthly_groceries_spend"
                    type="number"
                    value={formData.monthly_groceries_spend} 
                    onChange={(e) => updateFormField('monthly_groceries_spend', e.target.value)}
                    placeholder="Enter monthly groceries spend"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="already_has_products">Already Has Products</Label>
                  <Input 
                    id="already_has_products"
                    type="number"
                    value={formData.already_has_products} 
                    onChange={(e) => updateFormField('already_has_products', e.target.value)}
                    placeholder="Number of existing products"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="do_not_need_products">Do Not Need Products</Label>
                  <Input 
                    id="do_not_need_products"
                    type="number"
                    value={formData.do_not_need_products} 
                    onChange={(e) => updateFormField('do_not_need_products', e.target.value)}
                    placeholder="Products not needed"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="recent_transactions">Recent Transactions</Label>
                  <Input 
                    id="recent_transactions"
                    type="number"
                    value={formData.recent_transactions} 
                    onChange={(e) => updateFormField('recent_transactions', e.target.value)}
                    placeholder="Number of recent transactions"
                    min="0"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="international_travel_frequency">International Travel Frequency</Label>
                  <Input 
                    id="international_travel_frequency"
                    type="number"
                    value={formData.international_travel_frequency} 
                    onChange={(e) => updateFormField('international_travel_frequency', e.target.value)}
                    placeholder="Trips per year"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="avg_days_abroad_per_year">Avg Days Abroad Per Year</Label>
                  <Input 
                    id="avg_days_abroad_per_year"
                    type="number"
                    value={formData.avg_days_abroad_per_year} 
                    onChange={(e) => updateFormField('avg_days_abroad_per_year', e.target.value)}
                    placeholder="Days abroad per year"
                    min="0"
                    max="365"
                  />
                </div>
                <div>
                  <Label htmlFor="digital_engagement_score">Digital Engagement Score</Label>
                  <Input 
                    id="digital_engagement_score"
                    type="number"
                    value={formData.digital_engagement_score} 
                    onChange={(e) => updateFormField('digital_engagement_score', e.target.value)}
                    placeholder="Digital engagement score"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="digital_channel_preference">Digital Channel Preference</Label>
                  <Select value={formData.digital_channel_preference} onValueChange={(value) => updateFormField('digital_channel_preference', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select channel preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mobile">Mobile</SelectItem>
                      <SelectItem value="Web">Web</SelectItem>
                      <SelectItem value="Branch">Branch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="health_score">Health Score</Label>
                  <Input 
                    id="health_score"
                    type="number"
                    value={formData.health_score} 
                    onChange={(e) => updateFormField('health_score', e.target.value)}
                    placeholder="Health score"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="risk_tolerance">Risk Tolerance</Label>
                  <Select value={formData.risk_tolerance} onValueChange={(value) => updateFormField('risk_tolerance', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk tolerance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter>
          <Button onClick={handleAdd} disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Customer"}
          </Button>
          <DialogClose asChild>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}