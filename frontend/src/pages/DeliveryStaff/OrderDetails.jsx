import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { OrderTrackingCard } from "@/components/order-tracking-card";

export function OrderDetailsComponent() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrackingCard, setShowTrackingCard] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;

      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/fish-order/${orderId}`);
        if (!response.ok) throw new Error('Failed to fetch order details');
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
        setError("Failed to load order details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleTrackOrder = () => {
    setShowTrackingCard(true);
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

  return (
    (<div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Order Details</h1>
      {order ? (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Order ID: {order.id}</h2>
          <p><strong>Farm ID:</strong> {order.farmId}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
          <p><strong>Total:</strong> ${Math.abs(order.total).toFixed(2)}</p>
          <div className="mt-4">
            <Button onClick={handleTrackOrder}>Track Order</Button>
          </div>
        </div>
      ) : (
        <p>No order found with the provided ID.</p>
      )}
      {showTrackingCard && order && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog">
          <OrderTrackingCard order={order} onClose={() => setShowTrackingCard(false)} />
        </div>
      )}
    </div>)
  );
}