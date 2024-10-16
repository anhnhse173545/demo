import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PlusCircle, Edit, Trash2 } from 'lucide-react'

export default function TourManagerView() {
  const [tours, setTours] = useState([
    { id: 1, name: "European Adventure", destination: "Paris, Rome, Berlin", startDate: "2024-06-01", endDate: "2024-06-15", price: 2500, capacity: 20, bookedSpots: 15 },
    { id: 2, name: "Asian Explorer", destination: "Tokyo, Seoul, Bangkok", startDate: "2024-07-01", endDate: "2024-07-14", price: 3000, capacity: 18, bookedSpots: 10 },
    { id: 3, name: "African Safari", destination: "Nairobi, Maasai Mara, Serengeti", startDate: "2024-08-15", endDate: "2024-08-28", price: 4000, capacity: 12, bookedSpots: 8 },
  ])

  const [newTour, setNewTour] = useState({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
    price: "",
    capacity: "",
  })

  const [editingTour, setEditingTour] = useState(null)
  const [isAddingTour, setIsAddingTour] = useState(false)

  const handleAddTour = (e) => {
    e.preventDefault()
    const tourToAdd = {
      ...newTour,
      id: tours.length + 1,
      price: parseFloat(newTour.price),
      capacity: parseInt(newTour.capacity),
      bookedSpots: 0,
    }
    setTours([...tours, tourToAdd])
    setNewTour({ name: "", destination: "", startDate: "", endDate: "", price: "", capacity: "" })
    setIsAddingTour(false)
  }

  const handleEditTour = (tour) => {
    setEditingTour({ ...tour })
  }

  const handleUpdateTour = () => {
    setTours(tours.map(t => t.id === editingTour.id ? editingTour : t))
    setEditingTour(null)
  }

  const handleDeleteTour = (id) => {
    setTours(tours.filter(t => t.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Tour Manager</h2>
        <Button onClick={() => setIsAddingTour(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Tour
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Tour List</CardTitle>
          <CardDescription>Manage and organize your tour packages</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Booked</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tours.map((tour) => (
                <TableRow key={tour.id}>
                  <TableCell className="font-medium">{tour.name}</TableCell>
                  <TableCell>{tour.destination}</TableCell>
                  <TableCell>{`${tour.startDate} - ${tour.endDate}`}</TableCell>
                  <TableCell>${tour.price}</TableCell>
                  <TableCell>{tour.capacity}</TableCell>
                  <TableCell>{tour.bookedSpots}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditTour(tour)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteTour(tour.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Tour Dialog */}
      <Dialog open={isAddingTour} onOpenChange={setIsAddingTour}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Tour</DialogTitle>
            <DialogDescription>Enter the details for the new tour package.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddTour}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={newTour.name}
                  onChange={(e) => setNewTour({ ...newTour, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="destination" className="text-right">Destination</Label>
                <Input
                  id="destination"
                  value={newTour.destination}
                  onChange={(e) => setNewTour({ ...newTour, destination: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newTour.startDate}
                  onChange={(e) => setNewTour({ ...newTour, startDate: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newTour.endDate}
                  onChange={(e) => setNewTour({ ...newTour, endDate: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={newTour.price}
                  onChange={(e) => setNewTour({ ...newTour, price: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={newTour.capacity}
                  onChange={(e) => setNewTour({ ...newTour, capacity: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Tour</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Tour Dialog */}
      <Dialog open={!!editingTour} onOpenChange={() => setEditingTour(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tour</DialogTitle>
            <DialogDescription>Update the details for this tour package.</DialogDescription>
          </DialogHeader>
          {editingTour && (
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateTour(); }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">Name</Label>
                  <Input
                    id="edit-name"
                    value={editingTour.name}
                    onChange={(e) => setEditingTour({...editingTour, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-destination" className="text-right">Destination</Label>
                  <Input
                    id="edit-destination"
                    value={editingTour.destination}
                    onChange={(e) => setEditingTour({...editingTour, destination: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-startDate" className="text-right">Start Date</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={editingTour.startDate}
                    onChange={(e) => setEditingTour({...editingTour, startDate: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-endDate" className="text-right">End Date</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={editingTour.endDate}
                    onChange={(e) => setEditingTour({...editingTour, endDate: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-price" className="text-right">Price</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editingTour.price}
                    onChange={(e) => setEditingTour({...editingTour, price: parseFloat(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-capacity" className="text-right">Capacity</Label>
                  <Input
                    id="edit-capacity"
                    type="number"
                    value={editingTour.capacity}
                    onChange={(e) => setEditingTour({...editingTour, capacity: parseInt(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Update Tour</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}