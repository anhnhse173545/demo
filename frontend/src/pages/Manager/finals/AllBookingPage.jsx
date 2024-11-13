'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Search, Eye, Loader2, X } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center">
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <Button 
            className="mt-2" 
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
})

export default function AllBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    filterBookings()
  }, [searchTerm, statusFilter, bookings])

  const fetchBookings = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/booking/list')
      const validBookings = response.data.filter(booking => 
        booking && booking.trip && booking.customer
      )
      setBookings(validBookings)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast({
        title: "Error",
        description: "Failed to fetch bookings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterBookings = () => {
    let filtered = bookings

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        (booking.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (booking.trip?.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toString().includes(searchTerm)
      )
    }

    setFilteredBookings(filtered)
  }

  const handleViewDetails = async (bookingId) => {
    try {
      const response = await api.get(`/booking/get/${bookingId}`)
      setSelectedBooking(response.data)
      setIsDialogOpen(true)
    } catch (error) {
      console.error('Error fetching booking details:', error)
      toast({
        title: "Error",
        description: "Failed to fetch booking details. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'success'
      case 'Pending':
        return 'warning'
      case 'Cancelled':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">All Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {/* <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem> */}
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredBookings.length === 0 ? (
              <p className="text-center text-muted-foreground">No bookings found.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Trip</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id}</TableCell>
                        <TableCell>{booking.customer?.name || 'N/A'}</TableCell>
                        <TableCell>{booking.trip?.description || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            {formatDate(booking.trip?.startDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(booking.status)}>
                            {booking.status || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(booking.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected booking.
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="mt-4 space-y-2">
              <p><strong>Booking ID:</strong> {selectedBooking.id}</p>
              <p><strong>Customer:</strong> {selectedBooking.customer?.name}</p>
              <p><strong>Trip:</strong> {selectedBooking.trip?.description}</p>
              <p><strong>Start Date:</strong> {formatDate(selectedBooking.trip?.startDate)}</p>
              <p><strong>End Date:</strong> {formatDate(selectedBooking.trip?.endDate)}</p>
              <p><strong>Status:</strong> 
                <Badge variant={getStatusColor(selectedBooking.status)} className="ml-2">
                  {selectedBooking.status}
                </Badge>
              </p>
              <p><strong>Total Price:</strong> ${selectedBooking.totalPrice}</p>
              <p><strong>Payment Status:</strong> {selectedBooking.paymentStatus}</p>
            </div>
          )}
          <DialogClose asChild>
            <Button className="mt-4">
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  )
}