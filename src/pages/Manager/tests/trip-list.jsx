'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Info, Plus, ArrowUpDown, Trash2 } from "lucide-react";
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

export function TripListComponent() {
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
    status: 'Seasonal',
  })

  // Filtering and Sorting state
  const [filterStatus, setFilterStatus] = useState('All')
  const [sortBy, setSortBy] = useState('startDate')
  const [sortOrder, setSortOrder] = useState('asc')
  const [searchQuery, setSearchQuery] = useState('')

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
      await api.post('/create', { ...newTripData, status: 'Seasonal' })
      await fetchTrips()
      setIsAddingTrip(false)
      // Reset form after successful creation
      setNewTripData({
        startDate: '',
        endDate: '',
        departureAirport: '',
        price: '',
        status: 'Seasonal',
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

  // Delete a trip
  const handleDeleteTrip = useCallback(async (tripId) => {
    setLoading(true)
    setError(null)
    try {
      await api.delete(`/delete/${tripId}`)
      await fetchTrips()
      setSelectedTrip(null)
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }, [fetchTrips, handleError])

  // Generate status badge with appropriate color
  const getStatusBadge = (status) => {
    const statusColor = {
      'Seasonal': 'bg-blue-600 text-white',
      'Pending': 'bg-yellow-500 text-white',
      'Confirmed': 'bg-green-600 text-white',
      'Cancelled': 'bg-red-600 text-white',
    }
    return (
      (<Badge className={`${statusColor[status] || 'bg-gray-600 text-white'}`}>
        {status || 'No Status'}
      </Badge>)
    );
  }

  // Filter and sort trips
  const filteredAndSortedTrips = useMemo(() => {
    return trips
      .filter(trip => {
        if (filterStatus === 'All') return true;
        if (filterStatus === 'Others') return !['Seasonal', 'Pending', 'Confirmed', 'Cancelled'].includes(trip.status);
        return trip.status === filterStatus;
      })
      .filter(
      trip => trip.departureAirport.toLowerCase().includes(searchQuery.toLowerCase())
    )
      .sort((a, b) => {
        if (sortBy === 'startDate') {
          return sortOrder === 'asc'
            ? new Date(a.startDate) - new Date(b.startDate)
            : new Date(b.startDate) - new Date(a.startDate);
        } else if (sortBy === 'price') {
          return sortOrder === 'asc' ? a.price - b.price : b.price - a.price
        }
        return 0
      });
  }, [trips, filterStatus, searchQuery, sortBy, sortOrder])

  return (
    (<div className="container mx-auto p-4 bg-gray-50">
      {/* Header and Add Trip button */}
      <div
        className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-gray-800">Trip List</h1>
        <Dialog open={isAddingTrip} onOpenChange={setIsAddingTrip}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setIsAddingTrip(true)}
              className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Trip
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Trip</DialogTitle>
              <DialogDescription>
                Enter the details for the new trip. Status will be automatically set to "Seasonal".
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
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Trip'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {/* Filtering, Sorting, and Search Controls */}
      <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex-1 min-w-[200px]">
          <Input
            type="text"
            placeholder="Search by departure airport"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Seasonal">Seasonal</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
            <SelectItem value="Others">Others</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="startDate">Start Date</SelectItem>
            <SelectItem value="price">Price</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="bg-white text-gray-800 border-gray-300 hover:bg-gray-100">
          <ArrowUpDown className="mr-2 h-4 w-4" />
          {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        </Button>
      </div>
      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
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
        {filteredAndSortedTrips.map((trip) => (
          <Card
            key={trip.id}
            className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-xl text-gray-800">Trip to {trip.departureAirport}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div><strong className="text-gray-700">Start Date:</strong> {new Date(trip.startDate).toLocaleDateString()}</div>
                <div><strong className="text-gray-700">End Date:</strong> {new Date(trip.endDate).toLocaleDateString()}</div>
                <div><strong className="text-gray-700">Price:</strong> ${trip.price}</div>
                <div className="flex items-center space-x-2">
                  <strong className="text-gray-700">Status:</strong>
                  {/* Status update dropdown */}
                  <Select
                    value={trip.status || "no-status"}
                    onValueChange={(newStatus) => handleUpdateStatus(trip.id, newStatus === "no-status" ? "" : newStatus)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue>{getStatusBadge(trip.status)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {['Seasonal', 'Pending', 'Confirmed', 'Cancelled', 'no-status'].map((status) => (
                        <SelectItem key={status} value={status}>
                          {status === "no-status" ? getStatusBadge("") : getStatusBadge(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Trip details dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                    onClick={() => setSelectedTrip(trip)}>
                    <Info className="mr-2 h-4 w-4" />
                    Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Trip Details</DialogTitle>
                    <DialogDescription>
                      Detailed information about the selected trip.
                    </DialogDescription>
                  </DialogHeader>
                  {selectedTrip && (
                    <div className="mt-4 space-y-2">
                      <div><strong className="text-gray-700">ID:</strong> {selectedTrip.id}</div>
                      <div><strong className="text-gray-700">Start Date:</strong> {new Date(selectedTrip.startDate).toLocaleString()}</div>
                      <div><strong className="text-gray-700">End Date:</strong> {new Date(selectedTrip.endDate).toLocaleString()}</div>
                      <div><strong className="text-gray-700">Departure Airport:</strong> {selectedTrip.departureAirport}</div>
                      <div><strong className="text-gray-700">Price:</strong> ${selectedTrip.price}</div>
                      <div><strong className="text-gray-700">Status:</strong>   {getStatusBadge(selectedTrip.status)}</div>
                      <div><strong className="text-gray-700">Destinations:</strong> {selectedTrip.tripDestinations.length}</div>
                      <div>
                        <h3 className="font-semibold mt-2 text-gray-800">Destinations:</h3>
                        <ul className="list-disc pl-5">
                          {selectedTrip.tripDestinations.map((destination, index) => (
                            <li key={index}>{destination.name}</li>
                          ))}
                        </ul>
                      </div>
                      <Button
                        variant="destructive"
                        className="mt-4 bg-red-600 hover:bg-red-700"
                        onClick={() => handleDeleteTrip(selectedTrip.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Trip
                      </Button>
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