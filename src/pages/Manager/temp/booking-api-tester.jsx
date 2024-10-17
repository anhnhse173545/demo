'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: 'http://localhost:8080/api/booking',
  timeout: 5000, // 5 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

export function BookingApiTesterComponent() {
  // State for input fields
  const [bookingId, setBookingId] = useState('')
  const [orderId, setOrderId] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [saleStaffId, setSaleStaffId] = useState('')
  const [consultingStaffId, setConsultingStaffId] = useState('')
  const [tripId, setTripId] = useState('')
  const [status, setStatus] = useState('')
  const [requestBody, setRequestBody] = useState('')

  // State for API response and loading
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Generic function to make API calls
  const makeApiCall = async (method, url, data = null) => {
    setLoading(true)
    setError(null)
    try {
      const result = await api({ method, url, data })
      setResponse(result.data)
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }

  // API call functions
  const removeFishOrder = () => makeApiCall('put', `/${bookingId}/remove-fish-order-from-booking/${orderId}`)
  const addFishOrder = () => makeApiCall('put', `/${bookingId}/add-fish-order-to-booking/${orderId}`)
  const updateBooking = () => makeApiCall('put', `/update/${bookingId}`, JSON.parse(requestBody))
  const createBooking = () => makeApiCall('post', `/${customerId}/create`, JSON.parse(requestBody))
  const createTrip = () => makeApiCall('post', `/${bookingId}/create-trip`, JSON.parse(requestBody))
  const getBookingTrip = () => makeApiCall('get', `/${bookingId}/trip`)
  const getTripById = () => makeApiCall('get', `/trip/${tripId}`)
  const getAllSaleStaff = () => makeApiCall('get', '/sale-staff')
  const getSaleStaffById = () => makeApiCall('get', `/sale-staff/${saleStaffId}`)
  const getSaleStaffCustomer = () => makeApiCall('get', `/sale-staff/${saleStaffId}/customer/${customerId}`)
  const getSaleStaffForCustomer = () => makeApiCall('get', `/sale-staff-customer/${customerId}`)
  const getRequestedBookings = () => makeApiCall('get', '/requested')
  const getAllBookings = () => makeApiCall('get', '/list')
  const getBookingById = () => makeApiCall('get', `/get/${bookingId}`)
  const getBookingsByStatus = () => makeApiCall('get', `/customer/${status}`)
  const getBookingsByCustomerId = () => makeApiCall('get', `/customer/${customerId}`)
  const getAllConsultingStaff = () => makeApiCall('get', '/consulting-staff')
  const getConsultingStaffById = () => makeApiCall('get', `/consulting-staff/${consultingStaffId}`)
  const deleteBooking = () => makeApiCall('delete', `/delete/${bookingId}`)

  return (
    (<div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Booking API Tester</h1>
      <Tabs defaultValue="remove-fish-order" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="remove-fish-order">Remove Fish Order</TabsTrigger>
          <TabsTrigger value="add-fish-order">Add Fish Order</TabsTrigger>
          <TabsTrigger value="update-booking">Update Booking</TabsTrigger>
          <TabsTrigger value="create-booking">Create Booking</TabsTrigger>
          <TabsTrigger value="create-trip">Create Trip</TabsTrigger>
          <TabsTrigger value="get-booking-trip">Get Booking Trip</TabsTrigger>
          <TabsTrigger value="get-trip">Get Trip</TabsTrigger>
          <TabsTrigger value="sale-staff">Sale Staff</TabsTrigger>
          <TabsTrigger value="customer-bookings">Customer Bookings</TabsTrigger>
          <TabsTrigger value="consulting-staff">Consulting Staff</TabsTrigger>
          <TabsTrigger value="delete-booking">Delete Booking</TabsTrigger>
        </TabsList>

        {/* Remove Fish Order Tab */}
        <TabsContent value="remove-fish-order">
          <Card>
            <CardHeader>
              <CardTitle>Remove Fish Order from Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Booking ID"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)} />
                <Input
                  placeholder="Order ID"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)} />
                <Button onClick={removeFishOrder} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Remove Fish Order'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add Fish Order Tab */}
        <TabsContent value="add-fish-order">
          <Card>
            <CardHeader>
              <CardTitle>Add Fish Order to Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Booking ID"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)} />
                <Input
                  placeholder="Order ID"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)} />
                <Button onClick={addFishOrder} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Add Fish Order'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Update Booking Tab */}
        <TabsContent value="update-booking">
          <Card>
            <CardHeader>
              <CardTitle>Update Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Booking ID"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)} />
                <Textarea
                  placeholder="Request Body (JSON)"
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)} />
                <Button onClick={updateBooking} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Update Booking'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Booking Tab */}
        <TabsContent value="create-booking">
          <Card>
            <CardHeader>
              <CardTitle>Create Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Customer ID"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)} />
                <Textarea
                  placeholder="Request Body (JSON)"
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)} />
                <Button onClick={createBooking} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Booking'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Trip Tab */}
        <TabsContent value="create-trip">
          <Card>
            <CardHeader>
              <CardTitle>Create Trip</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Booking ID"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)} />
                <Textarea
                  placeholder="Request Body (JSON)"
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)} />
                <Button onClick={createTrip} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Trip'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Get Booking Trip Tab */}
        <TabsContent value="get-booking-trip">
          <Card>
            <CardHeader>
              <CardTitle>Get Booking Trip</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Booking ID"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)} />
                <Button onClick={getBookingTrip} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Get Booking Trip'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Get Trip Tab */}
        <TabsContent value="get-trip">
          <Card>
            <CardHeader>
              <CardTitle>Get Trip</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Trip ID"
                  value={tripId}
                  onChange={(e) => setTripId(e.target.value)} />
                <Button onClick={getTripById} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Get Trip'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sale Staff Tab */}
        <TabsContent value="sale-staff">
          <Card>
            <CardHeader>
              <CardTitle>Sale Staff Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={getAllSaleStaff} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Get All Sale Staff'}
                </Button>
                <Input
                  placeholder="Sale Staff ID"
                  value={saleStaffId}
                  onChange={(e) => setSaleStaffId(e.target.value)} />
                <Button onClick={getSaleStaffById} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Get Sale Staff by ID'}
                </Button>
                <Input
                  placeholder="Customer ID"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)} />
                <Button onClick={getSaleStaffCustomer} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Get Sale Staff Customer'}
                </Button>
                <Button onClick={getSaleStaffForCustomer} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Get Sale Staff for Customer'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Bookings Tab */}
        <TabsContent value="customer-bookings">
          <Card>
            <CardHeader>
              <CardTitle>Customer Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={getRequestedBookings} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Get Requested Bookings'}
                </Button>
                <Button onClick={getAllBookings} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Get All Bookings'}
                </Button>
                <Input
                  placeholder="Booking ID"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)} />
                <Button onClick={getBookingById} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Get Booking by ID'}
                </Button>
                <Input
                  placeholder="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)} />
                <Button onClick={getBookingsByStatus} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Get Bookings by Status'}
                </Button>
                <Input
                  placeholder="Customer ID"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)} />
                <Button onClick={getBookingsByCustomerId} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Get Bookings by Customer ID'}
                </Button>
              </div>
            </CardContent>
          </Card>
        
        </TabsContent>

        {/* Consulting Staff Tab */}
        <TabsContent value="consulting-staff">
          <Card>
            <CardHeader>
              <CardTitle>Consulting Staff Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={getAllConsultingStaff} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Get All Consulting Staff'}
                </Button>
                <Input
                  placeholder="Consulting Staff ID"
                  value={consultingStaffId}
                  onChange={(e) => setConsultingStaffId(e.target.value)} />
                <Button onClick={getConsultingStaffById} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Get Consulting Staff by ID'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delete Booking Tab */}
        <TabsContent value="delete-booking">
          <Card>
            <CardHeader>
              <CardTitle>Delete Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Booking ID"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)} />
                <Button onClick={deleteBooking} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete Booking'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Response Display */}
      {response && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>API Response</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>)
  );
}