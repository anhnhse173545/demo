'use client';;
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrderTrackingCard } from "@/components/order-tracking-card";

const fishOrderStatuses = [
  "Deposited",
  "In Transit",
  "Delivering",
  "Completed",
];

export function DeliveryOrderList() {
  const [staff, setStaff] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrackingCard, setShowTrackingCard] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        const response = await fetch("http://localhost:8080/accounts/AC0003/detail");
        if (!response.ok) throw new Error("Failed to fetch staff details");
        const data = await response.json();
        setStaff(data);
      } catch (error) {
        console.error("Failed to fetch staff details:", error);
        setError("Failed to load staff details. Please try again later.");
      }
    };

    fetchStaffDetails();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!staff) return;

      setLoading(true);
      try {
        const [staffBookingsResponse, orderPrepareResponse, completedResponse] = await Promise.all([
          fetch(`http://localhost:8080/api/booking/delivery-staff/${staff.id}`),
          fetch(`http://localhost:8080/api/booking/status/Order%20Prepare`),
          fetch(`http://localhost:8080/api/booking/status/Completed`)
        ]);

        if (!staffBookingsResponse.ok || !orderPrepareResponse.ok || !completedResponse.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const staffBookings = await staffBookingsResponse.json();
        const orderPrepareBookings = await orderPrepareResponse.json();
        const completedBookings = await completedResponse.json();

        const combinedBookings = staffBookings.filter(booking =>
          orderPrepareBookings.some(prepareBooking => prepareBooking.id === booking.id) ||
          completedBookings.some(completedBooking => completedBooking.id === booking.id));

        setBookings(combinedBookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        setError("Failed to load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [staff]);

  const handleTrackOrder = (order) => {
    setSelectedOrder(order);
    setShowTrackingCard(true);
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/booking/update/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update booking status");

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking));
    } catch (error) {
      console.error("Failed to update booking status:", error);
    }
  };

  const handleUpdateFishOrderStatus = async (
    bookingId,
    farmId,
    orderId,
    newStatus
  ) => {
    try {
      const booking = bookings.find((b) => b.id === bookingId);
      if (!booking) throw new Error("Booking not found");

      const response = await fetch(`http://localhost:8080/fish-order/${bookingId}/${farmId}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          delivery_address: booking.customer.address,
          arrived_date: new Date().toISOString(),
          paymentStatus: "Deposited", // Assuming this is the correct initial status
        }),
      });

      if (!response.ok) throw new Error("Failed to update fish order status");

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                fishOrders: booking.fishOrders.map((order) =>
                  order.id === orderId ? { ...order, status: newStatus } : order),
              }
            : booking));
    } catch (error) {
      console.error("Failed to update fish order status:", error);
    }
  };

  const formatTotal = (total) => {
    return `$${Math.abs(total).toFixed(2)}`;
  };

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

  function getStatusColor(status) {
    switch (status) {
      case "Order Prepare":
        return "bg-blue-500 text-white";
      case "Completed":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-300 text-black";
    }
  }

  return (
    
    (<div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">
        Order List for {staff?.name}
      </h1>
      {bookings.length === 0 ? (
        <p>No bookings found for this delivery staff.</p>
      ) : (
        
        <div className="space-y-8">
           
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Booking ID: {booking.id}
                </h2>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={
                      booking.status === "Completed" ? "success" : "secondary"
                    }>
                    {booking.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className={getStatusColor(booking.status)}>
                        Change Status <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onSelect={() =>
                          handleUpdateBookingStatus(booking.id, "Order Prepare")
                        }>
                        Order Prepare
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() =>
                          handleUpdateBookingStatus(booking.id, "Completed")
                        }>
                        Completed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="mb-4">
                <p>
                  <strong>Customer:</strong> {booking.customer.name}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {booking.customer.address || "Not provided"}
                </p>
                <p>
                  {/** 
                  <strong>Trip:</strong> {booking.trip.departureAirport} (
                  {new Date(booking.trip.startDate).toLocaleDateString()} -{" "}
                  {new Date(booking.trip.endDate).toLocaleDateString()})
                  */}
                </p>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Order ID</TableHead>
                      <TableHead>Farm ID</TableHead>
                      <TableHead>Fish Order Status</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead>Total</TableHead>
                     
                    </TableRow>
                    
                  </TableHeader>
                  <TableBody>
                    {booking.fishOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.id}
                        </TableCell>
                        <TableCell>{order.farmId}</TableCell>
                        <TableCell>
                          <DropdownMenu>
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
                          </DropdownMenu>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.paymentStatus === "Deposited"
                                ? "success"
                                : "warning"
                            }>
                            {order.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatTotal(order.total)}</TableCell>
                       
                        
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