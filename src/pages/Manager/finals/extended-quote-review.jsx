'use client'

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, MapPin, Search, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"

const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000,
})

export function ExtendedQuoteReviewComponent() {
  const [quotes, setQuotes] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [expandedQuoteId, setExpandedQuoteId] = useState(null)

  const fetchQuotes = useCallback(async () => {
    setIsLoading(true);
    const statuses = ['Pending', 'Redo', 'Approved'];
    let allQuotes = [];
    let errors = [];

    for (const status of statuses) {
      try {
        const response = await api.get(`/api/booking/trip-status/${status}`);
        allQuotes = [...allQuotes, ...response.data];
      } catch (error) {
        console.error(`Error fetching ${status} quotes:`, error);
        errors.push(status);
      }
    }

    if (allQuotes.length > 0) {
      setQuotes(allQuotes);
    } else {
      toast({
        title: "Error",
        description: "Failed to fetch any quotes. Please try again.",
        variant: "destructive",
      });
    }

    if (errors.length > 0) {
      toast({
        title: "Warning",
        description: `Unable to fetch quotes for statuses: ${errors.join(', ')}`,
        variant: "warning",
      });
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchQuotes()
  }, [fetchQuotes])

  const filteredQuotes = quotes.filter(quote =>
    quote.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.trip.tripDestinations.some(dest => dest.farm.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    quote.saleStaff.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleToggleDetails = (quoteId) => {
    setExpandedQuoteId(expandedQuoteId === quoteId ? null : quoteId)
  }

  const handleApprove = async (quoteId) => {
    try {
      const quote = quotes.find(q => q.id === quoteId);
      if (!quote) {
        throw new Error('Quote not found');
      }
      const newStatus = quote.trip.status === "Approved" ? "Pending" : "Approved";
      console.log(`handle${newStatus} called for quote:`, quoteId);

      await api.put(`/api/trip/update/${quote.trip.id}`, {
        startDate: quote.trip.startDate,
        endDate: quote.trip.endDate,
        departureAirport: quote.trip.departureAirport,
        description: quote.trip.description,
        price: quote.trip.price,
        status: "Approved"
      });

      setQuotes(prevQuotes => prevQuotes.map(q => 
        q.id === quoteId ? {...q, trip: {...q.trip, status: newStatus}} : q));

      toast({
        title: "Success",
        description: `Quote has been ${newStatus === "Approved" ? "approved" : "un-approved"}.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating quote:', error);
      toast({
        title: "Error",
        description: "Failed to update quote. Please try again.",
        variant: "destructive",
      });
    }
  }

  const handleRedo = async (quoteId) => {
    try {
      const quote = quotes.find(q => q.id === quoteId);
      if (!quote) {
        throw new Error('Quote not found');
      }
      const newStatus = quote.trip.status === "Redo" ? "Pending" : "Redo";
      console.log(`handle${newStatus} called for quote:`, quoteId);

      await api.put(`/api/trip/update/${quote.trip.id}`, {
        startDate: quote.trip.startDate,
        endDate: quote.trip.endDate,
        departureAirport: quote.trip.departureAirport,
        description: quote.trip.description,
        price: quote.trip.price,
        status: "Redo"
      });
    
      setQuotes(prevQuotes => prevQuotes.map(q => 
        q.id === quoteId ? {...q, trip: {...q.trip, status: newStatus}} : q));
    
      toast({
        title: "Success",
        description: `Quote has been ${newStatus === "Redo" ? "set to Redo" : "set back to Pending"} status.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating quote:', error);
      toast({
        title: "Error",
        description: "Failed to update quote status. Please try again.",
        variant: "destructive",
      });
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    (<div className="container mx-auto py-10">
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
          {quotes.length === 0 ? (
            <div className="text-center py-4">No quotes available.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Trip Details</TableHead>
                  <TableHead>Sales Staff</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Booking Status</TableHead>
                  <TableHead>Quote Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => (
                  <React.Fragment key={quote.id}>
                    <TableRow>
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
                          <div className="font-medium">{quote.trip.tripDestinations.map(dest => dest.farm.name).join(', ')}</div>
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
                        <Badge
                          variant={quote.status === "Approved" ? "success" : quote.status === "Rejected" ? "destructive" : "warning"}>
                          {quote.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={quote.trip.status === "Approved" ? "success" : quote.status === "Rejected" ? "destructive" : "warning"}>
                          {quote.trip.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => handleToggleDetails(quote.id)}>
                          {expandedQuoteId === quote.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          {expandedQuoteId === quote.id ? 'Hide Details' : 'View Details'}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedQuoteId === quote.id && (
                      <TableRow>
                        <TableCell colSpan={7}>
                          <Card>
                            <CardContent className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <Card>
                                  <CardHeader>
                                    <CardTitle>Customer Information</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <Mail className="h-4 w-4 text-muted-foreground" />
                                      <span>{quote.customer.email}</span>
                                    </div>
                                    {quote.customer.phone && (
                                      <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{quote.customer.phone}</span>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardHeader>
                                    <CardTitle>Sales Staff Information</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <Mail className="h-4 w-4 text-muted-foreground" />
                                      <span>{quote.saleStaff.email}</span>
                                    </div>
                                    {quote.saleStaff.phone && (
                                      <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{quote.saleStaff.phone}</span>
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
                                <Badge
                                  variant={quote.trip.status === "Approved" ? "success" : quote.status === "Rejected" ? "destructive" : "warning"}>
                                  {quote.trip.status}
                                </Badge>
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                      {new Date(quote.trip.startDate).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })} - 
                                      {new Date(quote.trip.endDate).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>Departure: {quote.trip.departureAirport}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    <span>Price: ${quote.trip.price}</span>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Description: {quote.trip.description}</h4>
                                  </div>
                                  <div className="mt-4">
                                    <h4 className="font-medium mb-2">Destinations:</h4>
                                    {quote.trip.tripDestinations.map((destination) => (
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
                              <Button variant="destructive" onClick={() => handleRedo(quote.id)}>
                                Redo Quote
                              </Button>
                              <Button variant="default" onClick={() => handleApprove(quote.id)}>
                                Approve Quote
                              </Button>
                            </CardFooter>
                          </Card>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>)
  );
}