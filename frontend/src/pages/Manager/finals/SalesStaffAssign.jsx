 
// import './styles/index.css'

import { useState, useEffect, useCallback } from 'react'
import axios, { AxiosError } from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, UserPlus, Calendar, MapPin, Eye, ArrowLeft, User, Phone, Mail } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"

// {
//   "id": "BO0005",
//   "customer": {
//   "id": "AC0001",
//   "name": "C1",
//   "phone": "11",
//   "email": "c@1",
//   "role": "Customer",
//   "profile_image": null
//   },
//   "trip": null,
//   "description": "d1",
//   "createAt": "2024-10-16T16:35:20.454541",
//   "tripPayment": null,
//   "status": "Requested",
//   "saleStaff": {
//   "id": "AC0002",
//   "name": "S1",
//   "phone": "21",
//   "email": "s@1",
//   "role": "Sales Staff",
//   "profile_image": null
//   },
//   "consultingStaff": null,
//   "deliveryStaff": null,
//   "fishOrders": []
//   }

const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000,
})

export function SalesStaffManagementComponent() {
  const [bookings, setBookings] = useState([])
  const [salesStaff, setSalesStaff] = useState([])
  const [isAssigning, setIsAssigning] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [selectedStaff, setSelectedStaff] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState('list') // 'list' or 'details'

  const fetchSalesStaff = useCallback(async () => {
    try {
      const response = await api.get('/accounts/Sales Staff/all')
      setSalesStaff(response.data)
    } catch (error) {
      console.error('Error fetching sales staff:', error)
      toast({
        title: "Error",
        description: "Failed to fetch sales staff. Please try again.",
        variant: "destructive",
      })
    }
  }, [])

  const fetchBookings = useCallback(async () => {
    try {
      const response = await api.get('/api/booking/status/Requested')
      setBookings(response.data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast({
        title: "Error",
        description: "Failed to fetch bookings. Please try again.",
        variant: "destructive",
      })
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      await Promise.all([fetchSalesStaff(), fetchBookings()])
      setIsLoading(false)
    }
    fetchData()
  }, [fetchSalesStaff, fetchBookings])

  const handleAssignStaff = async () => {
    if (!selectedBooking || !selectedStaff) {
      toast({
        title: "Error",
        description: "Please select a booking and a staff member.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await api.put(`/api/booking/update/${selectedBooking.id}`, {
        description: selectedBooking.description,
        
        status: "Requested",
        saleStaffId: selectedStaff
      })

      if (response.status === 200) {
        // Update the local state
        setBookings(prevBookings => prevBookings.map(booking => 
          booking.id === selectedBooking.id 
            ? { ...booking, saleStaff: salesStaff.find(staff => staff.id === selectedStaff) }
            : booking))

        setIsAssigning(false)
        setSelectedStaff("")
        toast({
          title: "Success",
          description: "Sales staff assigned successfully.",
        })
      } else {
        throw new Error(`Unexpected response status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error assigning sales staff:', error)
      let errorMessage = "Failed to assign sales staff. Please try again."

      if (error instanceof AxiosError) {
        if (error.response) {
          errorMessage = `Server error: ${error.response.status}. ${error.response.data.message || ''}`
        } else if (error.request) {
          errorMessage = "No response received from server. Please check your network connection."
        } else {
          errorMessage = error.message
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const filteredBookings = bookings.filter(booking => 
    booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (booking.saleStaff?.name && booking.saleStaff.name.toLowerCase().includes(searchTerm.toLowerCase())))

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setViewMode('details')
  }

  const handleBackToList = () => {
    setSelectedBooking(null)
    setViewMode('list')
  }

  return (
    (<div className="container mx-auto px-4 py-8">
      {viewMode === 'list' ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Sales Staff Assignment</h2>
          <Card>
            <CardHeader>
              <CardTitle>Requested Tours</CardTitle>
              <CardDescription>Assign sales staff to requested tours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by customer, request, or staff..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8" />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking Id</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Request Summary</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Booking Status</TableHead>
                    <TableHead>Sales Staff</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.id}</TableCell>
                      <TableCell className="font-medium">{booking.customer.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                          {booking.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          {new Date(booking.createAt).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={booking.status === "Confirmed" ? "success" : "warning"}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {booking.saleStaff ? (
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage
                                src={booking.saleStaff.profile_image || `/placeholder.svg?height=32&width=32`}
                                alt={booking.saleStaff.name} />
                              <AvatarFallback>{booking.saleStaff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            {booking.saleStaff.name}
                          </div>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Unassigned
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell >
                        <div className="flex space-x-2" style={{ color: 'black' }}>
                          <Button
                              style={{ color: 'black' }}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedBooking(booking)
                              setIsAssigning(true)
                            }}>
                            <UserPlus className="h-4 w-4 mr-1" 
                           />
                            {booking.saleStaff ? "Reassign" : "Assign"}
                          </Button>
                          <Button style={{ color: 'black' }} variant="outline" size="sm" onClick={() => handleViewDetails(booking)}>
                            <Eye className="h-4 w-4 mr-1"
                            style={{ color: 'black' }} />
                            View Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Dialog open={isAssigning} onOpenChange={setIsAssigning}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle >Assign Sales Staff</DialogTitle>
                <DialogDescription>
                  Select a sales staff member to assign to {selectedBooking?.customer.name}&apos;s tour.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="staff" className="text-right">
                    Sales Staff
                  </Label>
                  <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {salesStaff.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAssignStaff}>Assign Staff</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Booking Details</h1>
            <Button style={{ color: 'black' }} variant="outline" size="sm" onClick={handleBackToList}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bookings
            </Button>
          </div>
          {selectedBooking && (
            <Card>
              <CardHeader>
                <CardTitle>Booking #{selectedBooking.id}</CardTitle>
                <CardDescription>Created on {new Date(selectedBooking.createAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer Information</h3>
                      <div className="mt-2 space-y-2">
                        <p className="text-sm text-gray-900 dark:text-gray-100 flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          {selectedBooking.customer.name}
                        </p>
                        <p className="text-sm text-gray-900 dark:text-gray-100 flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          {selectedBooking.customer.phone || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-900 dark:text-gray-100 flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          {selectedBooking.customer.email || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Booking Status</h3>
                      <Badge
                        variant={selectedBooking.status === "Confirmed" ? "success" : "warning"}
                        className="mt-2">
                        {selectedBooking.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Booking Details</h3>
                      <div className="mt-2 space-y-2">
                        <p className="text-sm text-gray-900 dark:text-gray-100 flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          {selectedBooking.description || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-900 dark:text-gray-100 flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {selectedBooking.createAt ? (
                            <>
                              {new Date(selectedBooking.createAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                              
                            </>
                          ) : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned Sales Staff</h3>
                      {selectedBooking.saleStaff ? (
                        <div className="flex items-center mt-2">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage
                              src={selectedBooking.saleStaff.profile_image || `/placeholder.svg?height=32&width=32`}
                              alt={selectedBooking.saleStaff.name} />
                            <AvatarFallback>{selectedBooking.saleStaff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="text-sm text-gray-900 dark:text-gray-100">{selectedBooking.saleStaff.name}</span>
                            <p className="text-sm text-gray-900 dark:text-gray-100 flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" /> {selectedBooking.saleStaff.phone || 'No additional info'}</p>
                            <p className="text-sm text-gray-900 dark:text-gray-100 flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-muted-foreground" /> {selectedBooking.saleStaff.email || 'No additional info'}</p>
                            <p className="text-sm text-gray-900 dark:text-gray-100 flex items-center">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" /> {selectedBooking.saleStaff.role || 'No additional info'}</p>
                          </div>
                        </div>
                      ) : (
                        <Badge
                          variant="outline"
                          className="mt-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          Unassigned
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Booking Description</h3>
                  <p className="mt-2 text-sm text-gray-900 dark:text-gray-100">{selectedBooking.description}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>)
  );
}