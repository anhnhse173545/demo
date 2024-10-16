'use client'

import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, MapPin, Search, Phone, Mail, ArrowLeft } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: 'http://localhost:8081',
  timeout: 5000,
})

export function QuoteManagementSystemComponent() {
  const [quotes, setQuotes] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [viewMode, setViewMode] = useState('list') // 'list' or 'details'

  const fetchQuotes = useCallback(async () => {
    try {
      const response = await api.get('/api/booking/trip/Pending')
      setQuotes(response.data)
    } catch (error) {
      console.error('Error fetching quotes:', error)
      toast({
        title: "Error",
        description: "Failed to fetch quotes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQuotes()
  }, [fetchQuotes])

  const filteredQuotes = quotes.filter(quote =>
    quote.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.trip.tripDestinations[0].farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.saleStaff.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleViewDetails = (quote) => {
    setSelectedQuote(quote)
    setViewMode('details')
  }

  const handleBackToList = () => {
    setSelectedQuote(null)
    setViewMode('list')
  }

  const handleApprove = async () => {
    try {
      await api.put(`/api/booking/update/${selectedQuote.id}`, {
        status: 'Approved'
      })
      setSelectedQuote(prevQuote => ({ ...prevQuote, status: 'Approved' }))
      toast({
        title: "Success",
        description: "Quote approved successfully.",
      })
    } catch (error) {
      console.error('Error approving quote:', error)
      toast({
        title: "Error",
        description: "Failed to approve quote. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReject = async () => {
    try {
      await api.put(`/api/booking/update/${selectedQuote.id}`, {
        status: 'Rejected'
      })
      setSelectedQuote(prevQuote => ({ ...prevQuote, status: 'Rejected' }))
      toast({
        title: "Success",
        description: "Quote rejected successfully.",
      })
    } catch (error) {
      console.error('Error rejecting quote:', error)
      toast({
        title: "Error",
        description: "Failed to reject quote. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReassign = async () => {
    try {
      await api.put(`/api/booking/update/${selectedQuote.id}`, {
        status: 'Reassigned'
      })
      setSelectedQuote(prevQuote => ({ ...prevQuote, status: 'Reassigned' }))
      toast({
        title: "Success",
        description: "Quote reassigned successfully.",
      })
    } catch (error) {
      console.error('Error reassigning quote:', error)
      toast({
        title: "Error",
        description: "Failed to reassign quote. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    (<div className="container mx-auto py-10">
      {viewMode === 'list' ? (
        <Card>
          <CardHeader>
            <CardTitle>Quotes Review</CardTitle>
            <CardDescription>Review and manage trip quotes assigned to customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search quotes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8" />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Trip Details</TableHead>
                  <TableHead>Sales Staff</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage
                            src={quote.customer.profile_image || `/placeholder.svg?height=32&width=32`} />
                          <AvatarFallback>{quote.customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{quote.customer.name}</div>
                          <div className="text-sm text-muted-foreground">{quote.customer.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{quote.trip.tripDestinations[0].farm.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {new Date(quote.trip.startDate).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })} - {new Date(quote.trip.endDate).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          {quote.trip.departureAirport}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage
                            src={quote.saleStaff.profile_image || `/placeholder.svg?height=32&width=32`} />
                          <AvatarFallback>{quote.saleStaff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{quote.saleStaff.name}</div>
                          <div className="text-sm text-muted-foreground">{quote.saleStaff.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium flex items-center">
                        <DollarSign className="mr-1 h-4 w-4" />
                        {quote.trip.price}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={quote.status === "Approved" ? "success" : "warning"}>
                        {quote.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(quote)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Quote Details</CardTitle>
                <CardDescription>Review and manage quote #{selectedQuote.id}</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleBackToList}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to List
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Badge
              variant={selectedQuote.status === "Approved" ? "success" : selectedQuote.status === "Rejected" ? "destructive" : "warning"}>
              {selectedQuote.status}
            </Badge>
          </CardContent>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={selectedQuote.customer.profile_image || `/placeholder.svg?height=40&width=40`} />
                      <AvatarFallback>{selectedQuote.customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{selectedQuote.customer.name}</div>
                      <div className="text-sm text-muted-foreground">{selectedQuote.customer.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedQuote.customer.email}</span>
                  </div>
                  {selectedQuote.customer.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedQuote.customer.phone}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Sales Staff Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={selectedQuote.saleStaff.profile_image || `/placeholder.svg?height=40&width=40`} />
                      <AvatarFallback>{selectedQuote.saleStaff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{selectedQuote.saleStaff.name}</div>
                      <div className="text-sm text-muted-foreground">{selectedQuote.saleStaff.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedQuote.saleStaff.email}</span>
                  </div>
                  {selectedQuote.saleStaff.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedQuote.saleStaff.phone}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(selectedQuote.trip.startDate).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })} - 
                    {new Date(selectedQuote.trip.endDate).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Departure: {selectedQuote.trip.departureAirport}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>Price: ${selectedQuote.trip.price}</span>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Description:</h4>
                  <p>{selectedQuote.trip.description}</p>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Destinations:</h4>
                  {selectedQuote.trip.tripDestinations.map((destination) => (
                    <div key={destination.id} className="mb-2">
                      <div className="font-medium">{destination.farm.name}</div>
                      <div className="text-sm text-muted-foreground">{destination.description}</div>
                      <div className="text-sm text-muted-foreground">Visit Date: {new Date(destination.visitDate).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={selectedQuote.status !== 'Pending'}>
              Reject Quote
            </Button>
            <Button
              variant="default"
              onClick={handleReassign}
              disabled={selectedQuote.status !== 'Pending'}>
              Re-assign for Update
            </Button>
            <Button
              variant="default"
              onClick={handleApprove}
              disabled={selectedQuote.status !== 'Pending'}>
              Approve Quote
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>)
  );
}