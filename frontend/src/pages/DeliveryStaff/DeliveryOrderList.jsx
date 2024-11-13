'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, ChevronDown, AlertCircle, Package2, User, MapPin } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { OrderTrackingCard } from "@/components/order-tracking-card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const API_BASE_URL = "http://localhost:8080"

const fishOrderStatuses = [
  "Deposited",
  "In Transit",
  "Delivering",
  "Completed",
  "Canceled",
]

const bookingStatuses = ["Order Prepare", "Completed"]

export default function DeliveryOrderListComponent() {
  const { user } = useAuth();
  const [staff, setStaff] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showTrackingCard, setShowTrackingCard] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/accounts/${user.id}/detail`)
        if (!response.ok) throw new Error("Failed to fetch staff details")
        const data = await response.json()
        setStaff(data)
      } catch (error) {
        console.error("Failed to fetch staff details:", error)
        setError("Failed to load staff details. Please try again later.")
      }
    }

    fetchStaffDetails()
  }, [user.id])

  useEffect(() => {
    const fetchBookings = async () => {
      if (!staff) return

      setLoading(true)
      try {
        const [staffBookingsResponse, orderPrepareResponse, completedResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/booking/delivery-staff/${staff.id}`),
          fetch(`${API_BASE_URL}/api/booking/status/Order%20Prepare`),
          fetch(`${API_BASE_URL}/api/booking/status/Completed`)
        ])

        if (!staffBookingsResponse.ok || !orderPrepareResponse.ok || !completedResponse.ok) {
          throw new Error("Failed to fetch bookings")
        }

        const staffBookings = await staffBookingsResponse.json()
        const orderPrepareBookings = await orderPrepareResponse.json()
        const completedBookings = await completedResponse.json()

        const combinedBookings = staffBookings.filter(booking =>
          orderPrepareBookings.some(prepareBooking => prepareBooking.id === booking.id) ||
          completedBookings.some(completedBooking => completedBooking.id === booking.id))

        setBookings(combinedBookings)
      } catch (error) {
        console.error("Failed to fetch bookings:", error)
        setError("Failed to load bookings. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [staff])

  const handleTrackOrder = (order) => {
    setSelectedOrder(order)
    setShowTrackingCard(true)
  }

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/booking/update/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update booking status")

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      )
      toast({
        title: "Success",
        description: `Booking status updated to ${newStatus}`,
      })
    } catch (error) {
      console.error("Failed to update booking status:", error)
      toast({
        title: "Error",
        description: "Failed to update booking status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateFishOrderStatus = async (
    bookingId,
    farmId,
    orderId,
    newStatus
  ) => {
    try {
      const booking = bookings.find((b) => b.id === bookingId)
      if (!booking) throw new Error("Booking not found")

      const response = await fetch(`${API_BASE_URL}/fish-order/${bookingId}/${farmId}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          delivery_address: booking.deliveryAddress,
          arrived_date: new Date().toISOString(),
          paymentStatus: "Deposited",
        }),
      })

      if (!response.ok) throw new Error("Failed to update fish order status")

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                fishOrders: booking.fishOrders.map((order) =>
                  order.id === orderId ? { ...order, status: newStatus } : order
                ),
              }
            : booking
        )
      )
      toast({
        title: "Success",
        description: `Fish order status updated to ${newStatus}`,
      })
    } catch (error) {
      console.error("Failed to update fish order status:", error)
      toast({
        title: "Error",
        description: "Failed to update fish order status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatTotal = (total) => {
    return `$${Math.abs(total).toFixed(2)}`
  }

  function getStatusColor(status) {
    switch (status) {
      case "Order Prepare":
        return "bg-blue-500 text-white"
      case "Completed":
        return "bg-green-500 text-white"
      case "Deposited":
        return "bg-yellow-500 text-white"
      case "In Transit":
        return "bg-orange-500 text-white"
      case "Delivering":
        return "bg-purple-500 text-white"
      case "Canceled":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-300 text-black"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Delivery Staff Dashboard</h1>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookings.filter(booking => booking.status === "Completed").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookings.filter(booking => booking.status !== "Completed").length}
            </div>
          </CardContent>
        </Card>
      </div>
      {bookings.length === 0 ? (
        <Card>
          <CardContent className="flex justify-center items-center h-32">
            <p className="text-muted-foreground">No bookings found for this delivery staff.</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <BookingList 
              bookings={bookings} 
              handleUpdateBookingStatus={handleUpdateBookingStatus}
              handleUpdateFishOrderStatus={handleUpdateFishOrderStatus}
              navigate={navigate}
            />
          </TabsContent>
          <TabsContent value="pending">
            <BookingList 
              bookings={bookings.filter(booking => booking.status !== "Completed")}
              handleUpdateBookingStatus={handleUpdateBookingStatus}
              handleUpdateFishOrderStatus={handleUpdateFishOrderStatus}
              navigate={navigate}
            />
          </TabsContent>
          <TabsContent value="completed">
            <BookingList 
              bookings={bookings.filter(booking => booking.status === "Completed")}
              handleUpdateBookingStatus={handleUpdateBookingStatus}
              handleUpdateFishOrderStatus={handleUpdateFishOrderStatus}
              navigate={navigate}
            />
          </TabsContent>
        </Tabs>
      )}
      {showTrackingCard && selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog">
          <OrderTrackingCard order={selectedOrder} onClose={() => setShowTrackingCard(false)} />
        </div>
      )}
    </div>
  )
}

function BookingList({ bookings, handleUpdateBookingStatus, handleUpdateFishOrderStatus, navigate }) {
  return (
    <div className="space-y-8">
      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Booking ID: {booking.id}</span>
              <Badge variant={booking.status === "Completed" ? "success" : "secondary"}>
                {booking.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{booking.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{booking.deliveryAddress || "Not provided"}</p>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Order ID</TableHead>
                  <TableHead>Farm ID</TableHead>
                  <TableHead>Fish Order Status</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {booking.fishOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.farmId}</TableCell>
                    <TableCell>
                      {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className={getStatusColor(order.status)}>
                            {order.status || "Select Status"}
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {fishOrderStatuses.map((status) => (
                            <DropdownMenuItem
                              key={status}
                              onSelect={() =>
                                handleUpdateFishOrderStatus(booking.id, order.farmId, order.id, status)
                              }>
                              {status}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu> */}

                      <Badge variant={order.status === "Deposited" ? "success" : "warning"}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={order.paymentStatus === "Deposited" ? "success" : "warning"}>
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatTotal(order.total)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-2">
                        <Button onClick={() => navigate(`/refundkoi/${order.id}`)} variant="outline" size="sm">
                          Refund
                        </Button>
                        <Button 
                          onClick={() => handleUpdateFishOrderStatus(booking.id, order.farmId, order.id, "Delivering")
                          }
                          variant="outline"
                          size="sm"
                        >
                          Order Delivering
                        </Button>
                        <Button 
                          onClick={() =>
                            handleUpdateFishOrderStatus(booking.id, order.farmId, order.id, "In Transit")
                          }
                          variant="outline"
                          size="sm"
                        >
                          Order In Transit
                        </Button>
                        <Button 
                          onClick={() => {
                            handleUpdateFishOrderStatus(booking.id, order.farmId, order.id, "Completed");
                            handleUpdateBookingStatus(booking.id, "Completed");
                          }}
                          variant="outline"
                          size="sm"
                        >
                          Order Completed
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function getStatusColor(status) {
  switch (status) {
    case "Order Prepare":
      return "bg-blue-500 text-white"
    case "Completed":
      return "bg-green-500 text-white"
    case "Deposited":
      return "bg-yellow-500 text-white"
    case "In Transit":
      return "bg-orange-500 text-white"
    case "Delivering":
      return "bg-purple-500 text-white"
    case "Canceled":
      return "bg-red-500 text-white"
    default:
      return "bg-gray-300 text-black"
  }
}

function formatTotal(total) {
  return `$${Math.abs(total).toFixed(2)}`
}