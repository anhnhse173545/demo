'use client'

import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, UserPlus, Calendar, MapPin } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"

const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000,
})

export function SalesStaffAssignmentViewComponent() {
  const [bookings, setBookings] = useState([])
  const [salesStaff, setSalesStaff] = useState([])
  const [isAssigning, setIsAssigning] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [selectedStaff, setSelectedStaff] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const fetchSalesStaff = useCallback(async () => {
    try {
      const response = await api.get('/accounts/Sale Staff/all')
      setSalesStaff(response.data)
    } catch (error) {
      console.error('Error fetching sales staff:', error)
      toast({
        title: "Error",
        description: "Failed to fetch sales staff. Please try again.",
        variant: "destructive",
      })
    }
  }, [])

  const fetchBookings = useCallback(async () => {
    try {
      const response = await api.get('/api/booking/list')
      setBookings(response.data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast({
        title: "Error",
        description: "Failed to fetch bookings. Please try again.",
        variant: "destructive",
      })
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      await Promise.all([fetchSalesStaff(), fetchBookings()])
      setIsLoading(false)
    }
    fetchData()
  }, [fetchSalesStaff, fetchBookings])

  const handleAssignStaff = async () => {
    if (selectedBooking && selectedStaff) {
      try {
        await api.put(`/api/booking/update/${selectedBooking.id}`, {
          "staff-id": selectedStaff,
          "status": "Requested"
        })
        await fetchBookings()
        setIsAssigning(false)
        setSelectedBooking(null)
        setSelectedStaff("")
        toast({
          title: "Success",
          description: "Staff assigned successfully.",
        })
      } catch (error) {
        console.error('Error assigning staff:', error)
        toast({
          title: "Error",
          description: "Failed to assign staff. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const filteredBookings = bookings.filter(booking => 
    booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.trip.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (booking.saleStaff?.name && booking.saleStaff.name.toLowerCase().includes(searchTerm.toLowerCase())))

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    (<div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Sales Staff Assignment</h2>
      <Card>
        <CardHeader>
          <CardTitle>Requested Tours</CardTitle>
          <CardDescription>Assign sales staff to requested tours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tours or staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8" />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Customer Request Summary</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Booking Status</TableHead>
                <TableHead>Assigned Sales Staff</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.customer.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      {booking.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      {new Date(booking.createAt).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={booking.status === "Confirmed" ? "success" : "warning"}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {booking.saleStaff ? (
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage
                            src={booking.saleStaff.profile_image || `/placeholder.svg?height=32&width=32`}
                            alt={booking.saleStaff.name} />
                          <AvatarFallback>{booking.saleStaff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        {booking.saleStaff.name}
                      </div>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        Unassigned
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedBooking(booking)
                        setIsAssigning(true)
                      }}>
                      <UserPlus className="h-4 w-4 mr-1" />
                      {booking.saleStaff ? "Reassign" : "Assign"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={isAssigning} onOpenChange={setIsAssigning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Sales Staff</DialogTitle>
            <DialogDescription>
              Select a sales staff member to assign to {selectedBooking?.customer.name}&apos;s tour.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="staff" className="text-right">
                Sales Staff
              </Label>
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {salesStaff.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAssignStaff}>Assign Staff</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>)
  );
}