"use client"
import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Switch } from "@/components/ui/switch"
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Package2, Tags, Percent, Plus, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Pencil, Trash2, DollarSign, Calendar, Star, Upload, X, Image as ImageIcon, Info, ShoppingBag, Settings2, AlertCircle } from "lucide-react"
import { useState, useMemo, useRef } from "react"

const DEFAULT_TAX_RATE = 11 // 11% PPN

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

export default function ProductList() {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)
  const [isImageManagerOpen, setIsImageManagerOpen] = useState(false)
  const [isTaxSettingsOpen, setIsTaxSettingsOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null)
  const [globalSettings, setGlobalSettings] = useState({
    taxRate: DEFAULT_TAX_RATE
  })
  const [uploadedImages, setUploadedImages] = useState<{file: File, preview: string, alt: string}[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState("details")

  // Sorting states
  const [sortField, setSortField] = useState<keyof typeof products[0]>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const formatCurrency = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const handleSort = (field: keyof typeof products[0]) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      alt: ''
    }))
    setUploadedImages([...uploadedImages, ...newImages])
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...uploadedImages]
    URL.revokeObjectURL(newImages[index].preview)
    newImages.splice(index, 1)
    setUploadedImages(newImages)
  }

  const handleAltChange = (index: number, alt: string) => {
    const newImages = [...uploadedImages]
    newImages[index].alt = alt
    setUploadedImages(newImages)
  }

  const handleEditProduct = (product: typeof products[0]) => {
    setSelectedProduct(product)
    setIsEditProductOpen(true)
    setActiveTab("images") // Set active tab to images when editing
  }

  const handleSetThumbnail = (index: number) => {
    if (selectedProduct) {
      setSelectedProduct({
        ...selectedProduct,
        thumbnailIndex: index
      })
    }
  }

  const sortedAndPaginatedData = useMemo(() => {
    let sortedData = [...products].sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    const startIndex = (currentPage - 1) * rowsPerPage
    return sortedData.slice(startIndex, startIndex + rowsPerPage)
  }, [products, sortField, sortDirection, currentPage, rowsPerPage])

  const totalPages = Math.ceil(products.length / rowsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value))
    setCurrentPage(1)
  }

  return (
    <section aria-label="Product List">
      <div className="flex items-center gap-2 px-4 py-6 sm:p-6">
        <Package2 className="size-5" />
        <h1 className="text-2xl font-semibold">Product Management</h1>
      </div>

      <div className="flex flex-col justify-between -mt-6 gap-2 px-4 py-6 sm:flex-row sm:items-center sm:p-6">
        <div className="flex gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">Search</label>
            <Input
              type="search"
              placeholder="Search products..."
              className="sm:w-64 [&>input]:py-1.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Availability</label>
            <Select>
              <SelectTrigger className="w-full py-1.5 sm:w-44">
                <SelectValue placeholder="Filter Status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
                <SelectItem value="foc">FoC Products</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <Button
            variant="primary"
            className="w-full gap-2 py-1.5 text-base sm:w-fit sm:text-sm"
            onClick={() => setIsAddProductOpen(true)}
          >
            <Plus className="size-4" />
            Add New Product
          </Button>

          <Button
            variant="secondary"
            className="w-full gap-2 py-1.5 text-base sm:w-fit sm:text-sm"
            onClick={() => setIsTaxSettingsOpen(true)}
          >
            <Percent className="size-4" />
            Tax Settings
          </Button>
        </div>
      </div>

      <TableRoot className="border-t border-gray-200 dark:border-gray-800">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell onClick={() => handleSort('name')} className="cursor-pointer">
                <div className="flex items-center gap-2 font-bold">
                  <Package2 className="size-4" />
                  Product Name
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />
                  )}
                </div>
              </TableHeaderCell>
              <TableHeaderCell onClick={() => handleSort('price')} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <DollarSign className="size-4" />
                  Price
                  {sortField === 'price' && (
                    sortDirection === 'asc' ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />
                  )}
                </div>
              </TableHeaderCell>
              <TableHeaderCell>
                <div className="flex items-center gap-2">
                  <Star className="size-4" />
                  Availability
                </div>
              </TableHeaderCell>
              <TableHeaderCell>
                <div className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  Promotional Period
                </div>
              </TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAndPaginatedData.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img 
                      src={product.images[product.thumbnailIndex]} 
                      alt={product.name}
                      className="size-12 rounded-lg object-contain cursor-pointer"
                      onClick={() => handleEditProduct(product)}
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{product.name}</span>
                        {product.isFoC && (
                          <Badge variant="neutral">FoC</Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{product.description}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>Rp {formatCurrency(product.price)}</TableCell>
                <TableCell>
                  <Badge variant={product.isAvailable ? "success" : "error"}>
                    {product.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {product.promotionalStart && product.promotionalEnd ? (
                    <span className="text-sm">
                      {new Date(product.promotionalStart).toLocaleDateString()} - {new Date(product.promotionalEnd).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-gray-500">No promotion</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="p-2"
                            onClick={() => {
                              setSelectedProduct(product)
                              setIsEditProductOpen(true)
                            }}
                          >
                            <Pencil className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Product</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" className="p-2 text-red-500">
                            <Trash2 className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete Product</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableRoot>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isAddProductOpen || isEditProductOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddProductOpen(false)
          setIsEditProductOpen(false)
          setSelectedProduct(null)
          setUploadedImages([])
          setActiveTab("details")
        }
      }}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isEditProductOpen ? (
                <>
                  <Settings2 className="size-5 text-primary" />
                  Edit Product
                </>
              ) : (
                <>
                  <ShoppingBag className="size-5 text-primary" />
                  Add New Product
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 h-12">
              <TabsTrigger value="details" className="flex items-center gap-2 h-10">
                <Info className="size-5 text-primary" />
                Product Details
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center gap-2 h-10">
                <ImageIcon className="size-5 text-primary" />
                Manage Images
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <Input defaultValue={selectedProduct?.name} />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea defaultValue={selectedProduct?.description} className="min-h-[100px]" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <Input 
                  type="text"
                  defaultValue={selectedProduct ? `Rp ${formatCurrency(selectedProduct.price)}` : ''}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select defaultValue={selectedProduct?.isAvailable ? "available" : "unavailable"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Promotion Start</label>
                  <Input type="date" defaultValue={selectedProduct?.promotionalStart} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Promotion End</label>
                  <Input type="date" defaultValue={selectedProduct?.promotionalEnd} />
                </div>
              </div>

              <div className="h-px bg-gray-200 dark:bg-gray-800 !my-4 !mt-5 flex"></div>

              <div className="flex items-center justify-between p-4 bg-primary/5 dark:bg-gray-800/50 rounded-2xl">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Tags className="size-4 text-primary" />
                  Mark as FoC (Free of Charge)
                </label>
                <Switch defaultChecked={selectedProduct?.isFoC} />
              </div>

              <div className="h-px bg-gray-200 dark:bg-gray-800 !mt-5 flex"></div>
            </TabsContent>

            <TabsContent value="images">
              <div 
                className="border-2 bg-primary/5 border-primary/40 dark:border-gray-700 rounded-lg p-8 text-center cursor-pointer mt-5 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Upload className="size-8 text-primary" strokeWidth={1.800} />
                </div>
                <p className="text-sm font-medium text-primary">Click to Upload Images</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
              </div>
              
              {(uploadedImages.length > 0 || (selectedProduct?.images && selectedProduct.images.length > 0)) && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img 
                        src={img.preview}
                        alt={img.alt}
                        className="w-full rounded-lg object-contain border-2 border-gray-100 dark:border-gray-800"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-black/50 p-2 rounded-b-lg">
                        <Input
                          type="text"
                          placeholder="Add alt text"
                          value={img.alt}
                          onChange={(e) => handleAltChange(idx, e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <Button
                        variant="secondary"
                        className="absolute -top-2 -right-2 size-6 p-0 rounded-full"
                        onClick={() => handleRemoveImage(idx)}
                      >
                        <X className="size-3" />
                      </Button>
                    </div>
                  ))}
                  {selectedProduct?.images?.map((img, idx) => (
                    <div key={`existing-${idx}`} className="relative">
                      <img 
                        src={img}
                        alt={`Product image ${idx + 1}`}
                        className={`w-full aspect-square rounded-lg object-cover border-2 ${idx === selectedProduct.thumbnailIndex ? 'border-blue-500' : 'border-gray-200 dark:border-gray-800'}`}
                      />
                      <Button
                        variant="secondary"
                        className="absolute -top-2 -right-2 size-6 p-0 rounded-full"
                        onClick={() => handleSetThumbnail(idx)}
                      >
                        {idx === selectedProduct.thumbnailIndex ? <Star className="size-3 text-blue-500" /> : <Star className="size-3" />}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={() => {
              setIsAddProductOpen(false)
              setIsEditProductOpen(false)
              setSelectedProduct(null)
            }}>
              Cancel
            </Button>
            <Button variant="primary" className="flex items-center gap-2">
              {isEditProductOpen ? (
                <>
                  <Settings2 className="size-4" />
                  Update Product
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  Add Product
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tax Settings Dialog */}
      <Dialog open={isTaxSettingsOpen} onOpenChange={setIsTaxSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="size-5 text-yellow-500" />
              Tax Settings (PPN)
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tax Rate (%)</label>
              <Input 
                type="number"
                min="0"
                max="100"
                step="0.1"
                defaultValue={globalSettings.taxRate}
                onChange={(e) => setGlobalSettings({...globalSettings, taxRate: Number(e.target.value)})}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsTaxSettingsOpen(false)}>Cancel</Button>
              <Button variant="primary" className="flex items-center gap-2">
                <Percent className="size-4" />
                Update Tax Rate
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-800 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <Button 
            variant="secondary" 
            className="flex items-center gap-1 rounded-md px-3 py-2"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>
          <Button 
            variant="secondary" 
            className="flex items-center gap-1 rounded-md px-3 py-2"
            onClick={() => handlePageChange(currentPage + 1)}
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
              <span className="font-medium">{Math.min(currentPage * rowsPerPage, products.length)}</span> of{' '}
              <span className="font-medium">{products.length}</span> results
            </p>
          </div>

          <div>
            <nav className="isolate inline-flex gap-2 -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <Button 
                variant="secondary" 
                className="flex items-center gap-1 rounded-l-md px-3 py-2"
                onClick={() => handlePageChange(currentPage - 1)}
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
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
              <Button 
                variant="secondary" 
                className="flex items-center gap-1 rounded-r-md px-3 py-2"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </section>
  )
}
