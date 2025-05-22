"use client"

import { useEffect, useState } from "react"
import {
  ArrowUpDown,
  Calendar,
  CreditCard,
  Download,
  Filter,
  PieChart,
  Search,
  Stamp,
  User,
  Wallet,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const iconMap: Record<string, React.ElementType> = {
  CreditCard,
  PieChart,
  Wallet,
  Stamp,
  Calendar,
  User,
}

interface Recommendation {
  id: number
  product: {
    id: number
    name: string
    description?: string
  }
  segment: {
    id: number
    name: string
  }
  customerCount: number
  conversionRate: number
  potential: "high" | "medium" | "low"
  icon: string
}

export default function RecommendationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1);
  const recommendationsPerPage = 4;

  const [showFilters, setShowFilters] = useState(false);
  const toggleFilters = () => setShowFilters(!showFilters);

  // Add filter states
  const [selectedSegment, setSelectedSegment] = useState("");
  const [selectedPotential, setSelectedPotential] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("all");

const [segments, setSegments] = useState<{ id: number; name: string }[]>([]);
const [products, setProducts] = useState<{ id: number; name: string }[]>([]);
const [formData, setFormData] = useState({
  productId: "",
  segmentId: "",
  scheduleDate: "",
  notes: "",
});
const [openModal, setOpenModal] = useState(false);
useEffect(() => {
  async function fetchDropdowns() {
    const [segmentRes, productRes] = await Promise.all([
      fetch("http://localhost:8000/segments/"),
      fetch("http://localhost:8000/products/"),
    ]);

    if (segmentRes.ok) {
      const segmentsData = await segmentRes.json();
      console.log("Fetched segments:", segmentsData);
      setSegments(segmentsData);
    }

    if (productRes.ok) {
      const productsData = await productRes.json();
      console.log("Fetched products:", productsData);
      setProducts(productsData);
    }
  }

  fetchDropdowns();
}, []);




const handleSchedule = async () => {
  try {
    const res = await fetch("http://localhost:8000/recommendations/campaigns/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: parseInt(formData.productId),
        segment_id: parseInt(formData.segmentId),
        schedule_date: new Date(formData.scheduleDate),
        notes: formData.notes,
      }),
    });

    if (!res.ok) throw new Error("Failed to schedule campaign.");
    alert("Campaign scheduled successfully!");
    setOpenModal(false);
  } catch (error) {
    console.error(error);
    alert("Something went wrong while scheduling.");
  }
};

const filteredRecommendations = recommendations.filter((rec) => {
  const product = rec.product?.name?.toLowerCase() || "";
  const segment = rec.segment?.name?.toLowerCase() || "";
  const potential = rec.potential?.toLowerCase() || "";
  const term = searchTerm.toLowerCase();

  return (
    (product.includes(term) || segment.includes(term)) &&
    (selectedSegment === "" || segment === selectedSegment.toLowerCase()) &&
    (selectedPotential === "" || potential === selectedPotential.toLowerCase()) &&
    (selectedProduct === "all" || product === selectedProduct)
  );
});



