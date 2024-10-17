'use client';
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OrderDetails } from './order-details'

export function OrderListComponent() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/orders')
        setOrders(response.data)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch orders. Please try again later.')
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleViewDetails = (order) => {
    setSelectedOrder(order)
  }

  const formatTotal = (total) => {
    if (total == null) return 'N/A'
    return `$${Number(total).toFixed(2)}`;
  }

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    (<div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Order List</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Farm ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Action</TableHead>
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
              <TableCell>{formatTotal(order.total)}</TableCell>
              <TableCell>
                <Button onClick={() => handleViewDetails(order)}>View Details</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedOrder && (
        <OrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>)
  );
}