'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function OrderTrackingCard({
  orders,
  onClose
}) {
  return (
    (<Card className="w-full max-w-4xl mx-auto overflow-auto max-h-[90vh]">
      <CardHeader className="sticky top-0 bg-background z-10">
        <CardTitle className="text-2xl font-bold flex justify-between items-center">
          Fish Orders
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-label="Close">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Farm ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.farmId}</TableCell>
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
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Accordion type="single" collapsible>
                    <AccordionItem value={`item-${order.id}`}>
                      <AccordionTrigger>View Details</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold">Delivery Address</h4>
                            <p>{order.deliveryAddress}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Booking ID</h4>
                            <p>{order.bookingId}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Fish Order Details</h4>
                            {order.fishOrderDetails.length > 0 ? (
                              <ul className="list-disc pl-5">
                                {order.fishOrderDetails.map((detail, index) => (
                                  <li key={index}>
                                    {/* Replace with actual fish order detail information */}
                                    Fish Order Detail {index + 1}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p>No fish order details available</p>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold">Fish Pack Order Details</h4>
                            {order.fishPackOrderDetails.length > 0 ? (
                              <ul className="list-disc pl-5">
                                {order.fishPackOrderDetails.map((detail, index) => (
                                  <li key={index}>
                                    {/* Replace with actual fish pack order detail information */}
                                    Fish Pack Order Detail {index + 1}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p>No fish pack order details available</p>
                            )}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>)
  );
}