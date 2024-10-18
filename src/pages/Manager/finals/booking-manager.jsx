'use client';
import { useState, useEffect } from 'react'
import axios from 'axios'
import { format, isValid, parseISO } from 'date-fns'
import {
  Calendar,
  Clock,
  RefreshCw,
  MapPin,
  Phone,
  Mail,
  Tag,
  Info,
  ChevronDown,
  ChevronUp,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000,
})

export default function BookingManagerComponent() {
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedBooking, setExpandedBooking] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    filterBookings()
  }, [bookings, statusFilter])

  const fetchBookings = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.get('/api/booking/list')
      if (Array.isArray(response.data)) {
        setBookings(response.data)
      } else {
        throw new Error('Received invalid data format')
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setError('Failed to fetch bookings. Please try again.')
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
    if (statusFilter === 'all') {
      setFilteredBookings(bookings)
    } else {
      setFilteredBookings(bookings.filter(booking => booking.status === statusFilter))
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No date'
    try {
      const date = parseISO(dateString)
      if (isValid(date)) {
        return format(date, 'MMM dd, yyyy');
      }
    } catch (error) {
      console.error('Error parsing date:', error)
    }
    return 'Invalid Date'
  }

  const toggleBookingDetails = (bookingId) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId)
  }

  return (
    (<div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold">Booking Manager</CardTitle>
              <CardDescription className="text-lg mt-2">
                View and manage all customer bookings in one place. Keep track of dates, times, and statuses efficiently.
              </CardDescription>
            </div>
            <Button onClick={fetchBookings} disabled={isLoading} size="lg">
              <RefreshCw className="mr-2 h-5 w-5" />
              {isLoading ? 'Refreshing...' : 'Refresh Bookings'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="h-32 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8 text-lg">{error}</div>
          ) : filteredBookings.length === 0 ? (
            <p className="text-center text-gray-500 py-8 text-lg">No bookings found for the selected status.</p>
          ) : (
            <ul className="space-y-6">
              {filteredBookings.map((booking) => (
                <li key={booking.id}>
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-semibold">{booking.customerName}</CardTitle>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-gray-500" />
                          <span className="text-sm text-gray-600">Date: {formatDate(booking.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-gray-500" />
                          <span className="text-sm text-gray-600">Time: {booking.time || 'Not specified'}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-gray-500" />
                          <span className="text-sm text-gray-600">Location: {booking.location || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Tag className="h-5 w-5 text-gray-500" />
                          <span className="text-sm text-gray-600">Booking ID: {booking.id}</span>
                        </div>
                      </div>
                    </CardContent>
                    {expandedBooking === booking.id && (
                      <CardContent className="border-t pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Phone className="h-5 w-5 text-gray-500" />
                              <span className="text-sm text-gray-600">Phone: {booking.phone || 'Not provided'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="h-5 w-5 text-gray-500" />
                              <span className="text-sm text-gray-600">Email: {booking.email || 'Not provided'}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-start space-x-2">
                              <Info className="h-5 w-5 text-gray-500 mt-0.5" />
                              <span className="text-sm text-gray-600">Additional Notes: {booking.notes || 'No additional notes'}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    )}
                    <CardFooter className="bg-gray-50 flex justify-end items-center">
                      <Button variant="outline" onClick={() => toggleBookingDetails(booking.id)}>
                        {expandedBooking === booking.id ? (
                          <>
                            <ChevronUp className="mr-2 h-4 w-4" />
                            Hide Details
                          </>
                        ) : (
                          <>
                            <ChevronDown className="mr-2 h-4 w-4" />
                            View Details
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center bg-gray-100">
          <p className="text-sm text-gray-600">Total Bookings: {filteredBookings.length}</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Booking Statistics</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Confirmed: {bookings.filter(b => b.status === 'confirmed').length}</p>
                <p>Pending: {bookings.filter(b => b.status === 'pending').length}</p>
                <p>Cancelled: {bookings.filter(b => b.status === 'cancelled').length}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </Card>
    </div>)
  );
}