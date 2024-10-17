'use client';
import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export function DeliveryStaffBookingsComponent() {
  const [staff, setStaff] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        const response = await fetch("http://localhost:8080/accounts/AC0003/detail")
        if (!response.ok) throw new Error('Failed to fetch staff details')
        const data = await response.json()
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
        // Assuming there's an API endpoint to fetch bookings for a specific delivery staff
        const response = await fetch(`http://localhost:8080/api/bookings/delivery-staff/${staff.id}`)
        if (!response.ok) throw new Error('Failed to fetch bookings')
        const data = await response.json()
        // Filter bookings to only include those with fish orders
        const bookingsWithFishOrders = data.filter((booking) => booking.fishOrders && booking.fishOrders.length > 0)
        setBookings(bookingsWithFishOrders)
      } catch (error) {
        console.error("Failed to fetch bookings:", error)
        setError("Failed to load bookings. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [staff])

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
      <h1 className="text-2xl font-bold mb-5">Bookings for {staff?.name}</h1>
      {bookings.length === 0 ? (
        <p>No bookings found with fish orders.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <CardTitle>Booking ID: {booking.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className="mb-4">{booking.status}</Badge>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Order ID</TableHead>
                      <TableHead>Farm ID</TableHead>
                      <TableHead>Delivery Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {booking.fishOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.farmId}</TableCell>
                        <TableCell>{order.deliveryAddress}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === 'Pending' ? 'secondary' : 'primary'}>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>)
  );
}