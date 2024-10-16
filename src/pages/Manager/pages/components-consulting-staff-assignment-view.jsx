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

export function ConsultingStaffAssignmentViewJsx() {
  const [paidTours, setPaidTours] = useState([
    {
      "id": "BO0002",
      "customer": {
        "id": "AC0002",
        "name": "Tran Thi B",
        "phone": null,
        "email": "customer2@test.com",
        "role": "Customer",
        "profile_image": null
      },
      "trip": {
        "id": "TR0002",
        "startDate": "2024-10-01T08:00:00",
        "endDate": "2024-10-04T17:00:00",
        "departureAirport": "HAN",
        "description": null,
        "price": 600,
        "status": "Upcoming",
        "tripDestinations": [
          {
            "id": "TD0003",
            "farm": {
              "id": "FA0003",
              "address": "789 Koi Avenue, Ojiya, Niigata, Japan",
              "phoneNumber": "0258123457",
              "name": "Hoshikin Koi Farm",
              "image": null,
              "varieties": [
                {
                  "id": "VA0004",
                  "name": "Asagi",
                  "description": "Blue body with red patterns, known for its unique coloration."
                },
                {
                  "id": "VA0005",
                  "name": "Shusui",
                  "description": "Scaleless version of Asagi with similar colors."
                }
              ]
            },
            "visitDate": "2024-10-02T00:00:00",
            "description": "Visit to Hoshikin Koi Farm for Asagi and Shusui."
          }
        ]
      },
      "description": "Interested in purchasing Asagi and Shusui Koi.",
      "createAt": "2024-09-15T10:00:00",
      "tripPayment": 10000,
      "status": "Confirmed",
      "saleStaff": {
        "id": "AC0003",
        "name": "Le Van C",
        "phone": null,
        "email": "salestaff2@test.com",
        "role": "Sale Staff",
        "profile_image": null
      },
      "consultingStaff": {},
      "deliveryStaff": {},
      "fishOrders": []
    },
    {
      "id": "BO0003",
      "customer": {
        "id": "AC0003",
        "name": "Pham Minh D",
        "phone": null,
        "email": "customer3@test.com",
        "role": "Customer",
        "profile_image": null
      },
      "trip": {
        "id": "TR0003",
        "startDate": "2024-11-10T08:00:00",
        "endDate": "2024-11-15T17:00:00",
        "departureAirport": "SGN",
        "description": null,
        "price": 750,
        "status": "Upcoming",
        "tripDestinations": [
          {
            "id": "TD0004",
            "farm": {
              "id": "FA0004",
              "address": "101 Koi Farm Road, Ojiya, Niigata, Japan",
              "phoneNumber": "0258987654",
              "name": "Koi Farm Japan",
              "image": null,
              "varieties": [
                {
                  "id": "VA0006",
                  "name": "Kohaku",
                  "description": "White body with red patterns, one of the most popular Koi varieties."
                }
              ]
            },
            "visitDate": "2024-11-11T00:00:00",
            "description": "Visit to Koi Farm Japan for Kohaku."
          }
        ]
      },
      "description": "Looking to buy Kohaku Koi.",
      "createAt": "2024-09-20T10:00:00",
      "tripPayment": 5000,
      "status": "Confirmed",
      "saleStaff": {
        "id": "AC0004",
        "name": "Nguyen Thi E",
        "phone": null,
        "email": "salestaff3@test.com",
        "role": "Sale Staff",
        "profile_image": null
      },
      "consultingStaff": {},
      "deliveryStaff": {},
      "fishOrders": []
    },
    {
      "id": "BO0004",
      "customer": {
        "id": "AC0004",
        "name": "Hoang Van F",
        "phone": null,
        "email": "customer4@test.com",
        "role": "Customer",
        "profile_image": null
      },
      "trip": {
        "id": "TR0004",
        "startDate": "2024-12-05T08:00:00",
        "endDate": "2024-12-08T17:00:00",
        "departureAirport": "HAN",
        "description": null,
        "price": 800,
        "status": "Upcoming",
        "tripDestinations": [
          {
            "id": "TD0005",
            "farm": {
              "id": "FA0005",
              "address": "234 Nishikigoi Street, Ojiya, Niigata, Japan",
              "phoneNumber": "0258123458",
              "name": "Koi World",
              "image": null,
              "varieties": [
                {
                  "id": "VA0007",
                  "name": "Shiro Utsuri",
                  "description": "White body with black patterns, known for its stunning appearance."
                },
                {
                  "id": "VA0008",
                  "name": "Budo Goromo",
                  "description": "White body with red patterns and black accents."
                }
              ]
            },
            "visitDate": "2024-12-06T00:00:00",
            "description": "Visit to Koi World for Shiro Utsuri and Budo Goromo."
          }
        ]
      },
      "description": "Interested in purchasing Shiro Utsuri and Budo Goromo Koi.",
      "createAt": "2024-09-25T10:00:00",
      "tripPayment": 5600,
      "status": "Confirmed",
      "saleStaff": {
        "id": "AC0005",
        "name": "Tran Van G",
        "phone": null,
        "email": "salestaff4@test.com",
        "role": "Sale Staff",
        "profile_image": null
      },
      "consultingStaff": {},
      "deliveryStaff": {},
      "fishOrders": []
    }
  ])

  const [salesStaff, setSalesStaff] = useState([
    {
      "id": "AC0002",
      "name": "Nguyen Van B",
      "phone": null,
      "email": "salestaff1@test.com",
      "role": "Sale Staff",
      "profile_image": null
    },
    {
      "id": "AC0009",
      "name": "Nguyen Van G",
      "phone": null,
      "email": "salestaff2@test.com",
      "role": "Sale Staff",
      "profile_image": null
    },
    {
      "id": "AC0016",
      "name": "Nguyen Van L",
      "phone": null,
      "email": "salestaff3@test.com",
      "role": "Sale Staff",
      "profile_image": null
    }
  ])

  const [consultingStaff, setConsultingStaff] = useState([
    {
    "id": "AC0004",
    "name": "Nguyen Van D",
    "phone": null,
    "email": "consultingstaff1@test.com",
    "role": "Consulting Staff",
    "profile_image": null
    },
    {
    "id": "AC0011",
    "name": "Nguyen Van I",
    "phone": null,
    "email": "consultingstaff2@test.com",
    "role": "Consulting Staff",
    "profile_image": null
    },
    {
    "id": "AC0018",
    "name": "Nguyen Van N",
    "phone": null,
    "email": "consultingstaff3@test.com",
    "role": "Consulting Staff",
    "profile_image": null
    }
  ])

  const [isAssigning, setIsAssigning] = useState(false)
  const [selectedTour, setSelectedTour] = useState(null)
  const [selectedStaff, setSelectedStaff] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const handleAssignStaff = () => {
    if (selectedTour && selectedStaff) {
      setPaidTours(paidTours.map(tour => 
        tour.id === selectedTour.id ? { ...tour, consultingStaff: consultingStaff.find(staff => staff.id === selectedStaff) } : tour
      ))
      setIsAssigning(false)
      setSelectedTour(null)
      setSelectedStaff("")
    }
  }

  const filteredTours = paidTours.filter(tour => 
    tour.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.trip.tripDestinations[0].farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tour.consultingStaff.name && tour.consultingStaff.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Consulting Staff Assignment</h2>
      <Card>
        <CardHeader>
          <CardTitle>Confirmed Tours</CardTitle>
          <CardDescription>Assign consulting staff to confirmed tours</CardDescription>
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
                <TableHead>Sales Staff</TableHead>
                <TableHead>Trip Destination</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead>Booking Status</TableHead>
                <TableHead>Assigned Consulting Staff</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTours.map((tour) => (
                <TableRow key={tour.id}>
                  <TableCell className="font-medium">{tour.customer.name}</TableCell>
                  <TableCell>{tour.saleStaff.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      {tour.trip.tripDestinations[0].farm.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      {new Date(tour.trip.startDate).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })} to {new Date(tour.trip.endDate).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                    </div>
                  </TableCell>
                  <TableCell>
                  <Badge variant={tour.status === "Confirmed" ? "success" : "warning"}>
                      {tour.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {tour.consultingStaff.name ? (
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={tour.consultingStaff.profile_image || `/placeholder.svg?height=32&width=32`} alt={tour.consultingStaff.name} />
                          <AvatarFallback>{tour.consultingStaff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        {tour.consultingStaff.name}
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
                      {tour.consultingStaff.name ? "Reassign" : "Assign"}
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
            <DialogTitle>Assign Consulting Staff</DialogTitle>
            <DialogDescription>
              Select a consulting staff member to assign to {selectedTour?.customer.name}&apos;s tour.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="staff" className="text-right">
                Consulting Staff
              </Label>
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {consultingStaff.map((staff) => (
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
    </div>
  )
}