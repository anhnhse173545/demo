import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"

const API_BASE_URL = 'http://localhost:8080';

export default function VarietyCrud() {
  const [varieties, setVarieties] = useState([])
  const [currentVariety, setCurrentVariety] = useState({
    id: '',
    name: '',
    description: '',
    deleted: false
  })
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchVarieties()
  }, [])

  const fetchVarieties = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/variety/list`)
      if (!response.ok) throw new Error('Failed to fetch varieties')
      const data = await response.json()
      setVarieties(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch varieties",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentVariety(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = isEditing ? `${API_BASE_URL}/api/variety/update/${currentVariety.id}` : `${API_BASE_URL}/api/variety/create`
      const method = isEditing ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentVariety)
      })
      if (!response.ok) throw new Error('Failed to save variety')
      await fetchVarieties()
      setCurrentVariety({ id: '', name: '', description: '', deleted: false })
      setIsEditing(false)
      toast({
        title: "Success",
        description: `Variety ${isEditing ? 'updated' : 'created'} successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} variety`,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (variety) => {
    setCurrentVariety(variety)
    setIsEditing(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this variety?')) return
    try {
      const response = await fetch(`${API_BASE_URL}/api/variety/delete/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete variety')
      await fetchVarieties()
      toast({
        title: "Success",
        description: "Variety deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete variety",
        variant: "destructive",
      })
    }
  }

  return (
    (<div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Variety' : 'Add New Variety'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              value={currentVariety.name}
              onChange={handleInputChange}
              placeholder="Variety Name"
              required />
            <Textarea
              name="description"
              value={currentVariety.description}
              onChange={handleInputChange}
              placeholder="Description"
              required />
            <Button type="submit">{isEditing ? 'Update' : 'Create'} Variety</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Variety List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {varieties.map((variety) => (
                <TableRow key={variety.id}>
                  <TableCell>{variety.name}</TableCell>
                  <TableCell>{variety.description}</TableCell>
                  <TableCell>
                    <Button style={{ color: 'black' }} variant="outline" className="mr-2" onClick={() => handleEdit(variety)}>Edit</Button>
                    <Button variant="destructive" onClick={() => handleDelete(variety.id)}>Delete</Button>
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