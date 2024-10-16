import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlus, UserCircle, Briefcase, Truck, Star } from 'lucide-react'

export default function StaffManagerView() {
  const [staffList, setStaffList] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Sales Staff', performance: 4.5 },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Consulting Staff', performance: 4.2 },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Delivery Staff', performance: 4.8 },
  ])
  const [isAdding, setIsAdding] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)

  const addStaff = (newStaff) => {
    setStaffList([...staffList, { id: staffList.length + 1, ...newStaff }])
    setIsAdding(false)
  }

  const updateStaff = (id, updatedStaff) => {
    setStaffList(staffList.map(staff => staff.id === id ? { ...staff, ...updatedStaff } : staff))
    setEditingStaff(null)
  }

  const deleteStaff = (id) => {
    setStaffList(staffList.filter(staff => staff.id !== id))
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Staff Manager</h2>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage your staff and their roles</CardDescription>
          </div>
          <Button variant="outline" onClick={() => setIsAdding(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </CardHeader>
        <CardContent>
          {isAdding ? (
            <AddStaffForm onAddStaff={addStaff} onCancel={() => setIsAdding(false)} />
          ) : editingStaff ? (
            <EditStaffForm staff={editingStaff} onUpdateStaff={updateStaff} onCancel={() => setEditingStaff(null)} />
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Staff</TabsTrigger>
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="consulting">Consulting</TabsTrigger>
                <TabsTrigger value="delivery">Delivery</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <StaffList staffList={staffList} onEdit={setEditingStaff} onDelete={deleteStaff} />
              </TabsContent>
              <TabsContent value="sales">
                <StaffList staffList={staffList.filter(staff => staff.role === 'Sales Staff')} onEdit={setEditingStaff} onDelete={deleteStaff} />
              </TabsContent>
              <TabsContent value="consulting">
                <StaffList staffList={staffList.filter(staff => staff.role === 'Consulting Staff')} onEdit={setEditingStaff} onDelete={deleteStaff} />
              </TabsContent>
              <TabsContent value="delivery">
                <StaffList staffList={staffList.filter(staff => staff.role === 'Delivery Staff')} onEdit={setEditingStaff} onDelete={deleteStaff} />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StaffList({ staffList, onEdit, onDelete }) {
  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
      {staffList.map((staff) => (
        <li key={staff.id} className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={staff.name} />
                <AvatarFallback>{staff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{staff.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{staff.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={
                staff.role === 'Sales Staff' ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700' :
                staff.role === 'Consulting Staff' ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700' :
                'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700'
              }>
                {staff.role === 'Sales Staff' && <UserCircle className="h-4 w-4 mr-1" />}
                {staff.role === 'Consulting Staff' && <Briefcase className="h-4 w-4 mr-1" />}
                {staff.role === 'Delivery Staff' && <Truck className="h-4 w-4 mr-1" />}
                {staff.role}
              </Badge>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{staff.performance}</span>
              </div>
            </div>
          </div>
          <div className="mt-2 flex justify-end space-x-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(staff)}>Edit</Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(staff.id)}>Delete</Button>
          </div>
        </li>
      ))}
    </ul>
  )
}

function AddStaffForm({ onAddStaff, onCancel }) {
  const [newStaff, setNewStaff] = useState({ name: '', email: '', role: '', performance: 0 })

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddStaff(newStaff)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={newStaff.name}
          onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={newStaff.email}
          onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Select
          value={newStaff.role}
          onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sales Staff">Sales Staff</SelectItem>
            <SelectItem value="Consulting Staff">Consulting Staff</SelectItem>
            <SelectItem value="Delivery Staff">Delivery Staff</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="performance">Initial Performance Rating</Label>
        <Input
          id="performance"
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={newStaff.performance}
          onChange={(e) => setNewStaff({ ...newStaff, performance: parseFloat(e.target.value) })}
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Add Staff</Button>
      </div>
    </form>
  )
}

function EditStaffForm({ staff, onUpdateStaff, onCancel }) {
  const [editedStaff, setEditedStaff] = useState(staff)

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdateStaff(staff.id, editedStaff)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={editedStaff.name}
          onChange={(e) => setEditedStaff({ ...editedStaff, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={editedStaff.email}
          onChange={(e) => setEditedStaff({ ...editedStaff, email: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Select
          value={editedStaff.role}
          onValueChange={(value) => setEditedStaff({ ...editedStaff, role: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sales Staff">Sales Staff</SelectItem>
            <SelectItem value="Consulting Staff">Consulting Staff</SelectItem>
            <SelectItem value="Delivery Staff">Delivery Staff</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="performance">Performance Rating</Label>
        <Input
          id="performance"
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={editedStaff.performance}
          onChange={(e) => setEditedStaff({ ...editedStaff, performance: parseFloat(e.target.value) })}
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Update Staff</Button>
      </div>
    </form>
  )
}