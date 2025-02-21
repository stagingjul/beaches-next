"use client"
import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Textarea } from "@/components/ui/Textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/Table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tags, Percent, Plus, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Pencil, Trash2, DollarSign, Calendar, Package } from "lucide-react"
import { useState, useMemo } from "react"

const products = [
  {
    id: 1,
    name: "Pale Ale",
    description: "Bursting with a world of flavour.  Our Pale Ale is beautifully balanced, low in bitterness and awesomely smashable.",
    price: 250000,
    images: ["https://beachesbrewingco.com/wp-content/uploads/bali-craft-beer-PaleAle-min.png", "/coffee-beans-2.jpg", "/coffee-beans-3.jpg"],
    thumbnailIndex: 0,
    isAvailable: true,
    isFoC: false,
    promotionalStart: null,
    promotionalEnd: null
  },
  {
    id: 2,
    name: "Cerveza", 
    description: "Created to crush any thirst. Our light bodied lager, with a crisp citrus finish is perfect for every session. Classic, Crips, Crushable.",
    price: 1500000,
    images: ["https://beachesbrewingco.com/wp-content/uploads/bali-craft-beer-Cerveza-min.png", "https://beachesbrewingco.com/wp-content/uploads/bali-craft-beer-Cerveza-min.png"],
    thumbnailIndex: 0,
    isAvailable: true,
    isFoC: false,
    promotionalStart: "2024-03-01",
    promotionalEnd: "2024-03-31"
  },
  {
    id: 3,
    name: "Sample Pack",
    description: "Free sample pack for new customers",
    price: 50000,
    images: ["https://placehold.co/600x400"],
    thumbnailIndex: 0,
    isAvailable: true,
    isFoC: true,
    promotionalStart: null,
    promotionalEnd: null
  }
]

const promotions = [
  {
    id: 1,
    name: "Summer Sale",
    description: "20% off on all summer items",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    discountType: "percentage",
    discountValue: 20,
    status: "scheduled",
    products: [1, 2]
  },
  {
    id: 2,
    name: "Holiday Special",
    description: "Fixed price reduction on selected items",
    startDate: "2024-12-01",
    endDate: "2024-12-31", 
    discountType: "fixed",
    discountValue: 100000,
    status: "scheduled",
    products: [2, 3]
  },
  {
    id: 3,
    name: "Flash Sale",
    description: "Limited time 30% discount",
    startDate: "2024-03-01",
    endDate: "2024-03-31",
    discountType: "percentage", 
    discountValue: 30,
    status: "active",
    products: [1, 3]
  }
]

