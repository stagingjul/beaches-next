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
} from "@/components/ui/dialog"
import { Download, CreditCard, Clock, Users, ChevronLeft, ChevronRight, AlertCircle, ChevronUp, ChevronDown } from "lucide-react"
import { useState, useMemo } from "react"

// Default global values
const DEFAULT_CREDIT_LIMIT = 50000000 // 50 million
const DEFAULT_PAYMENT_TERMS = 30 // 30 days

const customers = [
  {
    id: 1,
    name: "Budi Santoso", 
    email: "budi.santoso@example.com",
    avatar: "BS",
    creditLimit: 100000000,
    paymentTerms: 30,
    creditUtilization: 75000000,
    overdueInvoices: 0
  },
  {
    id: 2,
    name: "Siti Rahayu",
    email: "siti.r@example.com", 
    avatar: "SR",
    creditLimit: 50000000,
    paymentTerms: 15,
    creditUtilization: 45000000,
    overdueInvoices: 1
  },
  {
    id: 3,
    name: "Ahmad Wijaya",
    email: "ahmad.w@example.com",
    avatar: "AW",
    creditLimit: 25000000,
    paymentTerms: 30,
    creditUtilization: 20000000,
    overdueInvoices: 2
  }
]

export default function CustomerList() {
  const [isGlobalSettingsOpen, setIsGlobalSettingsOpen] = useState(false)
  const [isCreditOpen, setIsCreditOpen] = useState(false)
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null)
  const [globalSettings, setGlobalSettings] = useState({
    defaultCreditLimit: DEFAULT_CREDIT_LIMIT,
    defaultPaymentTerms: DEFAULT_PAYMENT_TERMS
  })

  // Sorting states
  const [sortField, setSortField] = useState<keyof typeof customers[0]>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const formatCurrency = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const parseCurrency = (value: string) => {
    return parseInt(value.replace(/[^\d]/g, ''))
  }

  const getCreditStatus = (customer: typeof customers[0]) => {
    const utilization = (customer.creditUtilization / customer.creditLimit) * 100
    if (utilization >= 90) return "critical"
    if (utilization >= 75) return "warning" 
    return "good"
  }

  const handleSort = (field: keyof typeof customers[0]) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

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
        <CreditCard />
        
        <div>
          <h1 className="text-2xl font-semibold">Credit Management</h1>
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
            <label className="block text-sm font-medium mb-1">Credit Status</label>
            <Select>
              <SelectTrigger className="w-full py-1.5 sm:w-44">
                <SelectValue placeholder="Filter Status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="good">Good Standing</SelectItem>
                <SelectItem value="warning">Near Limit</SelectItem>
                <SelectItem value="critical">Over Limit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <Dialog>
            <Button
              variant="primary"
              className="w-full gap-2 py-1.5 text-base sm:w-fit sm:text-sm"
              onClick={() => setIsGlobalSettingsOpen(true)}
            >
              <CreditCard className="size-4" />
              Global Credit Settings
            </Button>
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
              Export Credit Report
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
              <TableHeaderCell onClick={() => handleSort('creditLimit')} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <CreditCard className="size-4" />
                  Credit Limit
                  {sortField === 'creditLimit' && (
                    sortDirection === 'asc' ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />
                  )}
                </div>
              </TableHeaderCell>
              <TableHeaderCell>
                <div className="flex items-center gap-2">
                  Credit Utilization
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
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAndPaginatedData.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-start gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                      {customer.avatar}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-bold">{customer.name}</span>
                      <span className="text-sm text-gray-500">{customer.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>Rp {formatCurrency(customer.creditLimit)}</TableCell>
                <TableCell>
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col gap-1">

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold tracking-tight">
                          Rp{formatCurrency(customer.creditUtilization)}
                        </span>
                      </div>

                      <span className="text-xs text-gray-500">
                        From Total Limit <strong className={'font-bold'}>Rp{formatCurrency(customer.creditLimit)}</strong>
                      </span>
                    </div>

                            <div className="w-full bg-gray-200 rounded-full h-2 mt-4 overflow-hidden">
                              <div 
                                className={`h-2 rounded-full animate-pulse ${
                                  getCreditStatus(customer) === 'critical' ? 'bg-red-400' :
                                  getCreditStatus(customer) === 'warning' ? 'bg-amber-300' :
                                  'bg-green-500'
                                }`}
                                style={{
                                  width: `${(customer.creditUtilization / customer.creditLimit) * 100}%`,
                                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                                }}
                              />
                            </div>

                      <span className="text-xs font-medium text-gray-600">
                        {((customer.creditUtilization / customer.creditLimit) * 100).toFixed(1)}%
                      </span>
                    </div>

                  </div>
                </TableCell>
                <TableCell>{customer.paymentTerms} Days</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <TooltipProvider delayDuration={0}>
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
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableRoot>

      {/* Global Credit Settings Dialog */}
      <Dialog open={isGlobalSettingsOpen} onOpenChange={setIsGlobalSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="size-5" />
              Global Credit Settings
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Default Credit Limit</label>
              <Input 
                type="text" 
                value={`Rp ${formatCurrency(globalSettings.defaultCreditLimit)}`}
                onChange={(e) => {
                  const value = parseCurrency(e.target.value)
                  setGlobalSettings({...globalSettings, defaultCreditLimit: value})
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Default Payment Terms (days)</label>
              <Input 
                type="number"
                value={globalSettings.defaultPaymentTerms}
                onChange={(e) => setGlobalSettings({...globalSettings, defaultPaymentTerms: Number(e.target.value)})}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsGlobalSettingsOpen(false)}>Cancel</Button>
              <Button variant="primary">Update Global Settings</Button>
            </div>
          </form>
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
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Current Credit Utilization</label>
              <div className="mt-2 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                <div className="flex flex-col gap-1 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Used</span>
                    <span className="text-lg font-bold tracking-tight">
                      Rp {selectedCustomer ? formatCurrency(selectedCustomer.creditUtilization) : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">From Total Limit</span>
                    <span className="text-sm text-gray-500">
                      Rp {selectedCustomer ? formatCurrency(selectedCustomer.creditLimit) : 0}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      selectedCustomer && getCreditStatus(selectedCustomer) === 'critical' ? 'bg-red-500' :
                      selectedCustomer && getCreditStatus(selectedCustomer) === 'warning' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{width: selectedCustomer ? `${(selectedCustomer.creditUtilization / selectedCustomer.creditLimit) * 100}%` : '0%'}}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>{selectedCustomer ? `${((selectedCustomer.creditUtilization / selectedCustomer.creditLimit) * 100).toFixed(1)}%` : '0%'}</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Credit Limit</label>
              <Input 
                type="text" 
                defaultValue={`Rp ${selectedCustomer?.creditLimit ? formatCurrency(selectedCustomer.creditLimit) : ''}`} 
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsCreditOpen(false)}>Cancel</Button>
              <Button variant="primary">Update Credit Limit</Button>
            </div>
          </div>
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
              <Button variant="primary">Update Terms</Button>
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
