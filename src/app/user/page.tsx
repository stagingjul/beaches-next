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
import { Users, Shield, UserCog, Plus, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Pencil, Trash2, Key, Settings2, AlertCircle, UserPlus, ShieldCheck, UserCheck } from "lucide-react"
import { useState, useMemo } from "react"

const users = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Super Admin",
    status: "Active",
    permissions: ["all"],
    lastLogin: "2024-03-10T08:30:00"
  },
  {
    id: 2, 
    name: "Sarah Finance",
    email: "sarah.finance@example.com",
    role: "Finance Admin",
    status: "Active",
    permissions: ["finance.view", "finance.edit", "payments.manage"],
    lastLogin: "2024-03-09T16:45:00"
  },
  {
    id: 3,
    name: "Mike Sales",
    email: "mike.sales@example.com", 
    role: "Sales Admin",
    status: "Active",
    permissions: ["orders.view", "orders.approve", "customers.manage"],
    lastLogin: "2024-03-10T09:15:00"
  }
]

const roles = [
  {
    name: "Super Admin",
    description: "Full system access with ability to manage all aspects of the platform",
    permissions: ["all"],
    icon: Shield
  },
  {
    name: "Finance Admin", 
    description: "Manage financial operations, invoicing and payment processing",
    permissions: ["finance.view", "finance.edit", "payments.manage"],
    icon: UserCog
  },
  {
    name: "Sales Admin",
    description: "Handle customer orders and sales operations",
    permissions: ["orders.view", "orders.approve", "customers.manage"],
    icon: UserCheck
  },
  {
    name: "Logistics Coordinator",
    description: "Manage delivery planning and logistics operations",
    permissions: ["logistics.plan", "logistics.view"],
    icon: ShieldCheck
  },
  {
    name: "Logistics Courier",
    description: "Handle deliveries and update delivery statuses",
    permissions: ["deliveries.update", "deliveries.view"],
    icon: UserPlus
  }
]

export default function UserManagement() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null)

  // Sorting states
  const [sortField, setSortField] = useState<keyof typeof users[0]>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleSort = (field: keyof typeof users[0]) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedAndPaginatedData = useMemo(() => {
    let sortedData = [...users].sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    const startIndex = (currentPage - 1) * rowsPerPage
    return sortedData.slice(startIndex, startIndex + rowsPerPage)
  }, [users, sortField, sortDirection, currentPage, rowsPerPage])

  const totalPages = Math.ceil(users.length / rowsPerPage)

  return (
    <section aria-label="User Management">
      <div className="flex items-center gap-2 px-4 py-6 sm:p-6">
        <Users className="size-5" />
        <h1 className="text-2xl font-semibold">User & Role Management</h1>
      </div>

      <div className="flex flex-col justify-between -mt-6 gap-2 px-4 py-6 sm:flex-row sm:items-center sm:p-6">
        <div className="flex gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">Search</label>
            <Input
              type="search"
              placeholder="Search users..."
              className="sm:w-64 [&>input]:py-1.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <Select>
              <SelectTrigger className="w-full py-1.5 sm:w-44">
                <SelectValue placeholder="Filter Role..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role.name} value={role.name.toLowerCase()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          variant="primary"
          className="w-full gap-2 py-1.5 text-base sm:w-fit sm:text-sm"
          onClick={() => setIsAddUserOpen(true)}
        >
          <Plus className="size-4" />
          Add New User
        </Button>
      </div>

      <TableRoot className="border-t border-gray-200 dark:border-gray-800">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell onClick={() => handleSort('name')} className="cursor-pointer">
                <div className="flex items-center gap-2 font-bold">
                  <Users className="size-4" />
                  User Name
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />
                  )}
                </div>
              </TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Last Login</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAndPaginatedData.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-lg font-medium text-primary">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-sm text-gray-500">{user.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="neutral" className="flex w-fit items-center gap-1">
                    <Shield className="size-3" />
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === "Active" ? "success" : "error"}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-500">
                    {new Date(user.lastLogin).toLocaleString()}
                  </span>
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
                              setSelectedUser(user)
                              setIsEditUserOpen(true)
                            }}
                          >
                            <Pencil className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit User</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" className="p-2">
                            <Key className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Reset Password</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" className="p-2 text-red-500">
                            <Trash2 className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete User</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableRoot>

      {/* Add/Edit User Dialog */}
      <Dialog open={isAddUserOpen || isEditUserOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddUserOpen(false)
          setIsEditUserOpen(false)
          setSelectedUser(null)
        }
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isEditUserOpen ? (
                <>
                  <Settings2 className="size-5 text-primary" />
                  Edit User
                </>
              ) : (
                <>
                  <UserPlus className="size-5 text-primary" />
                  Add New User
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input defaultValue={selectedUser?.name} />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <Input type="email" defaultValue={selectedUser?.email} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input type="password" placeholder={isEditUserOpen ? "Leave blank to keep current" : "Enter password"} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">User Role</label>
              <Select defaultValue={selectedUser?.role?.toLowerCase()}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem 
                      key={role.name} 
                      value={role.name.toLowerCase()}
                    >
                      <div className="flex items-center gap-2">
                        <role.icon className="size-4" />
                        <div className="flex flex-col items-start">
                          <span>{role.name}</span>
                          <span className="text-xs text-gray-500">{role.description}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select defaultValue={selectedUser?.status?.toLowerCase()}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={() => {
              setIsAddUserOpen(false)
              setIsEditUserOpen(false)
              setSelectedUser(null)
            }}>
              Cancel
            </Button>
            <Button variant="primary" className="flex items-center gap-2">
              {isEditUserOpen ? (
                <>
                  <Settings2 className="size-4" />
                  Update User
                </>
              ) : (
                <>
                  <UserPlus className="size-4" />
                  Create User
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
              <span className="font-medium">{Math.min(currentPage * rowsPerPage, users.length)}</span> of{' '}
              <span className="font-medium">{users.length}</span> results
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
