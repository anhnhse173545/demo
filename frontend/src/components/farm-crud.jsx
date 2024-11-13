import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ReloadIcon, Cross2Icon, PlusIcon } from "@radix-ui/react-icons"
import { ScrollArea } from "@/components/ui/scroll-area"

const API_BASE_URL = 'http://localhost:8080';

export function FarmCrudComponent() {
  const [farms, setFarms] = useState([])
  const [varieties, setVarieties] = useState([])
  const [currentFarm, setCurrentFarm] = useState({
    id: '',
    name: '',
    address: '',
    phoneNumber: '',
    isDeleted: false,
    varieties: [],
    imageUrl: ''
  })
  const [selectedVarietyId, setSelectedVarietyId] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchFarms()
    fetchVarieties()
  }, [])

  const fetchFarms = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/farm/list`)
      if (!response.ok) throw new Error('Failed to fetch farms')
      const data = await response.json()
      setFarms(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch farms",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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
    setCurrentFarm(prev => ({ ...prev, [name]: value }))
  }

  const handleAddVariety = () => {
    if (selectedVarietyId && !currentFarm.varieties.some(v => v.id === selectedVarietyId)) {
      const varietyToAdd = varieties.find(v => v.id === selectedVarietyId)
      setCurrentFarm(prev => ({
        ...prev,
        varieties: [...prev.varieties, varietyToAdd]
      }))
      setSelectedVarietyId('')
    }
  }

  const handleRemoveVariety = (varietyId) => {
    setCurrentFarm(prev => ({
      ...prev,
      varieties: prev.varieties.filter(v => v.id !== varietyId)
    }))
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const uploadImage = async (farmId) => {
    if (!imageFile) return null

    const formData = new FormData()
    formData.append('file', imageFile)

    try {
      const response = await fetch(`${API_BASE_URL}/media/farm/${farmId}/upload/image`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to upload image')

      const data = await response.json()
      return data.imageUrl
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload farm image",
        variant: "destructive",
      })
      return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const url = isEditing ? `${API_BASE_URL}/api/farm/update/${currentFarm.id}` : `${API_BASE_URL}/api/farm/create`
      const method = isEditing ? 'PUT' : 'POST'
      const farmData = {
        ...currentFarm,
        varietyIds: currentFarm.varieties.map(v => v.id)
      }
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(farmData)
      })
      if (!response.ok) throw new Error('Failed to save farm')
      
      const savedFarm = await response.json()
      
      if (imageFile) {
        const imageUrl = await uploadImage(savedFarm.id)
        if (imageUrl) {
          savedFarm.imageUrl = imageUrl
          await fetch(`${API_BASE_URL}/api/farm/update/${savedFarm.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(savedFarm)
          })
        }
      }
      
      await fetchFarms()
      resetForm()
      toast({
        title: "Success",
        description: `Farm ${isEditing ? 'updated' : 'created'} successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} farm`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (farm) => {
    setCurrentFarm(farm)
    setIsEditing(true)
    setImageFile(null)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this farm?')) return
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/farm/delete/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete farm')
      await fetchFarms()
      toast({
        title: "Success",
        description: "Farm deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete farm",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setCurrentFarm(
      { id: '', name: '', address: '', phoneNumber: '', isDeleted: false, varieties: [], imageUrl: '' }
    )
    setSelectedVarietyId('')
    setIsEditing(false)
    setImageFile(null)
  }

  return (
    (<div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Farm' : 'Add New Farm'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              value={currentFarm.name}
              onChange={handleInputChange}
              placeholder="Farm Name"
              required />
            <Input
              name="address"
              value={currentFarm.address}
              onChange={handleInputChange}
              placeholder="Address"
              required />
            <Input
              name="phoneNumber"
              value={currentFarm.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone Number"
              required />
            <div className="flex space-x-2">
              <Select value={selectedVarietyId} onValueChange={setSelectedVarietyId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Variety" />
                </SelectTrigger>
                <SelectContent>
                  {varieties.map((variety) => (
                    <SelectItem key={variety.id} value={variety.id}>{variety.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={handleAddVariety} disabled={!selectedVarietyId}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>
            <ScrollArea className="h-20 w-full">
              <div className="flex flex-wrap gap-2 p-2">
                {currentFarm.varieties.map((variety) => (
                  <Badge key={variety.id} variant="secondary" className="flex items-center gap-1">
                    {variety.name}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() => handleRemoveVariety(variety.id)}>
                      <Cross2Icon className="h-3 w-3" />
                      <span className="sr-only">Remove {variety.name}</span>
                    </Button>
                  </Badge>
                ))}
              </div>
            </ScrollArea>
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="flex-grow" />
              {imageFile && (
                <Badge variant="outline">{imageFile.name}</Badge>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Update Farm' : 'Create Farm'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Farm List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <ReloadIcon className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Varieties</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {farms.map((farm) => (
                  <TableRow key={farm.id}>
                    <TableCell>
                      {farm.imageUrl ? (
                        <Image
                          src={farm.imageUrl}
                          alt={`Image of ${farm.name}`}
                          width={50}
                          height={50}
                          className="rounded-full object-cover" />
                      ) : (
                        <div
                          className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No image</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{farm.name}</TableCell>
                    <TableCell>{farm.address}</TableCell>
                    <TableCell>{farm.phoneNumber}</TableCell>
                    <TableCell>
                      <ScrollArea className="h-20 w-full">
                        <div className="flex flex-wrap gap-1 p-2">
                          {farm.varieties.map((variety) => (
                            <Badge key={variety.id} variant="secondary">
                              {variety.name}
                            </Badge>
                          ))}
                        </div>
                      </ScrollArea>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={() => handleEdit(farm)}>
                          Edit
                        </Button>
                        <Button variant="destructive" onClick={() => handleDelete(farm.id)}>
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>)
  );
}