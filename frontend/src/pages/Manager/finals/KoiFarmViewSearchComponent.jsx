'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Phone, MapPin, Fish, Filter, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import api from '@/config/api'

 

export function KoiFarmViewSearchComponent() {
  const [farms, setFarms] = useState([])
  const [filteredFarms, setFilteredFarms] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [selectedVarieties, setSelectedVarieties] = useState([])
  const [allVarieties, setAllVarieties] = useState([])
  const [selectedFarm, setSelectedFarm] = useState(null)

  useEffect(() => {
    fetchFarms()
  }, [])

  const fetchFarms = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get('api/farm/list')
      setFarms(response.data)
      setFilteredFarms(response.data)
      const varieties = [...new Set(response.data.flatMap(farm => farm.varieties.map(v => v.name)))]
      setAllVarieties(varieties)
    } catch (err) {
      setError('An error occurred while loading the farm list.')
      console.error('Error fetching farms:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    try {
      let result = [...farms];
  
      if (searchTerm) {
        result = result.filter((farm) =>
          (farm.name && farm.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (farm.description && farm.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (farm.address && farm.address.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
  
      if (selectedVarieties.length > 0) {
        result = result.filter((farm) =>
          farm.varieties.some((variety) => selectedVarieties.includes(variety.name))
        );
      }
  
      result.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  
      setFilteredFarms(result);
    } catch (err) {
      setError("An error occurred while filtering the farms.");
      console.error("Error in applyFilters:", err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault()
    applyFilters()
  }

  const resetFilters = () => {
    setSearchTerm('')
    setSortBy('name')
    setSortOrder('asc')
    setSelectedVarieties([])
    setFilteredFarms(farms)
  }

  useEffect(() => {
    applyFilters()
  }, [searchTerm, sortBy, sortOrder, selectedVarieties])

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Koi Farms</h1>
        <form onSubmit={handleSearch} className="flex w-full md:w-auto">
          <Input
            type="search"
            placeholder="Search farms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-r-none"
          />
          <Button type="submit" className="rounded-l-none">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left sidebar for filters */}
        <Card className="w-full lg:w-1/4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sort">Sort by</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sort">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="address">Address</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Sort order</Label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger id="order">
                    <SelectValue placeholder="Sort order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Koi Varieties</Label>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  <div className="space-y-2">
                    {allVarieties.map((variety) => (
                      <div key={variety} className="flex items-center">
                        <Checkbox
                          id={variety}
                          checked={selectedVarieties.includes(variety)}
                          onCheckedChange={(checked) => {
                            setSelectedVarieties(
                              checked
                                ? [...selectedVarieties, variety]
                                : selectedVarieties.filter((v) => v !== variety)
                            )
                          }}
                        />
                        <label htmlFor={variety} className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {variety}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              <Button onClick={resetFilters} variant="outline" className="w-full">
                Reset Filters
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Main content area */}
        <div className="w-full lg:w-3/4 space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {loading ? (
            <Card>
              <CardContent className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </CardContent>
            </Card>
          ) : filteredFarms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFarms.map((farm) => (
                <Card key={farm.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    {farm.mediaUrl ? (
                      <img
                        src={farm.mediaUrl}
                        alt={`${farm.name} farm`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-500 text-lg font-semibold">
                        <Fish className="w-12 h-12 mr-2" />
                        {farm.name}
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle>{farm.name}</CardTitle>
                    <CardDescription>{farm.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p>{farm.address}</p>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p>{farm.phoneNumber}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-semibold mb-2">Koi Varieties:</p>
                      <div className="flex flex-wrap gap-2">
                        {farm.varieties.slice(0, 3).map((variety) => (
                          <Badge key={variety.id} variant="secondary">
                            {variety.name}
                          </Badge>
                        ))}
                        {farm.varieties.length > 3 && (
                          <Badge variant="outline">+{farm.varieties.length - 3} more</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button onClick={() => setSelectedFarm(farm)} className="w-full">View Details</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>{selectedFarm?.name}</DialogTitle>
                          <DialogDescription>{selectedFarm?.description}</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right">
                              Address
                            </Label>
                            <div id="address" className="col-span-3">
                              {selectedFarm?.address}
                            </div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                              Phone
                            </Label>
                            <div id="phone" className="col-span-3">
                              {selectedFarm?.phoneNumber}
                            </div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="varieties" className="text-right">
                              Varieties
                            </Label>
                            <div id="varieties" className="col-span-3">
                              {selectedFarm?.varieties.map((variety) => (
                                <Badge key={variety.id} variant="secondary" className="mr-1 mb-1">
                                  {variety.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-6">
                <p className="text-muted-foreground">No farms found.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}