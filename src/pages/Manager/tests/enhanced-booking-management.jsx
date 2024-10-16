'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { format, parseISO } from 'date-fns'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  AlertCircle,
  CheckCircle,
  Calendar as CalendarIcon,
  Trash2,
  Download,
  Search,
  ArrowUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils"

const API_BASE_URL = 'http://localhost:8081/api'

const colorClasses = {
  primary: "bg-blue-500 hover:bg-blue-600 text-white",
  secondary: "bg-purple-500 hover:bg-purple-600 text-white",
  success: "bg-green-500 hover:bg-green-600 text-white",
  danger: "bg-red-500 hover:bg-red-600 text-white",
  warning: "bg-yellow-500 hover:bg-yellow-600 text-black",
  info: "bg-cyan-500 hover:bg-cyan-600 text-white",
}

export function EnhancedBookingManagementComponent() {
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [newBooking, setNewBooking] = useState({ customerId: '', description: '' })
  const [newTrip, setNewTrip] = useState({
    startDate: '',
    endDate: '',
    departureAirport: '',
    price: 0,
    description: ''
  })
  const [updateBooking, setUpdateBooking] = useState({
    tripId: '',
    description: '',
    status: '',
    saleStaffId: '',
    consultingStaffId: '',
    deliveryStaffId: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortField, setSortField] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [dateRange, setDateRange] = useState({ from: null, to: null })
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [deleteConfirmation, setDeleteConfirmation] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    filterAndSortBookings()
  }, [bookings, searchQuery, statusFilter, sortField, sortOrder, dateRange, priceRange])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/booking/list`)
      setBookings(response.data)
      setSuccess('Bookings fetched successfully')
    } catch (error) {
      setError('Error fetching bookings: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortBookings = () => {
    let filtered = bookings.filter(booking => 
      (statusFilter === 'all' || booking.status === statusFilter) &&
      ((booking.description && booking.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
       (booking.customerId && booking.customerId.toLowerCase().includes(searchQuery.toLowerCase()))) &&
      (!dateRange.from || (booking.createdAt && new Date(booking.createdAt) >= dateRange.from)) &&
      (!dateRange.to || (booking.createdAt && new Date(booking.createdAt) <= dateRange.to)) &&
      (!priceRange.min || (booking.trip && booking.trip.price >= parseFloat(priceRange.min))) &&
      (!priceRange.max || (booking.trip && booking.trip.price <= parseFloat(priceRange.max))))

    filtered.sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    })

    setFilteredBookings(filtered)
  }

  const createBooking = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/booking/create`, newBooking)
      setBookings([...bookings, response.data])
      setNewBooking({ customerId: '', description: '' })
      setSuccess('Booking created successfully')
    } catch (error) {
      setError('Error creating booking: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingHandler = async () => {
    if (!selectedBooking) return
    setLoading(true)
    try {
      const response = await axios.put(`${API_BASE_URL}/booking/update/${selectedBooking.id}`, updateBooking)
      setBookings(bookings.map(b => b.id === selectedBooking.id ? response.data : b))
      setSelectedBooking(response.data)
      setSuccess('Booking updated successfully')
    } catch (error) {
      setError('Error updating booking: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const createTrip = async () => {
    if (!selectedBooking) return
    setLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/booking/${selectedBooking.id}/create-trip`, newTrip)
      setSelectedBooking({ ...selectedBooking, trip: response.data })
      setSuccess('Trip created successfully')
    } catch (error) {
      setError('Error creating trip: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteBooking = async (id) => {
    setLoading(true)
    try {
      await axios.delete(`${API_BASE_URL}/booking/delete/${id}`)
      setBookings(bookings.filter(b => b.id !== id))
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking(null)
      }
      setSuccess('Booking deleted successfully')
    } catch (error) {
      setError('Error deleting booking: ' + error.message)
    } finally {
      setLoading(false)
      setDeleteConfirmation(null)
    }
  }

  const exportBookings = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Customer ID,Description,Status,Created At,Trip Start Date,Trip End Date,Trip Price\n"
      + filteredBookings.map(b => 
          `${b.id},${b.customerId},${b.description},${b.status},${b.createdAt},${b.trip?.startDate || ''},${b.trip?.endDate || ''},${b.trip?.price || ''}`).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "bookings.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusBadge = (status) => {
    const statusStyles = {
      confirmed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
    }
    return <Badge className={statusStyles[status] || "bg-gray-100 text-gray-800"}>{status}</Badge>;
  }

  const renderPagination = () => {
    const pageCount = Math.ceil(filteredBookings.length / itemsPerPage)
    const pages = []
    for (let i = 1; i <= pageCount; i++) {
      pages.push(<Button
        key={i}
        onClick={() => setCurrentPage(i)}
        variant={currentPage === i ? "default" : "outline"}
        size="sm"
        className="mx-1">
        {i}
      </Button>)
    }
    return <div className="flex justify-center mt-4">{pages}</div>;
  }

  const paginatedBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    (<div
      className="container mx-auto p-4 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">Enhanced Booking Management</h1>
      {loading && <p className="text-blue-500 text-center animate-pulse">Loading...</p>}
      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
          role="alert">
          <div className="flex">
            <AlertCircle className="h-6 w-6 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}
      {success && (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4"
          role="alert">
          <div className="flex">
            <CheckCircle className="h-6 w-6 mr-2" />
            <span>{success}</span>
          </div>
        </div>
      )}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Booking Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold">Total Bookings</h3>
              <p className="text-2xl">{bookings.length}</p>
            </div>
            <div>
              <h3 className="font-semibold">Confirmed Bookings</h3>
              <p className="text-2xl">{bookings.filter(b => b.status === 'confirmed').length}</p>
            </div>
            <div>
              <h3 className="font-semibold">Pending Bookings</h3>
              <p className="text-2xl">{bookings.filter(b => b.status === 'pending').length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-wrap gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search bookings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !dateRange.from && !dateRange.to && "text-muted-foreground"
              )}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                "Pick a date range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2} />
          </PopoverContent>
        </Popover>
        <Input
          type="number"
          placeholder="Min price"
          value={priceRange.min}
          onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
          className="w-24" />
        <Input
          type="number"
          placeholder="Max price"
          value={priceRange.max}
          onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
          className="w-24" />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={exportBookings} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export bookings as CSV</p>
            </TooltipContent>
          
          </Tooltip>
        </TooltipProvider>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Booking List</CardTitle>
          <CardDescription>Manage your bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSortField('createdAt')
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                    }}>
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSortField('trip.price')
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                    }}>
                    Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBookings.map(booking => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>{booking.customerId}</TableCell>
                  <TableCell>{booking.createdAt ? format(parseISO(booking.createdAt), 'PP') : 'N/A'}</TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell>{booking.trip ? `$${booking.trip.price}` : 'N/A'}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => setSelectedBooking(booking)}
                            variant="outline"
                            size="sm"
                            className="mr-2">
                            <Search className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View Details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => setDeleteConfirmation(booking.id)}
                            variant="outline"
                            size="sm"
                            className="bg-red-100 hover:bg-red-200">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete Booking</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {renderPagination()}
        </CardContent>
      </Card>
      <Dialog
        open={!!deleteConfirmation}
        onOpenChange={() => setDeleteConfirmation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmation(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteBooking(deleteConfirmation)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {selectedBooking && (
        <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Booking Information</h3>
                <p><strong>ID:</strong> {selectedBooking.id}</p>
                <p><strong>Customer ID:</strong> {selectedBooking.customerId}</p>
                <p><strong>Description:</strong> {selectedBooking.description}</p>
                <p><strong>Status:</strong> {getStatusBadge(selectedBooking.status)}</p>
                <p><strong>Created At:</strong> {selectedBooking.createdAt ? format(parseISO(selectedBooking.createdAt), 'PPpp') : 'N/A'}</p>
              </div>
              {selectedBooking.trip && (
                <div>
                  <h3 className="font-semibold">Trip Information</h3>
                  <p><strong>Start Date:</strong> {selectedBooking.trip.startDate ? format(parseISO(selectedBooking.trip.startDate), 'PP') : 'N/A'}</p>
                  <p><strong>End Date:</strong> {selectedBooking.trip.endDate ? format(parseISO(selectedBooking.trip.endDate), 'PP') : 'N/A'}</p>
                  <p><strong>Departure Airport:</strong> {selectedBooking.trip.departureAirport || 'N/A'}</p>
                  <p><strong>Price:</strong> ${selectedBooking.trip.price || 'N/A'}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>)
  );
}