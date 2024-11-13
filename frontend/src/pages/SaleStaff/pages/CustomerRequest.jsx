'use client'

import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle, Loader2, Search, PlusCircle, RefreshCw, ChevronDown } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { toast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/AuthContext"

const PAGE_SIZE = 10
const API_BASE_URL = "http://localhost:8080/api"

const tripStatusOptions = ["Pending", "Approved", "Completed", "On-going", "Redo"]
const bookingStatusOptions = ["Requested", "Pending Quote", "Approved Quote"]

export default function CustomerRequestManagement() {
  const { user } = useAuth() // Get user from auth context
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isManageDestinationsModalOpen, setIsManageDestinationsModalOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/booking/sale-staff/${user.id}?timestamp=${new Date().getTime()}`)
      if (!response.ok) throw new Error("Network response was not ok")
      const data = await response.json()
      setBookings(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )
  const totalPages = Math.ceil(filteredBookings.length / PAGE_SIZE)

  const handleTripStatusUpdate = async (bookingId, newStatus) => {
    try {
      const booking = bookings.find((b) => b.id === bookingId)
      const response = await fetch(`${API_BASE_URL}/trip/update/${booking.trip.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Trip status update failed")

      const updatedTrip = await response.json()
      setBookings((prevBookings) =>
        prevBookings.map((b) =>
          b.id === bookingId ? { ...b, trip: { ...b.trip, status: updatedTrip.status } } : b
        )
      )
      toast({
        title: "Success",
        description: "Trip status updated successfully",
      })
    } catch (error) {
      console.error("Error updating trip status:", error)
      toast({
        title: "Error",
        description: "Failed to update trip status",
        variant: "destructive",
      })
    }
  }

  const handleViewBooking = async (bookingId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/booking/get/${bookingId}`)
      if (!response.ok) throw new Error("Failed to fetch booking details")
      const bookingDetails = await response.json()
      setSelectedBooking(bookingDetails)
      setIsViewModalOpen(true)
    } catch (error) {
      console.error("Error fetching booking details:", error)
      toast({
        title: "Error",
        description: "Failed to fetch booking details",
        variant: "destructive",
      })
    }
  }

  const handleCreateOrEditTrip = (booking) => {
    if (booking) {
      setSelectedBooking(booking)
      setIsCreateTripModalOpen(true)
    } else {
      console.error("Attempted to create/edit trip with null booking")
      toast({
        title: "Error",
        description: "Invalid booking selected",
        variant: "destructive",
      })
    }
  }

  const handleManageTripDestinations = (booking) => {
    if (booking) {
      setSelectedBooking(booking)
      setIsManageDestinationsModalOpen(true)
    } else {
      console.error("Attempted to manage destinations with null booking")
      toast({
        title: "Error",
        description: "Invalid booking selected",
        variant: "destructive",
      })
    }
  }

  const handleTripCreated = (updatedTrip) => {
    setBookings((prevBookings) =>
      prevBookings.map((b) =>
        b.id === selectedBooking.id ? { ...b, trip: updatedTrip } : b
      )
    )
    toast({
      title: "Success",
      description: "Trip created/updated successfully",
    })
  }

  const BookingRow = ({ booking, onTripStatusUpdate, onViewBooking, onCreateOrEditTrip, onManageTripDestinations }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case "Requested":
          return "bg-blue-200 text-blue-800"
        case "Pending Quote":
          return "bg-yellow-200 text-yellow-800"
        case "Approved Quote":
          return "bg-green-200 text-green-800"
        case "Pending":
          return "bg-orange-200 text-orange-800"
        case "Approved":
          return "bg-emerald-200 text-emerald-800"
        case "Completed":
          return "bg-indigo-200 text-indigo-800"
        case "On-going":
          return "bg-purple-200 text-purple-800"
        case "Redo":
          return "bg-red-200 text-red-800"
        default:
          return "bg-gray-200 text-gray-800"
      }
    }

    return (
      <TableRow className="hover:bg-muted/50 transition-colors">
        <TableCell className="font-medium">{booking.id}</TableCell>
        <TableCell>{booking.customer.name}</TableCell>
        {/* <TableCell>{booking.customer.email}</TableCell> */}
        <TableCell className="max-w-xs truncate">{booking.description}</TableCell>
        <TableCell>{new Date(booking.createAt).toLocaleDateString()}</TableCell>
        <TableCell>
          <Button variant="outline" className={getStatusColor(booking.status)}>
            {booking.status}
          </Button>
        </TableCell>
        <TableCell>
          {booking.trip ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={getStatusColor(booking.trip.status)}>
                  {booking.trip.status} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {tripStatusOptions.map((status) => (
                  <DropdownMenuItem key={status} onClick={() => onTripStatusUpdate(booking.id, status)}>
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" className="bg-gray-200 text-gray-800">
              No Trip
            </Button>
          )}
        </TableCell>
        <TableCell>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => onViewBooking(booking.id)}
              style={{ color: "#007bff", borderColor: "#007bff" }}
            >
              View Booking
            </Button>
            <Button
              variant="outline"
              onClick={() => onCreateOrEditTrip(booking)}
              style={{ color: "#28a745", borderColor: "#28a745" }}
            >
              {booking.trip ? "Edit Trip" : "Create Trip"}
            </Button>
            <Button
              variant="outline"
              onClick={() => onManageTripDestinations(booking)}
              style={{ color: "#fd7e14", borderColor: "#fd7e14" }}
            >
              {booking.trip ? "Edit Destinations" : "Add Destinations"}
            </Button>
          </div>
        </TableCell>
      </TableRow>
    )
  }

  const BookingDetailsModal = ({ isOpen, onClose, bookingDetails }) => {
    if (!bookingDetails) return null

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>Booking ID: {bookingDetails.id}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="mt-4 max-h-[60vh]">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Customer Information</h4>
                <p>Name: {bookingDetails.customer.name}</p>
                <p>Email: {bookingDetails.customer.email}</p>
                <p>Phone: {bookingDetails.customer.phone}</p>
              </div>
              <div>
                <h4 className="font-semibold">Booking Information</h4>
                <p>Status: {bookingDetails.status}</p>
                <p>Created At: {new Date(bookingDetails.createAt).toLocaleString()}</p>
                <p>Description: {bookingDetails.description}</p>
              </div>
              {bookingDetails.trip && (
                <div>
                  <h4 className="font-semibold">Trip Information</h4>
                  <p>Trip ID: {bookingDetails.trip.id}</p>
                  <p>Status: {bookingDetails.trip.status}</p>
                  <p>Start Date: {new Date(bookingDetails.trip.startDate).toLocaleDateString()}</p>
                  <p>End Date: {new Date(bookingDetails.trip.endDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </ScrollArea>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    )
  }

  const formatDateForServer = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toISOString().split("T")[0] + "T00:00:00"
  }

  const formatDateForInput = (dateString) => {
    if (!dateString) return ""
    return dateString.split("T")[0]
  }

  const CreateOrEditTripModal = ({ isOpen, onClose, booking, onTripCreated, showDestinations = false }) => {
    const [step, setStep] = useState(showDestinations ? "destinations" : "trip")
    const [tripDetails, setTripDetails] = useState({
      startDate: "",
      endDate: "",
      departureAirport: "",
      price: "",
      description: "",
    })
    const [destinations, setDestinations] = useState([])
    const [newDestination, setNewDestination] = useState({
      farmId: "",
      visitDate: "",
      description: "",
    })
    const [farms, setFarms] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
      if (isOpen && booking) {
        fetchFarms()
        if (booking.trip) {
          setTripDetails({
            startDate: formatDateForInput(booking.trip.startDate),
            endDate: formatDateForInput(booking.trip.endDate),
            departureAirport: booking.trip.departureAirport || "",
            price: booking.trip.price ? booking.trip.price.toString() : "",
            description: booking.trip.description || "",
          })
          fetchTripDestinations(booking.trip.id)
        } else {
          setTripDetails({
            startDate: "",
            endDate: "",
            departureAirport: "",
            price: "",
            description: "",
          })
          setDestinations([])
        }
      }
    }, [isOpen, booking])

    const fetchFarms = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/farm/list`)
        if (!response.ok) throw new Error("Failed to fetch farms")
        const data = await response.json()
        setFarms(data)
      } catch (error) {
        console.error("Error fetching farms:", error)
        setError("Failed to fetch farms")
      }
    }

    const fetchTripDestinations = async (tripId) => {
      if (!tripId) return
      try {
        const response = await fetch(`${API_BASE_URL}/trip-destination/${tripId}/list`)
        if (!response.ok) throw new Error("Failed to fetch trip destinations")
        const data = await response.json()
        setDestinations(data)
      } catch (error) {
        console.error("Error fetching trip destinations:", error)
        setError("Failed to fetch trip destinations")
      }
    }

    const handleCreateOrUpdateTrip = async (e) => {
      e.preventDefault()
      if (!booking) return

      const today = new Date()
      const  startDate = new Date(tripDetails.startDate)
      const endDate = new Date(tripDetails.endDate)
      const price = parseFloat(tripDetails.price)

      if (startDate < today) {
        setError("Start date cannot be in the past.")
        return
      }
      if (endDate < today) {
        setError("End date cannot be in the past.")
        return
      }
      if (endDate <= startDate) {
        setError("End date must be after the start date.")
        return
      }
      if (isNaN(price) || price <= 0) {
        setError("Price must be a positive number.")
        return
      }

      setLoading(true)
      setError(null)

      try {
        const formattedTripDetails = {
          ...tripDetails,
          startDate: formatDateForServer(tripDetails.startDate),
          endDate: formatDateForServer(tripDetails.endDate),
          price: price,
        }

        const url = booking.trip
          ? `${API_BASE_URL}/trip/update/${booking.trip.id}`
          : `${API_BASE_URL}/booking/${booking.id}/create-trip`
        const method = booking.trip ? "PUT" : "POST"

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedTripDetails),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to create/update trip")
        }

        const data = await response.json()
        onTripCreated(data)
        setStep("destinations")
      } catch (error) {
        console.error("Error creating/updating trip:", error)
        setError(error.message || "Failed to create/update trip")
      } finally {
        setLoading(false)
      }
    }

    const handleAddDestination = async (e) => {
      e.preventDefault()
      if (!booking || !booking.trip) return
      setLoading(true)
      setError(null)
      try {
        const formattedDestination = {
          ...newDestination,
          visitDate: formatDateForServer(newDestination.visitDate),
        }
        const response = await fetch(`${API_BASE_URL}/trip-destination/${booking.trip.id}/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedDestination),
        })
        if (!response.ok) throw new Error("Failed to add destination")
        const data = await response.json()
        setDestinations([...destinations, data])
        setNewDestination({ farmId: "", visitDate: "", description: "" })
      } catch (error) {
        console.error("Error adding destination:", error)
        setError("Failed to add destination")
      } finally {
        setLoading(false)
      }
    }

    if (!booking) return null

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {booking.trip ? "Edit Trip" : "Create Trip"}
            </DialogTitle>
            <DialogDescription>
              {step === "trip" ? "Enter trip details" : "Manage trip destinations"}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={step} onValueChange={setStep}>
            <TabsList>
              <TabsTrigger value="trip" disabled={showDestinations} className="text-black">
                Trip Details
              </TabsTrigger>
              <TabsTrigger value="destinations" disabled={!booking.trip || !showDestinations} className="text-black">
                Destinations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trip">
              <form onSubmit={handleCreateOrUpdateTrip}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={tripDetails.startDate}
                        onChange={(e) => setTripDetails({ ...tripDetails, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={tripDetails.endDate}
                        onChange={(e) => setTripDetails({ ...tripDetails, endDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="departureAirport">Departure Airport</Label>
                    <Input
                      id="departureAirport"
                      value={tripDetails.departureAirport}
                      onChange={(e) => setTripDetails({ ...tripDetails, departureAirport: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      value={tripDetails.price}
                      onChange={(e) => setTripDetails({ ...tripDetails, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={tripDetails.description}
                      onChange={(e) => setTripDetails({ ...tripDetails, description: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {booking.trip ? "Update Trip" : "Create Trip"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="destinations">
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h4 className="font-semibold mb-2">Add New Destination</h4>
                  <form onSubmit={handleAddDestination} className="space-y-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="farmId">Farm</Label>
                      <Select
                        value={newDestination.farmId}
                        onValueChange={(value) => setNewDestination({ ...newDestination, farmId: value })}
                      >
                        <SelectTrigger className="text-black">
                          <SelectValue placeholder="Select a farm" />
                        </SelectTrigger>
                        <SelectContent>
                          {farms.map((farm) => (
                            <SelectItem key={farm.id} value={farm.id}>
                              {farm.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="visitDate">Visit Date</Label>
                      <Input
                        id="visitDate"
                        type="date"
                        value={newDestination.visitDate}
                        onChange={(e) => setNewDestination({ ...newDestination, visitDate: e.target.value })}
                        required
                      />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="destinationDescription">Description</Label>
                      <Textarea
                        id="destinationDescription"
                        value={newDestination.description}
                        onChange={(e) => setNewDestination({ ...newDestination, description: e.target.value })}
                        required
                      />
                    </div>

                    <Button type="submit" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Add Destination
                    </Button>
                  </form>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Existing Destinations</h4>
                  {destinations.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Farm</TableHead>
                          <TableHead>Visit Date</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {destinations.map((destination) => (
                          <TableRow key={destination.id}>
                            <TableCell>{destination.farm.name}</TableCell>
                            <TableCell>{new Date(destination.visitDate).toLocaleDateString()}</TableCell>
                            <TableCell>{destination.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p>No destinations added yet.</p>
                  )}
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    )
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )

  if (error)
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Customer Booking Management</CardTitle>
              <CardDescription>Manage and view all customer bookings</CardDescription>
            </div>
            <Button onClick={fetchBookings} variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full md:w-[300px]"
              />
            </div>
            {/* <Button onClick={() => navigate("/createBooking")} className="w-full md:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Booking
            </Button> */}
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Customer Name</TableHead>
                  {/* <TableHead>Email</TableHead> */}
                  <TableHead>Description</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Booking Status</TableHead>
                  <TableHead>Trip Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBookings.map((booking) => (
                  <BookingRow
                    key={booking.id}
                    booking={booking}
                    onTripStatusUpdate={handleTripStatusUpdate}
                    onViewBooking={handleViewBooking}
                    onCreateOrEditTrip={handleCreateOrEditTrip}
                    onManageTripDestinations={handleManageTripDestinations}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * PAGE_SIZE + 1} to {Math.min(currentPage * PAGE_SIZE, filteredBookings.length)} of {filteredBookings.length} entries
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
      <BookingDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        bookingDetails={selectedBooking}
      />
      <CreateOrEditTripModal
        isOpen={isCreateTripModalOpen}
        onClose={() => setIsCreateTripModalOpen(false)}
        booking={selectedBooking}
        onTripCreated={handleTripCreated}
        showDestinations={false}
      />
      <CreateOrEditTripModal
        isOpen={isManageDestinationsModalOpen}
        onClose={() => setIsManageDestinationsModalOpen(false)}
        booking={selectedBooking}
        onTripCreated={handleTripCreated}
        showDestinations={true}
      />
    </div>
  )
}