

// {
//   "id": "BO0002",
//   "customer": {
//     "id": "AC0001",
//     "name": "Nguyen Van A",
//     "email": "customer1@test.com",
//     "phone": null,
//     "role": "Customer",
//     "profile_image": null
//   },
// "saleStaff": {
// "id": "AC0002",
// "name": "S1",
// "phone": "21",
// "email": "s@1",
// "role": "Sales Staff",
// "profile_image": null
// },
//   "trip": {
//     "id": "TR0002",
//     "startDate": "2024-09-11T08:00:00",
//     "endDate": "2024-09-14T17:00:00",
//     "departureAirport": "SGN",
//     "description": "Visit to Asagi and Shusui.",
//     "price": 600,
//     "status": "Pending",
//     "tripDestinations": [
//       {
//         "id": "TD0003",
//         "farm": {
//           "id": "FA0003",
//           "address": "789 Sakura Hill, Okayama, Japan",
//           "phoneNumber": "0862712345",
//           "name": "Momotaro Koi Farm"
//         },
//         "visitDate": "2024-09-12T00:00:00",
//         "description": "Visit to Momotaro Koi Farm for Asagi and Shusui."
//       },
//        {
  //         "id": "TD0003",
  //         "farm": {
  //           "id": "FA0003",
  //           "address": "789 Sakura Hill, Okayama, Japan",
  //           "phoneNumber": "0862712345",
  //           "name": "Momotaro Koi Farm"
  //         },
  //         "visitDate": "2024-09-12T00:00:00",
  //         "description": "Visit to Momotaro Koi Farm for Asagi and Shusui."
  //       },
//     ]
//   }

'use client';;
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, MapPin, Search } from 'lucide-react'
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
  baseURL: 'http://localhost:8080',
  timeout: 5000,
})

export function QuotesReview() {
  // State to store quotes, search term, and loading status
  const [quotes, setQuotes] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Function to fetch quotes from the API
  const fetchQuotes = useCallback(async () => {
    try {
      const response = await api.get('/api/booking/trip-status/Pending')
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

  // Fetch quotes when the component mounts
  useEffect(() => {
    fetchQuotes()
  }, [fetchQuotes])

  // Filter quotes based on the search term
  const filteredQuotes = quotes.filter(quote =>
    quote.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.trip.tripDestinations[0].farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.saleStaff.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Function to handle viewing quote details
  const handleViewDetails = (quoteId) => {
    // TODO: Implement navigation to quote details page
    console.log(`View details for quote ${quoteId}`)
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
                    <Badge variant={quote.status === "Delivered" ? "success" : "warning"}>
                      {quote.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(quote.id)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>)
  );
}