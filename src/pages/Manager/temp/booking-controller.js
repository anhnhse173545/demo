'use client'

import express from 'express';
import { BookingService } from '../services/booking-service';

const router = express.Router();
const bookingService = new BookingService();

// PUT /api/booking/{booking_id}/remove-fish-order-from-booking/{order_id}
router.put(
  '/:booking_id/remove-fish-order-from-booking/:order_id',
  async (req, res) => {
    try {
      const { booking_id, order_id } = req.params;
      const result = await bookingService.removeFishOrderFromBooking(booking_id, order_id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove fish order from booking' });
    }
  }
);

// PUT /api/booking/{booking_id}/add-fish-order-to-booking/{order_id}
router.put('/:booking_id/add-fish-order-to-booking/:order_id', async (req, res) => {
  try {
    const { booking_id, order_id } = req.params;
    const result = await bookingService.addFishOrderToBooking(booking_id, order_id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add fish order to booking' });
  }
});

// PUT /api/booking/update/{id}
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const result = await bookingService.updateBooking(id, updateData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// POST /api/booking/{customer_id}/create
router.post('/:customer_id/create', async (req, res) => {
  try {
    const { customer_id } = req.params;
    const bookingData = req.body;
    const result = await bookingService.createBooking(customer_id, bookingData);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// POST /api/booking/{bookingId}/create-trip
router.post('/:bookingId/create-trip', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const tripData = req.body;
    const result = await bookingService.createTrip(bookingId, tripData);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

// GET /api/booking/{bookingId}/trip
router.get('/:bookingId/trip', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const result = await bookingService.getBookingTrip(bookingId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get booking trip' });
  }
});

// GET /api/booking/trip/{tripId}
router.get('/trip/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;
    const result = await bookingService.getTripById(tripId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get trip' });
  }
});

// GET /api/booking/sale-staff
router.get('/sale-staff', async (req, res) => {
  try {
    const result = await bookingService.getAllSaleStaff();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get sale staff' });
  }
});

// GET /api/booking/sale-staff/{saleStaffId}
router.get('/sale-staff/:saleStaffId', async (req, res) => {
  try {
    const { saleStaffId } = req.params;
    const result = await bookingService.getSaleStaffById(saleStaffId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get sale staff' });
  }
});

// GET /api/booking/sale-staff/{saleStaffId}/customer/{customerId}
router.get('/sale-staff/:saleStaffId/customer/:customerId', async (req, res) => {
  try {
    const { saleStaffId, customerId } = req.params;
    const result = await bookingService.getSaleStaffCustomer(saleStaffId, customerId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get sale staff customer' });
  }
});

// GET /api/booking/sale-staff-customer/{customerId}
router.get('/sale-staff-customer/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const result = await bookingService.getSaleStaffForCustomer(customerId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get sale staff for customer' });
  }
});

// GET /api/booking/requested
router.get('/requested', async (req, res) => {
  try {
    const result = await bookingService.getRequestedBookings();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get requested bookings' });
  }
});

// GET /api/booking/list
router.get('/list', async (req, res) => {
  try {
    const result = await bookingService.getAllBookings();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get all bookings' });
  }
});

// GET /api/booking/get/{id}
router.get('/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await bookingService.getBookingById(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get booking' });
  }
});

// GET /api/booking/customer/{status}
router.get('/customer/:status', async (req, res) => {
  try {
    const { status } = req.params;
    const result = await bookingService.getBookingsByStatus(status);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get bookings by status' });
  }
});

// GET /api/booking/customer/{customerId}
router.get('/customer/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const result = await bookingService.getBookingsByCustomerId(customerId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get bookings for customer' });
  }
});

// GET /api/booking/consulting-staff
router.get('/consulting-staff', async (req, res) => {
  try {
    const result = await bookingService.getAllConsultingStaff();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get consulting staff' });
  }
});

// GET /api/booking/consulting-staff/{consultingStaffId}
router.get('/consulting-staff/:consultingStaffId', async (req, res) => {
  try {
    const { consultingStaffId } = req.params;
    const result = await bookingService.getConsultingStaffById(consultingStaffId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get consulting staff' });
  }
});

// DELETE /api/booking/delete/{id}
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await bookingService.deleteBooking(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

export default router;