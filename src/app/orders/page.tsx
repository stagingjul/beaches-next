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
  DialogDescription,
} from "@/components/ui/dialog"
import { ShoppingCart, Plus, QrCode, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Pencil, Trash2, FileText, DollarSign, CheckCircle2, XCircle, Receipt, CreditCard, Building2, CalendarDays, ClipboardList, PackageCheck, Truck, Store, AlertCircle } from "lucide-react"
import { useState, useMemo } from "react"

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

export default function OrderManagement() {
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false)
  const [isEditOrderOpen, setIsEditOrderOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null)
  const [isConfirmDelete, setIsConfirmDelete] = useState(false)
  const [showDeliveryOptions, setShowDeliveryOptions] = useState(false)

  // Sorting states
  const [sortField, setSortField] = useState<keyof typeof orders[0]>('orderDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  
  // Pagination states  
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleSort = (field: keyof typeof orders[0]) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedAndPaginatedData = useMemo(() => {
    let sortedData = [...orders].sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    const startIndex = (currentPage - 1) * rowsPerPage
    return sortedData.slice(startIndex, startIndex + rowsPerPage)
  }, [orders, sortField, sortDirection, currentPage, rowsPerPage])

  const totalPages = Math.ceil(orders.length / rowsPerPage)

  return (
    <section aria-label="Order Management" className="dark:bg-gray-900 min-h-screen">
      <div className="flex items-center gap-2 px-4 py-6 sm:p-6">
        <ShoppingCart className="size-5" />
        <h1 className="text-2xl font-semibold">Order Management</h1>
      </div>

      <div className="flex flex-col justify-between gap-4 p-6 bg-white dark:bg-gray-800 -mt-4 border-b dark:border-gray-700">
        <div className="flex flex-wrap gap-4">
        <div>
            <label className="block text-sm font-medium mb-1">Search</label>
            <Input
              type="search"
              placeholder="Search users..."
              className="sm:w-64"
            />
          </div>
          
          <div className="w-48">
            <label className="block text-sm font-medium mb-1.5">Order Status</label>
            <Select>
              <SelectTrigger className="w-full py-2">
                <SelectValue placeholder="Filter Status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {orderStatuses.map(status => (
                  <SelectItem key={status} value={status.toLowerCase()}>
                    <div className="flex items-center gap-2">
                      {status === "Pending Approval" && <AlertCircle className="size-4" />}
                      {status === "Approved" && <CheckCircle2 className="size-4" />}
                      {status === "Processing" && <PackageCheck className="size-4" />}
                      {status === "Ready for Delivery" && <Truck className="size-4" />}
                      {status === "Delivered" && <Store className="size-4" />}
                      {status === "Cancelled" && <XCircle className="size-4" />}
                      {status}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-48">
            <label className="block text-sm font-medium mb-1.5">Payment Status</label>
            <Select>
              <SelectTrigger className="w-full py-2">
                <SelectValue placeholder="Payment Status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                {paymentStatuses.map(status => (
                  <SelectItem key={status} value={status.toLowerCase()}>
                    <div className="flex items-center gap-2">
                      <DollarSign className="size-4" />
                      {status}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-none">
            <label className="block text-sm font-medium mb-1.5">Actions</label>
            <Button
              variant="primary"
              className="gap-2 py-2 px-4 font-medium"
              onClick={() => setIsAddOrderOpen(true)}
            >
              <Plus className="size-4" />
              New Order
            </Button>
          </div>
        </div>
      </div>

      <TableRoot className="bg-white dark:bg-gray-800">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell onClick={() => handleSort('id')} className="cursor-pointer">
                <div className="flex items-center gap-2 font-bold">
                  <FileText className="size-4" />
                  Order ID
                  {sortField === 'id' && (
                    sortDirection === 'asc' ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />
                  )}
                </div>
              </TableHeaderCell>
              <TableHeaderCell>
                <div className="flex items-center gap-2">
                  <Building2 className="size-4" />
                  Customer
                </div>
              </TableHeaderCell>
              <TableHeaderCell>
                <div className="flex items-center gap-2">
                  <ClipboardList className="size-4" />
                  Status
                </div>
              </TableHeaderCell>
              <TableHeaderCell>
                <div className="flex items-center gap-2">
                  <CreditCard className="size-4" />
                  Payment
                </div>
              </TableHeaderCell>
              <TableHeaderCell>
                <div className="flex items-center gap-2">
                  <DollarSign className="size-4" />
                  Total
                </div>
              </TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAndPaginatedData.map((order) => (
              <TableRow key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold">{order.id}</span>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <CalendarDays className="size-3" />
                      {new Date(order.orderDate).toLocaleDateString()}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 -ml-1">
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="size-4 text-primary" />
                    </div>
                    <span className="font-medium">{order.customerName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      order.status === "Approved" ? "success" :
                      order.status === "Pending Approval" ? "warning" :
                      order.status === "Cancelled" ? "error" : "neutral"
                    }
                    className="flex w-fit items-center gap-1.5"
                  >
                    {order.status === "Approved" && <CheckCircle2 className="size-3.5" />}
                    {order.status === "Pending Approval" && <AlertCircle className="size-3.5" />}
                    {order.status === "Processing" && <PackageCheck className="size-3.5" />}
                    {order.status === "Cancelled" && <XCircle className="size-3.5" />}
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      order.paymentStatus === "Paid" ? "success" :
                      order.paymentStatus === "Pending Verification" ? "warning" :
                      order.paymentStatus === "Overdue" ? "error" : "neutral"
                    }
                    className="flex w-fit items-center gap-1.5"
                  >
                    <DollarSign className="size-3.5" />
                    {order.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-medium">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0
                    }).format(order.total)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="p-2 hover:bg-primary/10 hover:text-primary"
                            onClick={() => {
                              setSelectedOrder(order)
                              setIsEditOrderOpen(true)
                            }}
                          >
                            <Pencil className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Order</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="p-2 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20"
                          >
                            <Receipt className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View Invoice</TooltipContent>
                      </Tooltip>

                      {order.status === "Pending Approval" && (
                        <>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                className="p-2 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20"
                              >
                                <CheckCircle2 className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Approve Order</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                className="p-2 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                              >
                                <XCircle className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Reject Order</TooltipContent>
                          </Tooltip>
                        </>
                      )}
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableRoot>

      {/* Add/Edit Order Dialog */}
      <Dialog 
        open={isAddOrderOpen || isEditOrderOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setIsAddOrderOpen(false)
            setIsEditOrderOpen(false)
            setSelectedOrder(null)
            setShowDeliveryOptions(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {isEditOrderOpen ? (
                <>
                  <Pencil className="size-5 text-primary" />
                  Edit Order {selectedOrder?.id}
                </>
              ) : (
                <>
                  <ShoppingCart className="size-5 text-primary" />
                  Create New Order
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {isEditOrderOpen 
                ? "Update the order details below"
                : "Fill in the order information to create a new order"
              }
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Customer *</label>
                <Select defaultValue={selectedOrder?.customerName} className="w-full">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select customer..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beach-club">
                      <div className="flex items-center gap-2">
                        <Building2 className="size-4" />
                        Beach Club Canggu
                      </div>
                    </SelectItem>
                    <SelectItem value="la-brisa">
                      <div className="flex items-center gap-2">
                        <Building2 className="size-4" />
                        La Brisa
                      </div>
                    </SelectItem>
                    <SelectItem value="single-fin">
                      <div className="flex items-center gap-2">
                        <Building2 className="size-4" />
                        Single Fin
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Payment Method *</label>
                <Select defaultValue={selectedOrder?.paymentMethod.toLowerCase()} className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method..." />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map(method => (
                      <SelectItem key={method} value={method.toLowerCase()}>
                        <div className="flex items-center gap-2">
                          {method.includes("Transfer") && <Building2 className="size-4" />}
                          {method.includes("Card") && <CreditCard className="size-4" />}
                          {method.includes("QR") && <QrCode className="size-4" />}
                          {method}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Payment Due Date</label>
                <Input 
                  type="date"
                  defaultValue={selectedOrder?.paymentDue.split('T')[0]}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Order Items *</label>
                <div className="space-y-2">
                  {(selectedOrder?.items || []).map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                      <Select className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select product..." defaultValue={item.name} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pale-ale">Pale Ale</SelectItem>
                          <SelectItem value="cerveza">Cerveza</SelectItem>
                          <SelectItem value="lager">Lager</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input 
                        type="number" 
                        defaultValue={item.quantity} 
                        placeholder="Qty"
                        min="1"
                        className="w-20" 
                      />
                      <Input 
                        type="number"
                        defaultValue={item.price}
                        placeholder="Price"
                        min="0"
                        className="w-32"
                      />
                      <Button 
                        variant="ghost" 
                        className="p-2 hover:bg-red-50 hover:text-red-600"
                        onClick={() => setIsConfirmDelete(true)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="secondary" className="w-full gap-2">
                    <Plus className="size-4" />
                    Add Item
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Notes</label>
                <Textarea 
                  placeholder="Add any special instructions or notes..." 
                  className="h-[120px]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t pt-6 mt-6">
            <div className="text-sm text-gray-500">
              * Required fields
            </div>
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setIsAddOrderOpen(false)
                  setIsEditOrderOpen(false)
                  setSelectedOrder(null)
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" className="flex items-center gap-2">
                {isEditOrderOpen ? (
                  <>
                    <Pencil className="size-4" />
                    Update Order
                  </>
                ) : (
                  <>
                    <ShoppingCart className="size-4" />
                    Create Order
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={isConfirmDelete} onOpenChange={setIsConfirmDelete}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="size-5" />
              Confirm Delete
            </DialogTitle>
          </DialogHeader>
          
          <p className="py-4">Are you sure you want to remove this item? This action cannot be undone.</p>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" className="gap-2">
              <Trash2 className="size-4" />
              Delete Item
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-1 justify-between sm:hidden">
          <Button 
            variant="secondary" 
            className="flex items-center gap-1"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>
          <Button 
            variant="secondary" 
            className="flex items-center gap-1"
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
              <span className="font-medium">{Math.min(currentPage * rowsPerPage, orders.length)}</span> of{' '}
              <span className="font-medium">{orders.length}</span> results
            </p>
          </div>

          <div>
            <nav className="isolate inline-flex gap-1 rounded-md" aria-label="Pagination">
              <Button 
                variant="secondary" 
                className="flex items-center gap-1"
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
                  className="px-4"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button 
                variant="secondary" 
                className="flex items-center gap-1"
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
