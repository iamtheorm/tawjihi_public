import React, { useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { baseUrl } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"

interface CSVUploadModalProps {
  open: boolean
  onClose: () => void
  onUpload: () => void
}

interface UploadResult {
  message: string
  total_rows: number
  successful_imports: number
  failed_imports: number
  errors: Array<{
    row: number
    email?: string
    error: string
  }>
}

export default function CSVUploadModal({ open, onClose, onUpload }: CSVUploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [showResults, setShowResults] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        toast.error("Please select a CSV file")
        return
      }
      setFile(selectedFile)
      setUploadResult(null)
      setShowResults(false)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a CSV file")
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${baseUrl}/customers/upload-csv`, {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.detail || "Failed to upload CSV")
      }

      setUploadResult(result)
      setShowResults(true)
      
      if (result.successful_imports > 0) {
        toast.success(`Successfully imported ${result.successful_imports} customers`)
        onUpload() // Refresh the customer list
      }
      
      if (result.failed_imports > 0) {
        toast.warning(`${result.failed_imports} rows failed to import`)
      }

    } catch (error: any) {
      console.error("Error uploading CSV:", error)
      toast.error(error.message || "Failed to upload CSV file")
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setUploadResult(null)
    setShowResults(false)
    onClose()
  }

  const downloadTemplate = () => {
    const csvContent = `Name,email,Age,Income_OMR,Employment_Type,Credit_Score,Account_Tenure_Months,Marital_Status,Number_of_Children,Digital_Engagement_Score,Residence_Status,Nationality,Religion,Account_Type,Vehicle_Owner,Drivers_License,Monthly_Groceries_Spend,International_Travel_Frequency,Risk_Tolerance,Student_Status,Employer_Insurance,Debt_to_Income,Business_Account_Owner,Already_Has_Products,Do_Not_Need_Products,Recent_Transactions,Education_Level,Gender,Occupation_Sector,Health_Score,Property_Value_OMR,Vehicle_Value_OMR,Credit_Utilization_Pct,Avg_Days_Abroad_Per_Year,Digital_Channel_Preference
John Doe,john@example.com,30,2500.0,Salaried,750,24,Married,2,85,Owned,OM,Muslim,Salary,Yes,Yes,250.5,2,Medium,No,Yes,0.25,No,1,0,5,Bachelor,Male,Private,75,125000.0,25000.0,0.15,14,Mobile`
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'customer_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Customer CSV</DialogTitle>
        </DialogHeader>

        {!showResults ? (
          <div className="space-y-4">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                Upload a CSV file to import multiple customers at once. Make sure your CSV includes the required fields: Name, email, and follows the expected format.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label>CSV File</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={downloadTemplate}
                >
                  Download Template
                </Button>
              </div>
              {file && (
                <p className="text-sm text-muted-foreground">
                  Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">CSV Format Requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>First row must contain column headers</li>
                <li>Required fields: Name, email</li>
                <li>Email addresses must be unique</li>
                <li>Employment_Type: Retired, Salaried, Self-Employed, Student</li>
                <li>Marital_Status: Divorced, Married, Single, Widowed</li>
                <li>Yes/No fields: Vehicle_Owner, Drivers_License, Student_Status, etc.</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  {uploadResult?.successful_imports === uploadResult?.total_rows ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                  <h3 className="font-medium">Upload Results</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{uploadResult?.total_rows}</div>
                    <div className="text-sm text-muted-foreground">Total Rows</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{uploadResult?.successful_imports}</div>
                    <div className="text-sm text-muted-foreground">Successful</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{uploadResult?.failed_imports}</div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {uploadResult?.errors && uploadResult.errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-red-600">Import Errors:</h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {uploadResult.errors.map((error, index) => (
                    <Alert key={index} variant="destructive">
                      <AlertDescription className="text-sm">
                        Row {error.row}: {error.error}
                        {error.email && ` (${error.email})`}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {!showResults ? (
            <>
              <Button onClick={handleUpload} disabled={!file || isUploading}>
                {isUploading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload CSV
                  </>
                )}
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </>
          ) : (
            <Button onClick={handleClose}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
