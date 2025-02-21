"use client"
import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Download, Edit, Trash2, Send, CreditCard, Clock, StickyNote, Users, UserPlus, ChevronLeft, ChevronRight, Mail, AlertCircle, ChevronUp, ChevronDown } from "lucide-react"
import { useState, useMemo } from "react"

const customers = [
  {
    id: 1,
    name: "Budi Santoso", 
    email: "budi.santoso@example.com",
    avatar: "BS",
    creditLimit: 100000000,
    paymentTerms: 30,
    status: "Active",
    promoNotes: ""
  },
  {
    id: 2,
    name: "Siti Rahayu",
    email: "siti.r@example.com", 
    avatar: "SR",
    creditLimit: 50000000,
    paymentTerms: 15,
    status: "Active",
    promoNotes: ""
  },
  {
    id: 3,
    name: "Ahmad Wijaya",
    email: "ahmad.w@example.com",
    avatar: "AW",
    creditLimit: 25000000,
    paymentTerms: 30,
    status: "Inactive", 
    promoNotes: ""
  }
]

export default function CustomerList() {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isResetOpen, setIsResetOpen] = useState(false)
  const [isCreditOpen, setIsCreditOpen] = useState(false)
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const [isNotesOpen, setIsNotesOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null)
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    creditLimit: 0,
    paymentTerms: 30,
    status: 'Active',
    promoNotes: ''
  })

  // Sorting states
  const [sortField, setSortField] = useState<keyof typeof customers[0]>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const formatCurrency = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const parseCurrency = (value: string) => {
    return parseInt(value.replace(/[^\d]/g, ''))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle customer creation logic here
    setIsOpen(false)
  }

  // Sort function
  const handleSort = (field: keyof typeof customers[0]) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Sort and paginate data
  const sortedAndPaginatedData = useMemo(() => {
    let sortedData = [...customers].sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    const startIndex = (currentPage - 1) * rowsPerPage
    return sortedData.slice(startIndex, startIndex + rowsPerPage)
  }, [customers, sortField, sortDirection, currentPage, rowsPerPage])

  const totalPages = Math.ceil(customers.length / rowsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value))
    setCurrentPage(1)
  }

  return (
    <section aria-label="Customer List">
      <div className="flex items-center gap-2 px-4 py-6 sm:p-6">
        <Users />
        
        <div>
          <h1 className="text-2xl font-semibold">Customer Management</h1>
        </div>
      </div>
      <div className="flex flex-col justify-between -mt-6 gap-2 px-4 py-6 sm:flex-row sm:items-center sm:p-6">
        <div className="flex gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">Search</label>
            <Input
              type="search"
              placeholder="Search customers..."
              className="sm:w-64 [&>input]:py-1.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select>
              <SelectTrigger className="w-full py-1.5 sm:w-44">
                <SelectValue placeholder="Filter Status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="primary"
                className="w-full gap-2 py-1.5 text-base sm:w-fit sm:text-sm"
              >
                <UserPlus className="size-4" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <UserPlus className="size-5" />
                  Add New Customer
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Credit Limit</label>
                  <Input
                    type="text"
                    value={`Rp ${formatCurrency(newCustomer.creditLimit)}`}
                    onChange={(e) => {
                      const value = parseCurrency(e.target.value)
                      setNewCustomer({...newCustomer, creditLimit: value})
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Payment Terms (days)</label>
                  <Input
                    type="number"
                    value={newCustomer.paymentTerms}
                    onChange={(e) => setNewCustomer({...newCustomer, paymentTerms: Number(e.target.value)})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <Select value={newCustomer.status} onValueChange={(value) => setNewCustomer({...newCustomer, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Promotional Notes</label>
                  <Input
                    value={newCustomer.promoNotes}
                    onChange={(e) => setNewCustomer({...newCustomer, promoNotes: e.target.value})}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" type="button" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Add Customer
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              className="w-full gap-2 py-1.5 text-base sm:w-fit sm:text-sm"
            >
              <Download
                className="-ml-0.5 size-4 shrink-0 text-gray-400 dark:text-gray-600"
                aria-hidden="true"
              />
              Export
            </Button>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />
            <Select value={rowsPerPage.toString()} onValueChange={handleRowsPerPageChange}>
              <SelectTrigger className="w-32 py-1.5 sm:w-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <TableRoot className="border-t border-gray-200 dark:border-gray-800">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell onClick={() => handleSort('name')} className="cursor-pointer">
                <div className="flex items-center gap-2 font-bold">
                  <Users className="size-4" />
                  Customer
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />
                  )}
                </div>
              </TableHeaderCell>
              <TableHeaderCell onClick={() => handleSort('email')} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Mail className="size-4" />
                  Email
                  {sortField === 'email' && (
                    sortDirection === 'asc' ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />
                  )}
                </div>
              </TableHeaderCell>
              <TableHeaderCell onClick={() => handleSort('creditLimit')} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <CreditCard className="size-4" />
                  Credit Limit
                  {sortField === 'creditLimit' && (
                    sortDirection === 'asc' ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />
                  )}
                </div>
              </TableHeaderCell>
              <TableHeaderCell onClick={() => handleSort('paymentTerms')} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Clock className="size-4" />
                  Payment Terms
                  {sortField === 'paymentTerms' && (
                    sortDirection === 'asc' ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />
                  )}
                </div>
              </TableHeaderCell>
              <TableHeaderCell onClick={() => handleSort('status')} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-4" />
                  Status
                  {sortField === 'status' && (
                    sortDirection === 'asc' ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />
                  )}
                </div>
              </TableHeaderCell>
              <TableHeaderCell onClick={() => handleSort('promoNotes')} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <StickyNote className="size-4" />
                  Promo Notes
                  {sortField === 'promoNotes' && (
                    sortDirection === 'asc' ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />
                  )}
                </div>
              </TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAndPaginatedData.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 font-bold !text-primary shrink-0 items-center justify-center bg-primary/10 rounded-full text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                      {customer.avatar}
                    </span>
                    <span className="font-bold">{customer.name}</span>
                  </div>
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>Rp {formatCurrency(customer.creditLimit)}</TableCell>
                <TableCell>{customer.paymentTerms} Days</TableCell>
                <TableCell>
                  <Badge
                    variant={customer.status === "Active" ? "success" : "neutral"}
                    className="rounded-full"
                  >
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="line-clamp-1 text-sm text-gray-600 dark:text-gray-400">
                    {customer.promoNotes || "-"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" className="p-2" onClick={() => {
                            setSelectedCustomer(customer)
                            setIsEditOpen(true)
                          }}>
                            <Edit className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Customer</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" className="p-2" onClick={() => {
                            setSelectedCustomer(customer)
                            setIsDeleteOpen(true)
                          }}>
                            <Trash2 className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete Customer</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" className="p-2" onClick={() => {
                            setSelectedCustomer(customer)
                            setIsResetOpen(true)
                          }}>
                            <Send className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Send Password Reset</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" className="p-2" onClick={() => {
                            setSelectedCustomer(customer)
                            setIsCreditOpen(true)
                          }}>
                            <CreditCard className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Manage Credit Limit</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" className="p-2" onClick={() => {
                            setSelectedCustomer(customer)
                            setIsTermsOpen(true)
                          }}>
                            <Clock className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Payment Terms</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" className="p-2" onClick={() => {
                            setSelectedCustomer(customer)
                            setIsNotesOpen(true)
                          }}>
                            <StickyNote className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Promotional notes</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableRoot>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="size-5" />
              Edit Customer
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input defaultValue={selectedCustomer?.name} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input type="email" defaultValue={selectedCustomer?.email} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Credit Limit</label>
              <Input 
                type="text" 
                defaultValue={`Rp ${selectedCustomer?.creditLimit ? formatCurrency(selectedCustomer.creditLimit) : ''}`} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Payment Terms (days)</label>
              <Input type="number" defaultValue={selectedCustomer?.paymentTerms} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select defaultValue={selectedCustomer?.status}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Promotional Notes</label>
              <Input defaultValue={selectedCustomer?.promoNotes} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button variant="primary">Update Customer</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="size-5" />
              Delete Customer
            </DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this customer?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive">Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="size-5" />
              Send Password Reset
            </DialogTitle>
          </DialogHeader>
          <p>Send password reset email to {selectedCustomer?.email}?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={() => setIsResetOpen(false)}>Cancel</Button>
            <Button variant="primary">Send Reset Email</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Credit Limit Dialog */}
      <Dialog open={isCreditOpen} onOpenChange={setIsCreditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="size-5" />
              Manage Credit Limit
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Credit Limit</label>
              <Input 
                type="text" 
                defaultValue={`Rp ${selectedCustomer?.creditLimit ? formatCurrency(selectedCustomer.creditLimit) : ''}`} 
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsCreditOpen(false)}>Cancel</Button>
              <Button variant="primary">Update</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Payment Terms Dialog */}
      <Dialog open={isTermsOpen} onOpenChange={setIsTermsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="size-5" />
              Edit Payment Terms
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Payment Terms (days)</label>
              <Input type="number" defaultValue={selectedCustomer?.paymentTerms} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsTermsOpen(false)}>Cancel</Button>
              <Button variant="primary">Update</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Promotional Notes Dialog */}
      <Dialog open={isNotesOpen} onOpenChange={setIsNotesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <StickyNote className="size-5" />
              Edit Promotional Notes
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Promotional Notes</label>
              <Input defaultValue={selectedCustomer?.promoNotes} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsNotesOpen(false)}>Cancel</Button>
              <Button variant="primary">Update</Button>
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
              <span className="font-medium">{Math.min(currentPage * rowsPerPage, customers.length)}</span> of{' '}
              <span className="font-medium">{customers.length}</span> results
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
