"use client"
import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Checkbox } from "@/components/ui/checkbox"
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
  DialogTabs,
  DialogTabsList,
  DialogTabsTrigger,
  DialogTabsContent,
} from "@/components/ui/dialog"
import { Truck, Package, MapPin, Plus, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Pencil, AlertCircle, ClipboardCheck, MapPinned, Settings, Calendar, Users, CheckCircle2, Clock } from "lucide-react"
import { useState, useMemo } from "react"

const deliveries = [
  {
    id: 1,
    batchId: "BATCH-001",
    orders: ["ORD-BCHS-202409293001", "ORD-LBR-202409293002", "ORD-SFN-202409293003"],
    coordinator: "John Smith",
    area: "Canggu",
    status: "Pending",
    plannedDate: "2024-03-15",
    customerNames: ["Beach Club Canggu", "La Brisa", "Single Fin"],
    addresses: ["123 North St", "456 West Ave", "789 East Rd"]
  },
  {
    id: 2,
    batchId: "BATCH-002", 
    orders: ["ORD-BCHS-202409293001", "ORD-LBR-202409293002"],
    coordinator: "Sarah Jones",
    area: "Jimbaran",
    status: "In Progress",
    plannedDate: "2024-03-15",
    customerNames: ["Beach Club Canggu", "La Brisa"],
    addresses: ["321 South St", "654 East Ave"]
  },
  {
    id: 3,
    batchId: "BATCH-003",
    orders: ["ORD-SFN-202409293003"],
    coordinator: "Mike Chen",
    area: "Seminyak", 
    status: "Delivered",
    plannedDate: "2024-03-14",
    customerNames: ["Single Fin"],
    addresses: ["147 East St", "258 North Ave", "369 West Rd"]
  }
]

const orders = [
  {
    id: "ORD-BCHS-202409293001",
    customerName: "Beach Club Canggu",
    orderDate: "2024-03-10T08:30:00",
    total: 5000000,
    status: "Pending Approval",
    paymentStatus: "Unpaid",
    paymentMethod: "Bank Transfer",
    paymentDue: "2024-03-24",
    items: [
      { name: "Pale Ale", quantity: 10, price: 250000 },
      { name: "Cerveza", quantity: 2, price: 1500000 }
    ]
  },
  {
    id: "ORD-LBR-202409293002", 
    customerName: "La Brisa",
    orderDate: "2024-03-09T16:45:00",
    total: 3750000,
    status: "Approved",
    paymentStatus: "Paid",
    paymentMethod: "Bank Transfer", 
    paymentDue: "2024-03-23",
    items: [
      { name: "Pale Ale", quantity: 15, price: 250000 }
    ]
  },
  {
    id: "ORD-SFN-202409293003",
    customerName: "Single Fin",
    orderDate: "2024-03-10T09:15:00",
    total: 4500000,
    status: "Processing",
    paymentStatus: "Pending Verification",
    paymentMethod: "Manual Transfer",
    paymentDue: "2024-03-24",
    items: [
      { name: "Cerveza", quantity: 3, price: 1500000 }
    ]
  }
]

const orderStatuses = [
  "Pending Approval",
  "Approved", 
  "Processing",
  "Ready for Delivery",
  "Delivered",
  "Cancelled"
]

const paymentStatuses = [
  "Unpaid",
  "Pending Verification", 
  "Paid",
  "Overdue",
  "Refunded"
]

const paymentMethods = [
  "Bank Transfer",
  "Manual Transfer", 
  "Credit Card",
  "QR Payment"
]

const coordinators = [
  "John Smith",
  "Sarah Jones", 
  "Mike Chen",
  "Lisa Wong",
  "Tom Brown"
]

const areas = [
  "Canggu",
  "Seminyak",
  "Jimbaran",
  "Uluwatu",
  "Kuta"
]