export default function PromotionList() {
  const [isAddPromotionOpen, setIsAddPromotionOpen] = useState(false)
  const [isEditPromotionOpen, setIsEditPromotionOpen] = useState(false)
  const [selectedPromotion, setSelectedPromotion] = useState<typeof promotions[0] | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [newPromotion, setNewPromotion] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    discountType: 'percentage',
    discountValue: 0,
    products: [] as number[]
  })

  // Sorting states
  const [sortField, setSortField] = useState<keyof typeof promotions[0]>('startDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const formatCurrency = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const handleSort = (field: keyof typeof promotions[0]) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getPromotionStatus = (promotion: typeof promotions[0]): string => {
    const now = new Date()
    const start = new Date(promotion.startDate)
    const end = new Date(promotion.endDate)
    
    if (now < start) return "scheduled"
    if (now > end) return "expired"
    return "active"
  }

  const handleProductSelection = (productId: number) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId)
      } else {
        return [...prev, productId]
      }
    })
  }

  const sortedAndPaginatedData = useMemo(() => {
    let sortedData = [...promotions].sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    const startIndex = (currentPage - 1) * rowsPerPage
    return sortedData.slice(startIndex, startIndex + rowsPerPage)
  }, [promotions, sortField, sortDirection, currentPage, rowsPerPage])

  const totalPages = Math.ceil(promotions.length / rowsPerPage)

  return (
    <section aria-label="Promotion Management">
      <div className="flex items-center gap-2 px-4 py-6 sm:p-6">
        <Tags className="size-5" />
        <h1 className="text-2xl font-semibold">Promotion Management</h1>
      </div>

      <div className="flex flex-col justify-between -mt-6 gap-2 px-4 py-6 sm:flex-row sm:items-center sm:p-6">
        <div className="flex gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">Search</label>
            <Input
              type="search"
              placeholder="Search promotions..."
              className="sm:w-64 [&>input]:py-1.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Filter</label>
            <Select>
              <SelectTrigger className="w-full py-1.5 sm:w-44">
                <SelectValue placeholder="Filter Status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Promotions</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          variant="primary"
          className="w-full gap-2 py-1.5 text-base sm:w-fit sm:text-sm"
          onClick={() => setIsAddPromotionOpen(true)}
        >
          <Plus className="size-4" />
          Create New Promotion
        </Button>
      </div>

      <TableRoot className="border-t border-gray-200 dark:border-gray-800">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell onClick={() => handleSort('name')} className="cursor-pointer">
                <div className="flex items-center gap-2 font-bold">
                  <Tags className="size-4" />
                  Promotion Name
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />
                  )}
                </div>
              </TableHeaderCell>
              <TableHeaderCell>
                <div className="flex items-center gap-2">
                  <Percent className="size-4" />
                  Discount
                </div>
              </TableHeaderCell>
              <TableHeaderCell onClick={() => handleSort('startDate')} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  Duration
                  {sortField === 'startDate' && (
                    sortDirection === 'asc' ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />
                  )}
                </div>
              </TableHeaderCell>
              <TableHeaderCell>
                <div className="flex items-center gap-2">
                  <Package className="size-4" />
                  Applied Products
                </div>
              </TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAndPaginatedData.map((promotion) => {
              const status = getPromotionStatus(promotion)
              const appliedProducts = products.filter(p => promotion.products.includes(p.id))
              return (
                <TableRow 
                  key={promotion.id}
                  className={status === 'active' ? "bg-green-50 dark:bg-green-900/10" : ""}
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold">{promotion.name}</span>
                      <span className="text-sm text-gray-500">{promotion.description}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={promotion.discountType === 'percentage' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}>
                      {promotion.discountType === 'percentage' ? (
                        <span className="flex items-center gap-1">
                          <Percent className="size-3.5" />
                          {promotion.discountValue}% Off
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <DollarSign className="size-3.5" />
                          Rp {formatCurrency(promotion.discountValue)} Off
                        </span>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {new Date(promotion.startDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="text-sm text-gray-500">to</span>
                      <span className="text-sm font-medium">
                        {new Date(promotion.endDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </TableCell>
                    <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {appliedProducts.slice(0, 2).map(product => (
                        <Badge 
                          key={product.id} 
                          variant="outline" 
                          className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
                        >
                          <Package className="size-3.5" />
                          {product.name}
                        </Badge>
                      ))}
                      {appliedProducts.length > 2 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200 cursor-pointer">
                                +{appliedProducts.length - 2} more
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="flex flex-col gap-1.5 p-2">
                                {appliedProducts.slice(2).map(product => (
                                  <div key={product.id} className="flex items-center gap-2">
                                    <Package className="size-3.5" />
                                    <span>{product.name}</span>
                                  </div>
                                ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        status === 'active' ? "success" : 
                        status === 'scheduled' ? "warning" : 
                        "error"
                      }
                      className="capitalize"
                    >
                      {status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                              onClick={() => {
                                setSelectedPromotion(promotion)
                                setSelectedProducts(promotion.products)
                                setIsEditPromotionOpen(true)
                              }}
                            >
                              <Pencil className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit Promotion</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete Promotion</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableRoot>

      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-800 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <Button 
            variant="secondary" 
            className="flex items-center gap-1 rounded-md px-3 py-2"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>
          <Button 
            variant="secondary" 
            className="flex items-center gap-1 rounded-md px-3 py-2"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-400">
              Showing <span className="font-medium">{((currentPage - 1) * rowsPerPage) + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * rowsPerPage, promotions.length)}</span> of{' '}
              <span className="font-medium">{promotions.length}</span> results
            </p>
          </div>

          <div>
            <nav className="isolate inline-flex gap-2 -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <Button 
                variant="secondary" 
                className="flex items-center gap-1 rounded-l-md px-3 py-2"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="size-4" />
                Previous
              </Button>
              {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "primary" : "secondary"}
                  className="mx-1 px-4 py-2"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button 
                variant="secondary" 
                className="flex items-center gap-1 rounded-r-md px-3 py-2"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            </nav>
          </div>
        </div>
      </div>

      {/* Add Promotion Dialog */}
      <Dialog open={isAddPromotionOpen} onOpenChange={setIsAddPromotionOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Promotion</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">Promotion Name</label>
              <Input
                id="name"
                value={newPromotion.name}
                onChange={(e) => setNewPromotion({...newPromotion, name: e.target.value})}
                placeholder="Enter promotion name"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea
                id="description"
                value={newPromotion.description}
                onChange={(e) => setNewPromotion({...newPromotion, description: e.target.value})}
                placeholder="Enter promotion description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="startDate" className="text-sm font-medium">Start Date</label>
                <Input
                  id="startDate"
                  type="date"
                  value={newPromotion.startDate}
                  onChange={(e) => setNewPromotion({...newPromotion, startDate: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="endDate" className="text-sm font-medium">End Date</label>
                <Input
                  id="endDate"
                  type="date"
                  value={newPromotion.endDate}
                  onChange={(e) => setNewPromotion({...newPromotion, endDate: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="discountType" className="text-sm font-medium">Discount Type</label>
                <Select
                  value={newPromotion.discountType}
                  onValueChange={(value) => setNewPromotion({...newPromotion, discountType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="discountValue" className="text-sm font-medium">Discount Value</label>
                <Input
                  id="discountValue"
                  type="number"
                  value={newPromotion.discountValue}
                  onChange={(e) => setNewPromotion({...newPromotion, discountValue: Number(e.target.value)})}
                  placeholder={newPromotion.discountType === 'percentage' ? "Enter percentage" : "Enter amount"}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Applied Products</label>
              <div className="grid gap-2 max-h-[200px] overflow-y-auto border rounded-lg p-4 bg-gray-50">
                {products.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        id={`product-${product.id}`}
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleProductSelection(product.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 size-4 my-auto"
                      />
                      <div className="size-12 rounded-lg overflow-hidden my-auto">
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <label htmlFor={`product-${product.id}`} className="flex flex-col cursor-pointer">
                        <span className="font-bold text-gray-900">{product.name}</span>
                        <span className="text-sm font-medium text-gray-900">Rp{formatCurrency(product.price)}</span>
                        <span className="text-sm text-gray-500">{product.description}</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsAddPromotionOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary">
              Create Promotion
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Promotion Dialog */}
      <Dialog open={isEditPromotionOpen} onOpenChange={setIsEditPromotionOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Promotion</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit-name" className="text-sm font-medium">Promotion Name</label>
              <Input
                id="edit-name"
                value={selectedPromotion?.name}
                placeholder="Enter promotion name"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-description" className="text-sm font-medium">Description</label>
              <Textarea
                id="edit-description"
                value={selectedPromotion?.description}
                placeholder="Enter promotion description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="edit-startDate" className="text-sm font-medium">Start Date</label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={selectedPromotion?.startDate}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-endDate" className="text-sm font-medium">End Date</label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={selectedPromotion?.endDate}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="edit-discountType" className="text-sm font-medium">Discount Type</label>
                <Select defaultValue={selectedPromotion?.discountType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-discountValue" className="text-sm font-medium">Discount Value</label>
                <Input
                  id="edit-discountValue"
                  type="number"
                  value={selectedPromotion?.discountValue}
                  placeholder={selectedPromotion?.discountType === 'percentage' ? "Enter percentage" : "Enter amount"}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Applied Products</label>
              <div className="grid gap-2 max-h-[200px] overflow-y-auto border rounded-lg p-4 bg-gray-50">
                {products.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        id={`edit-product-${product.id}`}
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleProductSelection(product.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 size-4 my-auto"
                      />
                      <div className="size-12 rounded-lg overflow-hidden my-auto">
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <label htmlFor={`edit-product-${product.id}`} className="flex flex-col cursor-pointer">
                        <span className="font-bold text-gray-900">{product.name}</span>
                        <span className="text-sm font-medium text-gray-900">Rp {formatCurrency(product.price)}</span>
                        <span className="text-sm text-gray-500">{product.description}</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsEditPromotionOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
