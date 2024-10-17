'use client';
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
import { OrderTrackingCard } from "../../../components/order-tracking-card"
import { Loader2, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DeliveryOrderListComponent() {
  const [staff, setStaff] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showTrackingCard, setShowTrackingCard] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        const response = await fetch("http://localhost:8080/accounts/AC0003/detail")
        if (!response.ok) throw new Error('Failed to fetch staff details')
        const data = await response.json()
        console.log("Staff details:", data)
        setStaff(data)
      } catch (error) {
        console.error("Failed to fetch staff details:", error)
        setError("Failed to load staff details. Please try again later.")
      }
    }

    fetchStaffDetails()
  }, [])

  useEffect(() => {
    const fetchBookings = async () => {
      if (!staff) return

      setLoading(true)
      try {
        const response = await fetch(`http://localhost:8080/api/booking/status/Order%20Prepare`)
        if (!response.ok) throw new Error('Failed to fetch bookings')
        const data = await response.json()
        console.log("Fetched bookings:", data)
        
        setBookings(data)
        // const filteredBookings = data.filter((booking) => booking.deliveryStaffId === staff.id)
        // console.log("Filtered bookings:", filteredBookings)
        // setBookings(filteredBookings)
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
      const response = await fetch(`http://localhost:8080/api/booking/update/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update booking status')

      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking))
    } catch (error) {
      console.error("Failed to update booking status:", error)
    }
  }

  const handleUpdateFishOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/fish-order/update/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update fish order status')

      setBookings(prevBookings =>
        prevBookings.map(booking => ({
          ...booking,
          fishOrders: booking.fishOrders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order),
        })))
    } catch (error) {
      console.error("Failed to update fish order status:", error)
    }
  }

  const formatTotal = (total) => {
    if (total === null || total === undefined) return "N/A"
    return `$${total.toFixed(2)}`;
  }

  if (error) {
    return <p className="text-center mt-4 text-red-500">{error}</p>;
  }

  if (loading) {
    return (
      (<div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>)
    );
  }

  return (
    (<div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Order List for {staff?.name}</h1>
      {bookings.length === 0 ? (
        <p>No bookings found for this delivery staff.</p>
      ) : (
        <div className="space-y-8">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Booking ID: {booking.id}</h2>
                <div className="flex items-center space-x-2">
                  <Badge variant={booking.status === 'Completed' ? 'success' : 'secondary'}>
                    {booking.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Change Status <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onSelect={() => handleUpdateBookingStatus(booking.id, 'Order Prepare')}>
                        Order Prepare
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleUpdateBookingStatus(booking.id, 'Completed')}>
                        Completed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Order ID</TableHead>
                      <TableHead>Farm ID</TableHead>
                      <TableHead>Delivery Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {booking.fishOrders && booking.fishOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.farmId}</TableCell>
                        <TableCell>{order.deliveryAddress}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === 'Completed' ? 'success' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {order.paymentStatus ? (
                            <Badge variant="success">{order.paymentStatus}</Badge>
                          ) : (
                            <Badge variant="destructive">Not Paid</Badge>
                          )}
                        </TableCell>
                        <TableCell>{formatTotal(order.total)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                Actions <ChevronDown className="ml-2 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onSelect={() => handleTrackOrder(order)}>
                                Track Order
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleUpdateFishOrderStatus(order.id, 'Deposited')}>
                                Update to Deposited
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleUpdateFishOrderStatus(order.id, 'Transit')}>
                                Update to Transit
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleUpdateFishOrderStatus(order.id, 'Delivering')}>
                                Update to Delivering
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleUpdateFishOrderStatus(order.id, 'Completed')}>
                                Update to Completed
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>
      )}
      {showTrackingCard && selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog">
          <OrderTrackingCard order={selectedOrder} onClose={() => setShowTrackingCard(false)} />
        </div>
      )}
    </div>)
  );
}