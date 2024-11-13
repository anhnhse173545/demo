import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Search, Eye, Loader2 } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
})

// Error Boundary Component
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false)

  const handleError = (error) => {
    console.error('Error caught by boundary:', error)
    setHasError(true)
  }

  if (hasError) {
    return (
      (<div className="p-4 text-center">
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <Button className="mt-2" onClick={() => setHasError(false)}>
          Try again
        </Button>
      </div>)
    );
  }

  return (
    (<React.ErrorBoundary fallback={<div>Error</div>} onError={handleError}>
      {children}
    </React.ErrorBoundary>)
  );
}

const AllBookingsPage = () => {
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const navigate = useNavigate()

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
      // Filter out any invalid bookings
      const validBookings = response.data.filter(booking => 
        booking && booking.trip && booking.customer)
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
        booking.id.toString().includes(searchTerm))
    }

    setFilteredBookings(filtered)
  }

  const handleViewDetails = (bookingId) => {
    navigate(`/booking/${bookingId}`)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Requested':
        return 'default'
      case 'Pending Quote':
        return 'warning'
      case 'Approved Quote':
        return 'info'
      case 'Paid Booking':
        return 'success'
      case 'On-going':
        return 'primary'
      case 'Order Prepare':
        return 'secondary'
      case 'Completed':
        return 'success'
      default:
        return 'secondary'
    }
  }

  return (
    (<ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">All Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Requested">Requested</SelectItem>
                  <SelectItem value="Pending Quote">Pending Quote</SelectItem>
                  <SelectItem value="Approved Quote">Approved Quote</SelectItem>
                  <SelectItem value="Paid Booking">Paid Booking</SelectItem>
                  <SelectItem value="On-going">On-going</SelectItem>
                  <SelectItem value="Order Prepare">Order Prepare</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
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
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(booking.id)}>
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
    </ErrorBoundary>)
  );
}

export default AllBookingsPage