// Paginate on the filtered list:
const currentRecommendations = filteredRecommendations.slice(
  (currentPage - 1) * recommendationsPerPage,
  currentPage * recommendationsPerPage
);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:8000/recommendations/")
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        const data = await res.json()
        setRecommendations(data)
      } catch (error) {
        console.error("Error fetching recommendations:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

const indexOfLastRec = currentPage * recommendationsPerPage;
const indexOfFirstRec = indexOfLastRec - recommendationsPerPage;
// Removed duplicate currentRecommendations declaration
const totalPages = Math.ceil(filteredRecommendations.length / recommendationsPerPage);

const [selectedSegmentCard, setSelectedSegmentCard] = useState<string | null>(null);
const [segmentCustomers, setSegmentCustomers] = useState<any[]>([]);
const [loadingCustomers, setLoadingCustomers] = useState(false);

const handleViewCustomers = async (segment: string) => {
  try {
    setSelectedSegmentCard(segment);
    setLoadingCustomers(true);

    const res = await fetch(`/api/customers?segment=${encodeURIComponent(segment)}`);
    const data = await res.json();

    setSegmentCustomers(data);
  } catch (error) {
    console.error("Error fetching customers:", error);
    setSegmentCustomers([]);
  } finally {
    setLoadingCustomers(false);
  }
};


  return (
    <div className="w-[1400px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Product Recommendations</h1>
          <p className="page-description">View system-wide product suggestions by category or customer segment</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
<Dialog open={openModal} onOpenChange={setOpenModal}>
  <DialogTrigger asChild>
    <Button>
      <Calendar className="mr-2 h-4 w-4" />
      Schedule Campaign
    </Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[500px]">
    <DialogHeader>
      <DialogTitle>Schedule Campaign</DialogTitle>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <Select
  value={formData.segmentId}
  onValueChange={(value) => setFormData({ ...formData, segmentId: value })}
>
  <SelectTrigger>
    <SelectValue placeholder="Select Segment" />
  </SelectTrigger>
  <SelectContent>
    {segments.map((seg) => (
      <SelectItem key={seg.id} value={seg.id.toString()}>
        {seg.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

<Select
  value={formData.productId}
  onValueChange={(value) => setFormData({ ...formData, productId: value })}
>
  <SelectTrigger>
    <SelectValue placeholder="Select Product" />
  </SelectTrigger>
  <SelectContent>
    {products.map((prod) => (
      <SelectItem key={prod.id} value={prod.id.toString()}>
        {prod.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>


<Input
  type="datetime-local"
  value={formData.scheduleDate}
  onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
/>

<Input
  placeholder="Optional notes"
  value={formData.notes}
  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
/>

    </div>
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={() => setOpenModal(false)}>Cancel</Button>
      <Button onClick={handleSchedule}>Confirm</Button>
    </div>
  </DialogContent>
</Dialog>

<Dialog open={openModal} onOpenChange={setOpenModal}>
  <DialogTrigger asChild>
    <Button>
      <Calendar className="mr-2 h-4 w-4" />
      Schedule Campaign
    </Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[500px]">
    <DialogHeader>
      <DialogTitle>Schedule Campaign</DialogTitle>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <Select
  value={formData.segmentId}
  onValueChange={(value) => setFormData({ ...formData, segmentId: value })}
>
  <SelectTrigger>
    <SelectValue placeholder="Select Segment" />
  </SelectTrigger>
  <SelectContent>
    {segments.map((seg) => (
      <SelectItem key={seg.id} value={seg.id.toString()}>
        {seg.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

<Select
  value={formData.productId}
  onValueChange={(value) => setFormData({ ...formData, productId: value })}
>
  <SelectTrigger>
    <SelectValue placeholder="Select Product" />
  </SelectTrigger>
  <SelectContent>
    {products.map((prod) => (
      <SelectItem key={prod.id} value={prod.id.toString()}>
        {prod.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>


<Input
  type="datetime-local"
  value={formData.scheduleDate}
  onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
/>

<Input
  placeholder="Optional notes"
  value={formData.notes}
  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
/>

    </div>
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={() => setOpenModal(false)}>Cancel</Button>
      <Button onClick={handleSchedule}>Confirm</Button>
    </div>
  </DialogContent>
</Dialog>

        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Recommendations</p>
              <p className="stat-value">2,590</p>
            </div>
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <CreditCard className="h-6 w-6" />
            </div>
          </div>
          <p className="stat-description">Total active recommendations across all customers</p>
        </Card>

        <Card className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Average Conversion</p>
              <p className="stat-value">38%</p>
            </div>
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <PieChart className="h-6 w-6" />
            </div>
          </div>
          <p className="stat-description">Average conversion rate across all products</p>
        </Card>

        <Card className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Top Segment</p>
              <p className="stat-value">High Net Worth</p>
            </div>
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <User className="h-6 w-6" />
            </div>
          </div>
          <p className="stat-description">Segment with highest recommendation acceptance</p>
        </Card>
      </div>

      {/* Table and view controls */}
      <Tabs defaultValue="list" className="space-y-4 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            <TabsTrigger value="segment">By Segment</TabsTrigger>
          </TabsList>
          <div className="mt-4 flex items-center gap-2 sm:mt-0">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input
  type="search"
  placeholder="Search recommendations..."
  className="pl-8 sm:w-[260px]"
  value={searchTerm}
  onChange={(e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // reset page on search
  }}
/>

            </div>
            <Button variant="outline" size="icon" onClick={toggleFilters}>
              <Filter className="h-4 w-4" />
            </Button>
            {showFilters && (
  <div className="absolute z-10 mt-2 p-4 border rounded bg-white shadow-md w-[300px]">
    <div className="flex flex-col gap-4">
      {/* Segment Filter */}
      <div>
        <label className="block mb-1 font-medium">Segment</label>
        <select
          value={selectedSegment}
          onChange={(e) => setSelectedSegment(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="">All Segments</option>
          <option value="High Net Worth">High Net Worth</option>
          <option value="Mass Affluent">Mass Affluent</option>
          <option value="Homeowners">Homeowners</option>
          <option value="Young Professionals">Young Professionals</option>
        </select>
      </div>

      {/* Potential Filter */}
      <div>
        <label className="block mb-1 font-medium">Potential</label>
        <select
          value={selectedPotential}
          onChange={(e) => setSelectedPotential(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="">All Potentials</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      
    </div>
  </div>
)}

<Select
  value={selectedProduct}
  onValueChange={(value) => {
    setSelectedProduct(value);
    setCurrentPage(1);
  }}
>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="All Products" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Products</SelectItem>
    <SelectItem value="premium credit card">Premium Credit Card</SelectItem>
    <SelectItem value="investment portfolio">Investment Portfolio</SelectItem>
    <SelectItem value="home loan refinance">Home Loan Refinance</SelectItem>
    <SelectItem value="savings account">Savings Account</SelectItem>
  </SelectContent>
</Select>


          </div>
        </div>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-6">Loading recommendations...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Button variant="ghost" className="p-0 font-medium">
                          Product
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>Segment</TableHead>
                      <TableHead>Customers</TableHead>
                      <TableHead>Conversion Rate</TableHead>
                      <TableHead>Potential</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentRecommendations.map((rec) => {
                      const Icon = iconMap[rec.icon] || Stamp
                      return (
                        <TableRow key={rec.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="rounded-full bg-primary/10 p-1.5 text-primary">
                                <Icon className="h-4 w-4" />
                              </div>
                              <span className="font-medium">{rec.product.name || "N/A"}</span>
                            </div>
                          </TableCell>
                          <TableCell>{rec.segment.name || "N/A"}</TableCell>
                          <TableCell>{rec.customerCount || 0}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={rec.conversionRate} className="h-2 w-[60px]" />
                              <span>{rec.conversionRate || 0}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                rec.potential === "high"
                                  ? "default"
                                  : rec.potential === "medium"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                               {rec.potential || "low"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost">
                                View
                              </Button>
                              <Button size="sm">Campaign</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
           <div className="flex items-center justify-between px-6 py-4">
  <div className="text-sm text-muted-foreground">
    Showing <strong>{currentRecommendations.length}</strong> of <strong>{recommendations.length}</strong> recommendations
  </div>
  <div className="flex items-center gap-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
    >
      Previous
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
    >
      Next
    </Button>
  </div>
</div>

        </TabsContent>

        <TabsContent value="heatmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Recommendation Heatmap</CardTitle>
              <CardDescription>Visualize recommendation strength across customer segments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  <TooltipProvider>
                    <div className="grid grid-cols-[180px_repeat(5,1fr)] gap-2">
                      <div className="col-start-2 text-center text-sm font-medium">High Net Worth</div>
                      <div className="text-center text-sm font-medium">Mass Affluent</div>
                      <div className="text-center text-sm font-medium">Young Professionals</div>
                      <div className="text-center text-sm font-medium">Small Business</div>
                      <div className="text-center text-sm font-medium">Retail</div>

                      <div className="text-sm font-medium">Premium Credit Card</div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/90 p-4 text-center text-white">92%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>320 customers, 42% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/70 p-4 text-center text-white">78%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>280 customers, 35% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/50 p-4 text-center text-white">64%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>190 customers, 28% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/30 p-4 text-center text-white">45%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>120 customers, 22% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/20 p-4 text-center text-white">32%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>85 customers, 18% conversion</p>
                        </TooltipContent>
                      </Tooltip>

                      <div className="text-sm font-medium">Investment Portfolio</div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/90 p-4 text-center text-white">90%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>280 customers, 40% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/80 p-4 text-center text-white">85%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>450 customers, 38% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/40 p-4 text-center text-white">55%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>220 customers, 25% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/30 p-4 text-center text-white">40%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>95 customers, 20% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/20 p-4 text-center text-white">30%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>75 customers, 15% conversion</p>
                        </TooltipContent>
                      </Tooltip>

                      <div className="text-sm font-medium">Home Loan Refinance</div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/70 p-4 text-center text-white">75%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>180 customers, 35% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/60 p-4 text-center text-white">70%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>620 customers, 35% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/40 p-4 text-center text-white">58%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>320 customers, 28% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/20 p-4 text-center text-white">35%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>90 customers, 18% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/10 p-4 text-center text-white">25%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>120 customers, 12% conversion</p>
                        </TooltipContent>
                      </Tooltip>

                      <div className="text-sm font-medium">Business Credit Line</div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/40 p-4 text-center text-white">52%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>85 customers, 25% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/30 p-4 text-center text-white">48%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>120 customers, 22% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/20 p-4 text-center text-white">35%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>75 customers, 18% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/90 p-4 text-center text-white">90%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>180 customers, 45% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="rounded bg-primary/30 p-4 text-center text-white">42%</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>95 customers, 20% conversion</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-6 rounded bg-primary/20"></div>
                  <span className="text-xs">Low</span>
                  <div className="h-3 w-6 rounded bg-primary/40"></div>
                  <div className="h-3 w-6 rounded bg-primary/60"></div>
                  <div className="h-3 w-6 rounded bg-primary/80"></div>
                  <div className="h-3 w-6 rounded bg-primary"></div>
                  <span className="text-xs">High</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

       <TabsContent value="segment" className="space-y-6">
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    <Card>
      <CardHeader>
        <CardTitle>High Net Worth</CardTitle>
        <CardDescription>320 customers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-medium">Premium Credit Card</div>
            <Badge>92%</Badge>
          </div>
          <Progress value={92} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-medium">Investment Portfolio</div>
            <Badge>90%</Badge>
          </div>
          <Progress value={90} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-medium">Home Loan Refinance</div>
            <Badge>75%</Badge>
          </div>
          <Progress value={75} className="h-2" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => handleViewCustomers("High Net Worth")}>
          View Customers
        </Button>
      </CardFooter>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Mass Affluent</CardTitle>
        <CardDescription>450 customers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-medium">Investment Portfolio</div>
            <Badge>85%</Badge>
          </div>
          <Progress value={85} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-medium">Premium Credit Card</div>
            <Badge>78%</Badge>
          </div>
          <Progress value={78} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-medium">Home Loan Refinance</div>
            <Badge>70%</Badge>
          </div>
          <Progress value={70} className="h-2" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => handleViewCustomers("Mass Affluent")}>
          View Customers
        </Button>
      </CardFooter>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Small Business</CardTitle>
        <CardDescription>180 customers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-medium">Business Credit Line</div>
            <Badge>90%</Badge>
          </div>
          <Progress value={90} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-medium">Premium Credit Card</div>
            <Badge>45%</Badge>
          </div>
          <Progress value={45} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-medium">Investment Portfolio</div>
            <Badge>40%</Badge>
          </div>
          <Progress value={40} className="h-2" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => handleViewCustomers("Small Business")}>
          View Customers
        </Button>
      </CardFooter>
    </Card>
  </div>

  {/* Display customer list below cards */}
  {selectedSegmentCard && (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">
        Customers in {selectedSegmentCard}
      </h2>

      {loadingCustomers ? (
        <p className="text-muted-foreground">Loading customers...</p>
      ) : segmentCustomers.length === 0 ? (
        <p>No customers found in this segment.</p>
      ) : (
        <ul className="divide-y border rounded-lg">
          {segmentCustomers.map((cust) => (
            <li key={cust.id} className="p-4">
              <p className="font-medium">{cust.name}</p>
              <p className="text-sm text-muted-foreground">{cust.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )}
</TabsContent>

      </Tabs>
    </div>
  )
}