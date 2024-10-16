'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle, Plane, Calendar, DollarSign, MapPin, Plus, Trash2 } from "lucide-react"

const API_BASE_URL = 'http://localhost:8081/api'

const colorClasses = {
  primary: "bg-blue-500 hover:bg-blue-600 text-white",
  secondary: "bg-purple-500 hover:bg-purple-600 text-white",
  success: "bg-green-500 hover:bg-green-600 text-white",
  danger: "bg-red-500 hover:bg-red-600 text-white",
  warning: "bg-yellow-500 hover:bg-yellow-600 text-black",
  info: "bg-cyan-500 hover:bg-cyan-600 text-white",
}

export function BookingManagementJsx() {
  const [bookings, setBookings] = useState([])
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

  useEffect(() => {
    fetchBookings()
  }, [])

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

  const removeOrderFromBooking = async (orderId) => {
    if (!selectedBooking) return
    setLoading(true)
    try {
      const response = await axios.put(
        `${API_BASE_URL}/booking/${selectedBooking.id}/remove-fish-order-from-booking/${orderId}`
      )
      setSelectedBooking(response.data)
      setSuccess('Order removed successfully')
    } catch (error) {
      setError('Error removing order from booking: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const addOrderToBooking = async (orderId) => {
    if (!selectedBooking) return
    setLoading(true)
    try {
      const response = await axios.put(
        `${API_BASE_URL}/booking/${selectedBooking.id}/add-fish-order-to-booking/${orderId}`
      )
      setSelectedBooking(response.data)
      setSuccess('Order added successfully')
    } catch (error) {
      setError('Error adding order to booking: ' + error.message)
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
    }
  }

  return (
    (<div
      className="container mx-auto p-4 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">Booking Management</h1>
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
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4 bg-white p-1 rounded-lg shadow-md">
          <TabsTrigger
            value="list"
            className={`${colorClasses.primary} px-4 py-2 rounded-md mr-2`}>Booking List</TabsTrigger>
          <TabsTrigger
            value="create"
            className={`${colorClasses.secondary} px-4 py-2 rounded-md mr-2`}>Create Booking</TabsTrigger>
          <TabsTrigger
            value="update"
            className={`${colorClasses.warning} px-4 py-2 rounded-md mr-2`}>Update Booking</TabsTrigger>
          <TabsTrigger value="trip" className={`${colorClasses.info} px-4 py-2 rounded-md`}>Manage Trip</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="bg-blue-500 text-white">
              <CardTitle className="text-2xl">Booking List</CardTitle>
              <CardDescription className="text-blue-100">Manage your bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">ID</TableHead>
                    <TableHead className="font-bold">Description</TableHead>
                    <TableHead className="font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map(booking => (
                    <TableRow key={booking.id} className="hover:bg-blue-50 transition-colors">
                      <TableCell>{booking.id}</TableCell>
                      <TableCell>{booking.description}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => setSelectedBooking(booking)}
                          variant="outline"
                          size="sm"
                          className={`${colorClasses.primary} mr-2`}>Select</Button>
                        <Button
                          onClick={() => deleteBooking(booking.id)}
                          variant="destructive"
                          size="sm"
                          className={colorClasses.danger}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="bg-purple-500 text-white">
              <CardTitle className="text-2xl">Create New Booking</CardTitle>
              <CardDescription className="text-purple-100">Enter the details for a new booking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customerId" className="text-right font-bold">Customer ID</Label>
                  <Input
                    id="customerId"
                    value={newBooking.customerId}
                    onChange={(e) => setNewBooking({...newBooking, customerId: e.target.value})}
                    className="col-span-3 border-purple-300 focus:border-purple-500 focus:ring-purple-500" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right font-bold">Description</Label>
                  <Input
                    id="description"
                    value={newBooking.description}
                    onChange={(e) => setNewBooking({...newBooking, description: e.target.value})}
                    className="col-span-3 border-purple-300 focus:border-purple-500 focus:ring-purple-500" />
                </div>
                <Button onClick={createBooking} className={`${colorClasses.secondary} ml-auto`}>
                  <Plus className="mr-2 h-4 w-4" /> Create Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="update">
          <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="bg-yellow-500 text-white">
              <CardTitle className="text-2xl">Update Booking</CardTitle>
              <CardDescription className="text-yellow-100">Modify the details of the selected booking</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedBooking ? (
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tripId" className="text-right font-bold">Trip ID</Label>
                    <Input
                      id="tripId"
                      value={updateBooking.tripId}
                      onChange={(e) => setUpdateBooking({...updateBooking, tripId: e.target.value})}
                      className="col-span-3 border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="updateDescription" className="text-right font-bold">Description</Label>
                    <Input
                      id="updateDescription"
                      value={updateBooking.description}
                      onChange={(e) => setUpdateBooking({...updateBooking, description: e.target.value})}
                      className="col-span-3 border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right font-bold">Status</Label>
                    <Input
                      id="status"
                      value={updateBooking.status}
                      onChange={(e) => setUpdateBooking({...updateBooking, status: e.target.value})}
                      className="col-span-3 border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500" />
                  </div>
                  <Button
                    onClick={updateBookingHandler}
                    className={`${colorClasses.warning} ml-auto`}>Update Booking</Button>
                </div>
              ) : (
                <p className="text-center text-gray-500">Please select a booking from the list to update.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trip">
          <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="bg-cyan-500 text-white">
              <CardTitle className="text-2xl">Manage Trip</CardTitle>
              <CardDescription className="text-cyan-100">Create a trip for the selected booking</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedBooking ? (
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startDate" className="text-right font-bold">Start Date</Label>
                    <div
                      className="col-span-3 flex items-center border rounded-md border-cyan-300 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500">
                      <Calendar className="ml-2 h-4 w-4 text-cyan-500" />
                      <Input
                        id="startDate"
                        type="date"
                        value={newTrip.startDate}
                        onChange={(e) => setNewTrip({...newTrip, startDate: e.target.value})}
                        className="border-0 focus:ring-0" />
                    </div>
                  
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endDate" className="text-right font-bold">End Date</Label>
                    <div
                      className="col-span-3 flex items-center border rounded-md border-cyan-300 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500">
                      <Calendar className="ml-2 h-4 w-4 text-cyan-500" />
                      <Input
                        id="endDate"
                        type="date"
                        value={newTrip.endDate}
                        onChange={(e) => setNewTrip({...newTrip, endDate: e.target.value})}
                        className="border-0 focus:ring-0" />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="departureAirport" className="text-right font-bold">Departure Airport</Label>
                    <div
                      className="col-span-3 flex items-center border rounded-md border-cyan-300 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500">
                      <Plane className="ml-2 h-4 w-4 text-cyan-500" />
                      <Input
                        id="departureAirport"
                        value={newTrip.departureAirport}
                        onChange={(e) => setNewTrip({...newTrip, departureAirport: e.target.value})}
                        className="border-0 focus:ring-0" />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right font-bold">Price</Label>
                    <div
                      className="col-span-3 flex items-center border rounded-md border-cyan-300 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500">
                      <DollarSign className="ml-2 h-4 w-4 text-cyan-500" />
                      <Input
                        id="price"
                        type="number"
                        value={newTrip.price}
                        onChange={(e) => setNewTrip({...newTrip, price: parseFloat(e.target.value)})}
                        className="border-0 focus:ring-0" />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tripDescription" className="text-right font-bold">Description</Label>
                    <div
                      className="col-span-3 flex items-center border rounded-md border-cyan-300 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500">
                      <MapPin className="ml-2 h-4 w-4 text-cyan-500" />
                      <Input
                        id="tripDescription"
                        value={newTrip.description}
                        onChange={(e) => setNewTrip({...newTrip, description: e.target.value})}
                        className="border-0 focus:ring-0" />
                    </div>
                  </div>
                  <Button onClick={createTrip} className={`${colorClasses.info} ml-auto`}>Create Trip</Button>
                </div>
              ) : (
                <p className="text-center text-gray-500">Please select a booking from the list to create a trip.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {selectedBooking && (
        <Card className="mt-6 bg-white shadow-lg rounded-lg overflow-hidden">
          <CardHeader className="bg-green-500 text-white">
            <CardTitle className="text-2xl">Fish Orders for Booking: {selectedBooking.id}</CardTitle>
            <CardDescription className="text-green-100">Manage fish orders for the selected booking</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Order ID</TableHead>
                  <TableHead className="font-bold">Total</TableHead>
                  <TableHead className="font-bold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedBooking.fishOrders && selectedBooking.fishOrders.map(order => (
                  <TableRow key={order.id} className="hover:bg-green-50 transition-colors">
                    <TableCell>{order.id}</TableCell>
                    <TableCell>${order.total}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => removeOrderFromBooking(order.id)}
                        variant="destructive"
                        size="sm"
                        className={colorClasses.danger}>
                        <Trash2 className="mr-2 h-4 w-4" /> Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4">
              <Label htmlFor="addOrderId" className="font-bold">Add Order ID</Label>
              <div className="flex items-center mt-2">
                <Input
                  id="addOrderId"
                  placeholder="Enter Order ID"
                  className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addOrderToBooking(e.target.value);
                      e.target.value = '';
                    }
                  }} />
                <Button
                  onClick={() => {
                    const input = document.getElementById('addOrderId');
                    addOrderToBooking(input.value);
                    input.value = '';
                  }}
                  className={`${colorClasses.success} ml-2`}>
                  <Plus className="mr-2 h-4 w-4" /> Add Order
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>)
  );
}