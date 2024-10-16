'use client';
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, MapPin, Phone, Mail } from 'lucide-react';

export function QuoteDetails() {
  const [quote, setQuote] = useState(null)

  useEffect(() => {
    // In a real application, you would fetch the quote data from an API
    // For this example, we'll use the sample data


    // For demonstration purposes, we'll just use the first quote in the array
    setQuote(sampleQuotes[0])
  }, [])

  const handleApprove = () => {
    // Implement approve logic here
    console.log('Quote approved')
    // Update quote status
    setQuote(prevQuote => prevQuote ? {...prevQuote, status: 'Approved'} : null)
  }

  const handleReject = () => {
    // Implement reject logic here
    console.log('Quote rejected')
    // Update quote status
    setQuote(prevQuote => prevQuote ? {...prevQuote, status: 'Rejected'} : null)
  }

  if (!quote) {
    return <div>Loading...</div>;
  }

  return (
    (<div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Quote Details</CardTitle>
          <CardDescription>Review and manage quote #{quote.id}</CardDescription>
        </CardHeader>
        <CardContent>
              <Badge
                variant={quote.status === "Approved" ? "success" : quote.status === "Rejected" ? "destructive" : "warning"}>
                {quote.status}
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
                      src={quote.customer.profile_image || `/placeholder.svg?height=40&width=40`} />
                    <AvatarFallback>{quote.customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{quote.customer.name}</div>
                    <div className="text-sm text-muted-foreground">{quote.customer.role}</div>
                  </div>
                </div>
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
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage
                      src={quote.saleStaff.profile_image || `/placeholder.svg?height=40&width=40`} />
                    <AvatarFallback>{quote.saleStaff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{quote.saleStaff.name}</div>
                    <div className="text-sm text-muted-foreground">{quote.saleStaff.role}</div>
                  </div>
                </div>
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
                <h4 className="font-medium mb-2">Description: ${quote.trip.description}</h4>
                
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
          {/* <Card>
            <CardHeader>
              <CardTitle>Quote Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant={quote.status === "Approved" ? "success" : quote.status === "Rejected" ? "destructive" : "warning"}>
                {quote.status}
              </Badge>
            </CardContent>
          </Card> */}
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={quote.status !== 'Pending'}>
            Reject Quote
          </Button>
          <Button
            variant="default"
            onClick={handleReject}
            disabled={quote.status !== 'Pending'}>
            Re-assign for Update
          </Button>
          <Button
            variant="default"
            onClick={handleApprove}
            disabled={quote.status !== 'Pending'}>
            Approve Quote
          </Button>
        </CardFooter>
      </Card>
    </div>)
  );
}