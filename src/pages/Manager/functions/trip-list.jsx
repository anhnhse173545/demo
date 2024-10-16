'use client'

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Info, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: 'http://localhost:8081/api/trip',
  timeout: 5000, // 5 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

export default function TripListComponent() {
  // State management
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [isAddingTrip, setIsAddingTrip] = useState(false)
  const [newTripData, setNewTripData] = useState({
    startDate: '',
    endDate: '',
    departureAirport: '',
    price: '',
    status: 'Seasonal', // Default status set to 'Seasonal'
  })

  // Error handling function
  const handleError = useCallback((error) => {
    if (axios.isAxiosError(error)) {
      setError(error.response?.data?.message || error.message)
    } else {
      setError('An unexpected error occurred')
    }
    setLoading(false)
  }, [])

  // Fetch all trips
  const fetchTrips = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/list')
      setTrips(response.data)
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }, [handleError])

  // Fetch trips on component mount
  useEffect(() => {
    fetchTrips()
  }, [fetchTrips])

  // Create a new trip
  const handleCreateTrip = useCallback(async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await api.post('/create', newTripData)
      await fetchTrips()
      setIsAddingTrip(false)
      // Reset form after successful creation
      setNewTripData({
        startDate: '',
        endDate: '',
        departureAirport: '',
        price: '',
        status: "Seasonal", // Maintain 'Seasonal' as default status
      })
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }, [fetchTrips, handleError, newTripData])

  // Update trip status
  const handleUpdateStatus = useCallback(async (tripId, newStatus) => {
    setLoading(true)
    setError(null)
    try {
      await api.put(`/update/${tripId}`, { status: newStatus })
      await fetchTrips()
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }, [fetchTrips, handleError])

  // Generate status badge with appropriate color
  const getStatusBadge = (status) => {
    const statusColor = {
      'Seasonal': 'bg-blue-100 text-blue-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Confirmed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
    }
    return (
      (<Badge className={`${statusColor[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </Badge>)
    );
  }

  return (
    (<div className="container mx-auto p-4">
      {/* Header and Add Trip button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Trip List</h1>
        <Dialog open={isAddingTrip} onOpenChange={setIsAddingTrip}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddingTrip(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Trip
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Trip</DialogTitle>
              <DialogDescription>
                Enter the details for the new trip. Status will be set to "Seasonal" by default.
              </DialogDescription>
            </DialogHeader>
            {/* Add Trip Form */}
            <form onSubmit={handleCreateTrip} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={newTripData.startDate}
                  onChange={(e) => setNewTripData({ ...newTripData, startDate: e.target.value })}
                  required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={newTripData.endDate}
                  onChange={(e) => setNewTripData({ ...newTripData, endDate: e.target.value })}
                  required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departureAirport">Departure Airport</Label>
                <Input
                  id="departureAirport"
                  value={newTripData.departureAirport}
                  onChange={(e) => setNewTripData({ ...newTripData, departureAirport: e.target.value })}
                  required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={newTripData.price}
                  onChange={(e) => setNewTripData({ ...newTripData, price: e.target.value })}
                  required />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Trip'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      {/* Error display */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {/* Trip list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trips.map((trip) => (
          <Card key={trip.id}>
            <CardHeader>
              <CardTitle>Trip to {trip.departureAirport}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div><strong>Start Date:</strong> {new Date(trip.startDate).toLocaleDateString()}</div>
                <div><strong>End Date:</strong> {new Date(trip.endDate).toLocaleDateString()}</div>
                <div><strong>Price:</strong> ${trip.price}</div>
                <div className="flex items-center space-x-2">
                  <strong>Status:</strong>
                  {/* Status update dropdown */}
                  <Select
                    value={trip.status}
                    onValueChange={(newStatus) => handleUpdateStatus(trip.id, newStatus)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue>{getStatusBadge(trip.status)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {['Seasonal', 'Pending', 'Confirmed', 'Cancelled'].map((status) => (
                        <SelectItem key={status} value={status}>
                          {getStatusBadge(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Trip details dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mt-4" onClick={() => setSelectedTrip(trip)}>
                    <Info className="mr-2 h-4 w-4" />
                    Details
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Trip Details</DialogTitle>
                    <DialogDescription>
                      Detailed information about the selected trip.
                    </DialogDescription>
                  </DialogHeader>
                  {selectedTrip && (
                    <div className="mt-4 space-y-2">
                      <div><strong>ID:</strong> {selectedTrip.id}</div>
                      <div><strong>Start Date:</strong> {new Date(selectedTrip.startDate).toLocaleString()}</div>
                      <div><strong>End Date:</strong> {new Date(selectedTrip.endDate).toLocaleString()}</div>
                      <div><strong>Departure Airport:</strong> {selectedTrip.departureAirport}</div>
                      <div><strong>Price:</strong> ${selectedTrip.price}</div>
                      <div><strong>Status:</strong> {getStatusBadge(selectedTrip.status)}</div>
                      <div><strong>Destinations:</strong> {selectedTrip.tripDestinations.length}</div>
                      <div>
                        <h3 className="font-semibold mt-2">Destinations:</h3>
                        <ul className="list-disc pl-5">
                          {selectedTrip.tripDestinations.map((destination, index) => (
                            <li key={index}>{destination.name}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>)
  );
}