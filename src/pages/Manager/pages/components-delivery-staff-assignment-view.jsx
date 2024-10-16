'use client'

import { useState } from 'react'
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

export function DeliveryStaffAssignmentViewJsx() {
  const [paidTours, setPaidTours] = useState([
    { id: 1, name: "European Adventure", startDate: "2024-06-01", endDate: "2024-06-15", destination: "Paris, Rome, Berlin", assignedDeliveryStaff: null },
    { id: 2, name: "Asian Explorer", startDate: "2024-07-01", endDate: "2024-07-14", destination: "Tokyo, Seoul, Bangkok", assignedDeliveryStaff: "Alex Johnson" },
    { id: 3, name: "African Safari", startDate: "2024-08-15", endDate: "2024-08-28", destination: "Nairobi, Maasai Mara, Serengeti", assignedDeliveryStaff: null },
  ])

  const [deliveryStaff, setDeliveryStaff] = useState([
    { id: 1, name: "Alex Johnson", email: "alex@example.com", specialization: "European Tours" },
    { id: 2, name: "Samantha Lee", email: "samantha@example.com", specialization: "Asian Tours" },
    { id: 3, name: "Robert Brown", email: "robert@example.com", specialization: "African Tours" },
  ])

  const [isAssigning, setIsAssigning] = useState(false)
  const [selectedTour, setSelectedTour] = useState(null)
  const [selectedStaff, setSelectedStaff] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const handleAssignStaff = () => {
    if (selectedTour && selectedStaff) {
      setPaidTours(paidTours.map(tour => 
        tour.id === selectedTour.id ? { ...tour, assignedDeliveryStaff: selectedStaff } : tour))
      setIsAssigning(false)
      setSelectedTour(null)
      setSelectedStaff("")
    }
  }

  const filteredTours = paidTours.filter(tour => 
    tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tour.assignedDeliveryStaff && tour.assignedDeliveryStaff.toLowerCase().includes(searchTerm.toLowerCase())))

  return (
    (<div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Delivery Staff Assignment</h2>
      <Card>
        <CardHeader>
          <CardTitle>Paid Tours</CardTitle>
          <CardDescription>Assign delivery staff to paid tours</CardDescription>
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
                <TableHead>Tour Name</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Assigned Delivery Staff</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTours.map((tour) => (
                <TableRow key={tour.id}>
                  <TableCell className="font-medium">{tour.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      {tour.startDate} to {tour.endDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      {tour.destination}
                    </div>
                  </TableCell>
                  <TableCell>
                    {tour.assignedDeliveryStaff ? (
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage
                            src={`/placeholder.svg?height=32&width=32`}
                            alt={tour.assignedDeliveryStaff} />
                          <AvatarFallback>{tour.assignedDeliveryStaff.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        {tour.assignedDeliveryStaff}
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
                        setSelectedTour(tour)
                        setIsAssigning(true)
                      }}>
                      <UserPlus className="h-4 w-4 mr-1" />
                      {tour.assignedDeliveryStaff ? "Reassign" : "Assign"}
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
            <DialogTitle>Assign Delivery Staff</DialogTitle>
            <DialogDescription>
              Select a delivery staff member to assign to {selectedTour?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              
              <Label htmlFor="staff" className="text-right">
                Delivery Staff
              </Label>
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {deliveryStaff.map((staff) => (
                    <SelectItem key={staff.id} value={staff.name}>
                      {staff.name} - {staff.specialization}
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