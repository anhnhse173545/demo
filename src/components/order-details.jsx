'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function OrderDetails({
  order,
  onClose
}) {
  const formatTotal = (total) => {
    if (total == null) return 'N/A'
    return `$${Number(total).toFixed(2)}`;
  }

  return (
    (<Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Order ID:</span>
            <span className="col-span-3">{order.id}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Farm ID:</span>
            <span className="col-span-3">{order.farmId}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Delivery Address:</span>
            <span className="col-span-3">{order.deliveryAddress}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Status:</span>
            <span className="col-span-3">
              <Badge variant={order.status === 'Pending' ? 'secondary' : 'primary'}>
                {order.status}
              </Badge>
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Payment Status:</span>
            <span className="col-span-3">
              {order.paymentStatus ? (
                <Badge variant="success">{order.paymentStatus}</Badge>
              ) : (
                <Badge variant="destructive">Not Paid</Badge>
              )}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Total:</span>
            <span className="col-span-3">{formatTotal(order.total)}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Booking ID:</span>
            <span className="col-span-3">{order.bookingId}</span>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>)
  );
}