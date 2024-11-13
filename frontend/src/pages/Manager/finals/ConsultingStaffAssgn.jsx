'use client'

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
import { Search, UserPlus, Calendar, MapPin, Eye, ArrowLeft, User, Phone, Mail, Briefcase } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"
import { Tab } from 'bootstrap'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000,
})

export function ConsultingStaffAssignmentComponent() {
  const [bookings, setBookings] = useState([])
  const [consultingStaff, setConsultingStaff] = useState([])
  const [isAssigning, setIsAssigning] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [selectedStaff, setSelectedStaff] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState('list')

  const fetchConsultingStaff = useCallback(async () => {
    try {
      const response = await api.get('/accounts/Consulting Staff/all')
      setConsultingStaff(response.data)
    } catch (error) {
      console.error('Error fetching consulting staff:', error)
      toast({
        title: "Error",
        description: "Failed to fetch consulting staff. Please try again.",
        variant: "destructive",
      })
    }
  }, [])

  const fetchBookings = useCallback(async () => {
    try {
      const response = await api.get('/api/booking/status/Paid Booking')
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
      await Promise.all([fetchConsultingStaff(), fetchBookings()])
      setIsLoading(false)
    }
    fetchData()
  }, [fetchConsultingStaff, fetchBookings])

  const handleAssignStaff = async () => {
    if (!selectedBooking || !selectedStaff) {
      toast({
        title: "Error",
        description: "Please select a booking and a consulting staff member.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await api.put(`/api/booking/update/${selectedBooking.id}`, {
        trip: selectedBooking.trip,
        description: selectedBooking.description,
        createAt: selectedBooking.createAt,
        tripPayment: selectedBooking.tripPayment,
        status: "Paid Booking",
        saleStaff: selectedBooking.saleStaff,
        consultingStaffId: selectedStaff
      })

      if (response.status === 200) {
        setBookings(prevBookings => prevBookings.map(booking => 
          booking.id === selectedBooking.id 
            ? { ...booking, consultingStaff: consultingStaff.find(staff => staff.id === selectedStaff) }
            : booking
        ))

        setIsAssigning(false)
        setSelectedStaff("")
        toast({
          title: "Success",
          description: "Consulting staff assigned successfully.",
        })
      } else {
        throw new Error(`Unexpected response status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error assigning consulting staff:', error)
      let errorMessage = "Failed to assign consulting staff. Please try again."

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
    (booking.consultingStaff?.name && booking.consultingStaff.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setViewMode('details')
  }

  const handleBackToList = () => {
    setSelectedBooking(null)
    setViewMode('list')
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {viewMode === 'list' ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Consulting Staff Assignment</h2>
          <Card>
            <CardHeader>
              <CardTitle>Paid Bookings</CardTitle>
              <CardDescription>Assign consulting staff to paid bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking Id</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Trip Summary</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Booking Status</TableHead>
                    <TableHead>Consulting Staff</TableHead>
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
                          <Briefcase className="h-4 w-4 mr-1 text-muted-foreground" />
                          {booking.trip.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          {new Date(booking.trip.startDate).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })} to {new Date(booking.trip.endDate).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={booking.status === "Confirmed" ? "success" : "warning"}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {booking.consultingStaff ? (
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage
                                src={booking.consultingStaff.profile_image || `/placeholder.svg?height=32&width=32`}
                                alt={booking.consultingStaff.name}
                              />
                              <AvatarFallback>{booking.consultingStaff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            {booking.consultingStaff.name}
                          </div>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          >
                            Unassigned
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedBooking(booking)
                              setIsAssigning(true)
                            }}
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            {booking.consultingStaff ? "Reassign" : "Assign"}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(booking)}>
                            <Eye className="h-4 w-4 mr-1" />
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
                <DialogTitle>Assign Consulting Staff</DialogTitle>
                <DialogDescription>
                  Select a consulting staff member to assign to {selectedBooking?.customer.name}&apos;s consultation.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="staff" className="text-right">
                    Consulting Staff
                  </Label>
                  <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {consultingStaff.map((staff) => (
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
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Consultation Details</h1>
            <Button variant="outline" size="sm" onClick={handleBackToList}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Consultations
            </Button>
          </div>
          {selectedBooking && (
            <Card>
              <CardHeader>
                <CardTitle>Consultation #{selectedBooking.id}</CardTitle>
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
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Consultation Status</h3>
                      <Badge
                        variant={selectedBooking.status === "Confirmed" ? "success" : "warning"}
                        className="mt-2"
                      >
                        {selectedBooking.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Trip Details</h3>
                      <div className="mt-2 space-y-2">
                        <p className="text-sm text-gray-900 dark:text-gray-100 flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          {selectedBooking.trip?.description || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-900 dark:text-gray-100 flex items-center">
                          <Calendar className="h-4 w-4  mr-2 text-muted-foreground" />
                          {selectedBooking.trip?.startDate && selectedBooking.trip?.endDate ? (
                            <>
                              {new Date(selectedBooking.trip.startDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                              {' - '}
                              {new Date(selectedBooking.trip.endDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </>
                          ) : 'N/A'}
                        </p>
                        <p className="text-sm text-gray-900 dark:text-gray-100 flex items-center">Departure Airport: {selectedBooking.trip?.departureAirport || 'N/A'}</p>
                        <p className="text-sm text-gray-900 dark:text-gray-100 flex items-center">Price: {selectedBooking.trip?.price || 'N/A'}</p>
                        <p className="text-sm text-gray-900 dark:text-gray-100 flex items-center">Status: {selectedBooking.trip?.status || 'N/A'}</p>
                        <p className="text-sm text-gray-900 dark:text-gray-100 flex items-center">
                          Trip Destinations: 
                          {selectedBooking.trip?.tripDestinations && selectedBooking.trip.tripDestinations.length > 0
                            ? selectedBooking.trip.tripDestinations.map((dest, index) => (
                                <span key={index} className="ml-1">
                                  {dest.farm?.name || 'Unknown'}
                                  {index < selectedBooking.trip.tripDestinations.length - 1 ? ', ' : ''}
                                </span>
                              ))
                            : ' N/A'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned Consulting Staff</h3>
                      {selectedBooking.consultingStaff ? (
                        <div className="flex items-center mt-2">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage
                              src={selectedBooking.consultingStaff.profile_image || `/placeholder.svg?height=32&width=32`}
                              alt={selectedBooking.consultingStaff.name}
                            />
                            <AvatarFallback>{selectedBooking.consultingStaff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="text-sm text-gray-900 dark:text-gray-100">{selectedBooking.consultingStaff.name}</span>
                            <p className="text-sm text-gray-900 dark:text-gray-100 flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-muted-foreground" /> {selectedBooking.consultingStaff.phone || 'No additional info'}
                            </p>
                            <p className="text-sm text-gray-900 dark:text-gray-100 flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-muted-foreground" /> {selectedBooking.consultingStaff.email || 'No additional info'}
                            </p>
                            <p className="text-sm text-gray-900 dark:text-gray-100 flex items-center">
                              <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" /> {selectedBooking.consultingStaff.role || 'No additional info'}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <Badge
                          variant="outline"
                          className="mt-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        >
                          Unassigned
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Additional Notes</h3>
                  <p className="mt-2 text-sm text-gray-900 dark:text-gray-100">{selectedBooking.description || 'No additional notes'}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}