export default function DeliveryManagement() {
  const [isAddDeliveryOpen, setIsAddDeliveryOpen] = useState(false)
  const [isEditDeliveryOpen, setIsEditDeliveryOpen] = useState(false)
  const [isAreaManagementOpen, setIsAreaManagementOpen] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState<typeof deliveries[0] | null>(null)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("pending")
  const [newArea, setNewArea] = useState("")
  const [managedAreas, setManagedAreas] = useState(areas)

  // Sorting states
  const [sortField, setSortField] = useState<keyof typeof deliveries[0]>('plannedDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleSort = (field: keyof typeof deliveries[0]) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter(delivery => {
      if (activeTab === "all") return true
      return delivery.status.toLowerCase() === activeTab
    })
  }, [activeTab])

  const sortedAndPaginatedData = useMemo(() => {
    let sortedData = [...filteredDeliveries].sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    const startIndex = (currentPage - 1) * rowsPerPage
    return sortedData.slice(startIndex, startIndex + rowsPerPage)
  }, [filteredDeliveries, sortField, sortDirection, currentPage, rowsPerPage])

  const totalPages = Math.ceil(filteredDeliveries.length / rowsPerPage)

  const handleStatusUpdate = (deliveryId: number, newStatus: string) => {
    // Here you would typically make an API call to update the status
    console.log(`Updating delivery ${deliveryId} status to ${newStatus}`)
  }

  // Group orders by customer
  const groupedOrders = useMemo(() => {
    const groups: { [key: string]: typeof orders } = {}
    orders.forEach(order => {
      if (!groups[order.customerName]) {
        groups[order.customerName] = []
      }
      groups[order.customerName].push(order)
    })
    return groups
  }, [])

  return (
    <section aria-label="Delivery Management">
      <div className="flex items-center gap-2 px-4 py-6 sm:p-6">
        <Truck className="size-5" />
        <h1 className="text-2xl font-semibold">Delivery Planning & Tracking</h1>
      </div>

      <div className="flex flex-col justify-between -mt-6 gap-2 px-4 py-6 sm:flex-row sm:items-center sm:p-6">
        <div className="flex gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <div className="relative">
              <Input
                type="date"
                className="sm:w-44 [&>input]:py-1.5"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Area</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
              <Select>
                <SelectTrigger className="w-full py-1.5 sm:w-44 pl-10">
                  <SelectValue placeholder="Select Area..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  {managedAreas.map(area => (
                    <SelectItem key={area} value={area.toLowerCase()}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="gap-2 py-1.5"
            onClick={() => setIsAreaManagementOpen(true)}
          >
            <Settings className="size-4" />
            Manage Areas
          </Button>
          <Button
            variant="primary"
            className="w-full gap-2 py-1.5 text-base sm:w-fit sm:text-sm"
            onClick={() => setIsAddDeliveryOpen(true)}
          >
            <Plus className="size-4" />
            Create Delivery Batch
          </Button>
        </div>
      </div>

      <div className="px-4 sm:px-6">
        <div className="border-b border-gray-200 dark:border-gray-800">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              className={`${
                activeTab === "all"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
              onClick={() => setActiveTab("all")}
            >
              All Deliveries
            </button>
            <button
              className={`${
                activeTab === "pending"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
              onClick={() => setActiveTab("pending")}
            >
              Pending
            </button>
            <button
              className={`${
                activeTab === "in progress"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
              onClick={() => setActiveTab("in progress")}
            >
              In Progress
            </button>
            <button
              className={`${
                activeTab === "delivered"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
              onClick={() => setActiveTab("delivered")}
            >
              Delivered
            </button>
          </nav>
        </div>
      </div>

      <TableRoot className="border-t border-gray-200 dark:border-gray-800">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell onClick={() => handleSort('batchId')} className="cursor-pointer">
                <div className="flex items-center gap-2 font-bold">
                  <Package className="size-4" />
                  Batch ID
                  {sortField === 'batchId' && (
                    sortDirection === 'asc' ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />
                  )}
                </div>
              </TableHeaderCell>
              <TableHeaderCell>Orders</TableHeaderCell>
              <TableHeaderCell>Coordinator</TableHeaderCell>
              <TableHeaderCell>Area</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAndPaginatedData.map((delivery) => (
              <TableRow key={delivery.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Truck className="size-5 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{delivery.batchId}</span>
                      <span className="text-sm text-gray-500">{delivery.plannedDate}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{delivery.orders.length} Orders</span>
                    <span className="text-sm text-gray-500">{delivery.customerNames.join(", ")}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="neutral" className="flex w-fit items-center gap-1">
                    <ClipboardCheck className="size-3" />
                    {delivery.coordinator}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="neutral" className="flex w-fit items-center gap-1">
                    <MapPin className="size-3" />
                    {delivery.area}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      delivery.status === "Delivered" ? "success" : 
                      delivery.status === "In Progress" ? "warning" : 
                      "neutral"
                    }
                  >
                    {delivery.status}
                  </Badge>
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
                              setSelectedDelivery(delivery)
                              setIsEditDeliveryOpen(true)
                            }}
                          >
                            <Pencil className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Delivery</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" className="p-2">
                            <MapPinned className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Track Delivery</TooltipContent>
                      </Tooltip>

                      {activeTab === "pending" && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="gap-1"
                          onClick={() => handleStatusUpdate(delivery.id, "in-progress")}
                        >
                          <Clock className="size-4" />
                          Set In Progress
                        </Button>
                      )}

                      {activeTab === "in progress" && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="gap-1"
                          onClick={() => handleStatusUpdate(delivery.id, "delivered")}
                        >
                          <CheckCircle2 className="size-4" />
                          Set Delivered
                        </Button>
                      )}
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableRoot>

      {/* Area Management Dialog */}
      <Dialog open={isAreaManagementOpen} onOpenChange={setIsAreaManagementOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="size-5 text-primary" />
              Area Management
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Add new area..."
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                />
              </div>
              <Button
                variant="primary"
                onClick={() => {
                  if (newArea.trim()) {
                    setManagedAreas([...managedAreas, newArea.trim()])
                    setNewArea("")
                  }
                }}
              >
                <Plus className="size-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {managedAreas.map((area, index) => (
                <div key={index} className="flex items-center justify-between rounded-md border p-2">
                  <div className="flex items-center gap-2">
                    <MapPinned className="size-4 text-primary" />
                    <span>{area}</span>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setManagedAreas(managedAreas.filter((_, i) => i !== index))
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Delivery Dialog */}
      <Dialog open={isAddDeliveryOpen || isEditDeliveryOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDeliveryOpen(false)
          setIsEditDeliveryOpen(false)
          setSelectedDelivery(null)
          setSelectedOrders([])
        }
      }}>
        <DialogContent className="sm:max-w-[1000px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isEditDeliveryOpen ? (
                <>
                  <Pencil className="size-5 text-primary" />
                  Edit Delivery Batch
                </>
              ) : (
                <>
                  <Plus className="size-5 text-primary" />
                  Create Delivery Batch
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-[400px,1fr] gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <Package className="size-4 text-primary" />
                Select Orders
              </label>
              <div className="max-h-[500px] overflow-y-auto rounded-md border border-gray-200 p-4 dark:border-gray-800">
                {Object.entries(groupedOrders).map(([customerName, customerOrders]) => (
                  <div key={customerName} className="mb-4">
                    <h3 className="font-medium mb-2">{customerName}</h3>
                    {customerOrders.map((order) => (
                      <div key={order.id} className="mb-3 flex items-start gap-3 rounded-lg border border-gray-100 p-3 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900">
                        <Checkbox
                          id={order.id}
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedOrders([...selectedOrders, order.id])
                            } else {
                              setSelectedOrders(selectedOrders.filter(id => id !== order.id))
                            }
                          }}
                        />
                        <label htmlFor={order.id} className="flex-1 cursor-pointer">
                          <div className="text-sm text-gray-500">
                            {order.id} • {order.items.length} items
                          </div>
                          <div className="mt-1 text-sm text-gray-500">
                            Total: Rp {order.total.toLocaleString()}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Planned Date</label>
                <div className="relative">
                  <Input type="date" defaultValue={selectedDelivery?.plannedDate} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Area</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
                  <Select defaultValue={selectedDelivery?.area?.toLowerCase()}>
                    <SelectTrigger className="pl-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {managedAreas.map(area => (
                        <SelectItem key={area} value={area.toLowerCase()}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Assign Logistic Coordinator</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
                  <Select defaultValue={selectedDelivery?.coordinator?.toLowerCase()}>
                    <SelectTrigger className="pl-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {coordinators.map(coordinator => (
                        <SelectItem key={coordinator} value={coordinator.toLowerCase()}>
                          {coordinator}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <div className="relative">
                  <AlertCircle className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
                  <Select defaultValue={selectedDelivery?.status?.toLowerCase()}>
                    <SelectTrigger className="pl-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={() => {
              setIsAddDeliveryOpen(false)
              setIsEditDeliveryOpen(false)
              setSelectedDelivery(null)
              setSelectedOrders([])
            }}>
              Cancel
            </Button>
            <Button variant="primary" className="flex items-center gap-2">
              {isEditDeliveryOpen ? (
                <>
                  <Pencil className="size-4" />
                  Update Delivery
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  Create Delivery
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
              <span className="font-medium">{Math.min(currentPage * rowsPerPage, filteredDeliveries.length)}</span> of{' '}
              <span className="font-medium">{filteredDeliveries.length}</span> results
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
    </section>
  )
}
