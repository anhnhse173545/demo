import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Calendar, Plane, DollarSign, MapPin } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const api = axios.create({
  baseURL: 'http://localhost:8080/api/trip'
})

export function KoiTripViewSearchComponent() {
  const [trips, setTrips] = useState([])
  const [filteredTrips, setFilteredTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('startDate')
  const [sortOrder, setSortOrder] = useState('asc')
  const [selectedFarms, setSelectedFarms] = useState([])
  const [selectedVarieties, setSelectedVarieties] = useState([])
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [allFarms, setAllFarms] = useState([])
  const [allVarieties, setAllVarieties] = useState([])

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get('/list')
      setTrips(response.data)
      setFilteredTrips(response.data)
      updateAvailableFilters(response.data)
    } catch (err) {
      setError('An error occurred while loading the trip list.')
      console.error('Error fetching trips:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateAvailableFilters = (trips) => {
    const farms = new Set()
    const varieties = new Set()
    trips.forEach(trip => {
      trip.tripDestinations.forEach(dest => {
        farms.add(dest.farm.name)
        dest.farm.varieties.forEach(variety => varieties.add(variety.name))
      })
    })
    setAllFarms(Array.from(farms))
    setAllVarieties(Array.from(varieties))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    applyFilters()
  }

  const resetFilters = () => {
    setSearchTerm('')
    setSortBy('startDate')
    setSortOrder('asc')
    setSelectedFarms([])
    setSelectedVarieties([])
    setPriceRange([0, 10000])
    setDateRange({ start: '', end: '' })
    setFilteredTrips(trips)
  }

  const applyFilters = () => {
    let result = [...trips]

    if (searchTerm) {
      result = result.filter((trip) =>
        trip.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.departureAirport.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.tripDestinations.some(dest => 
          dest.farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dest.farm.address.toLowerCase().includes(searchTerm.toLowerCase())))
    }

    if (selectedFarms.length > 0) {
      result = result.filter(trip =>
        trip.tripDestinations.some(dest => selectedFarms.includes(dest.farm.name)))
    }

    if (selectedVarieties.length > 0) {
      result = result.filter(trip =>
        trip.tripDestinations.some(dest => 
          dest.farm.varieties.some(variety => selectedVarieties.includes(variety.name))))
    }

    result = result.filter(trip => trip.price >= priceRange[0] && trip.price <= priceRange[1])

    if (dateRange.start && dateRange.end) {
      result = result.filter(trip => 
        new Date(trip.startDate) >= new Date(dateRange.start) && 
        new Date(trip.endDate) <= new Date(dateRange.end))
    }

    result.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1
      if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    setFilteredTrips(result)
  }

  useEffect(() => {
    applyFilters()
  }, [searchTerm, sortBy, sortOrder, selectedFarms, selectedVarieties, priceRange, dateRange])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  return (
    (<div className="container mx-auto p-4 flex flex-col md:flex-row gap-6">
      {/* Left sidebar for filters */}
      <div className="w-full md:w-1/4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  type="search"
                  placeholder="Search trips..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="space-y-2">
  <Label htmlFor="sort">Sort by</Label>
  <Select value={sortBy} onValueChange={setSortBy}>
    <SelectTrigger 
      id="sort" 
      style={{
        color: '#6b7280', // Màu chữ xám
        border: '1px solid #e5e7eb', // Viền nhạt
        borderRadius: '8px', // Bo góc
        padding: '8px 12px', // Khoảng cách bên trong
        backgroundColor: '#fff', // Nền trắng
      }}
    >
      <SelectValue style={{ color: '#6b7280' }} placeholder="Sort by" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="startDate" style={{ color: '#6b7280' }}>Start Date</SelectItem>
      <SelectItem value="price" style={{ color: '#6b7280' }}>Price</SelectItem>
    </SelectContent>
  </Select>
</div>

<div className="space-y-2">
  <Label htmlFor="order">Sort order</Label>
  <Select value={sortOrder} onValueChange={setSortOrder}>
    <SelectTrigger 
      id="order"
      style={{
        color: '#6b7280', // Màu chữ xám
        border: '1px solid #e5e7eb', // Viền nhạt
        borderRadius: '8px', // Bo góc
        padding: '8px 12px', // Khoảng cách bên trong
        backgroundColor: '#fff', // Nền trắng
      }}
    >
      <SelectValue style={{ color: '#6b7280' }} placeholder="Sort order" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="asc" style={{ color: '#6b7280' }}>Ascending</SelectItem>
      <SelectItem value="desc" style={{ color: '#6b7280' }}>Descending</SelectItem>
    </SelectContent>
  </Select>
</div>

              <div className="space-y-2">
                <Label>Farms</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {allFarms.map((farm) => (
                    <div key={farm} className="flex items-center">
                      <Checkbox
                        id={`farm-${farm}`}
                        checked={selectedFarms.includes(farm)}
                        onCheckedChange={(checked) => {
                          setSelectedFarms(checked
                            ? [...selectedFarms, farm]
                            : selectedFarms.filter((f) => f !== farm))
                        }} />
                      <label
                        htmlFor={`farm-${farm}`}
                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {farm}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Koi Varieties</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {allVarieties.map((variety) => (
                    <div key={variety} className="flex items-center">
                      <Checkbox
                        id={`variety-${variety}`}
                        checked={selectedVarieties.includes(variety)}
                        onCheckedChange={(checked) => {
                          setSelectedVarieties(checked
                            ? [...selectedVarieties, variety]
                            : selectedVarieties.filter((v) => v !== variety))
                        }} />
                      <label
                        htmlFor={`variety-${variety}`}
                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {variety}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Price Range</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full" />
                  <span>to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} />
              </div>
              <Button type="submit" className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
              <Button style={{ color: 'black' }} type="button" variant="outline" onClick={resetFilters} className="w-full">
                Reset Filters
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      {/* Main content area */}
      <div className="w-full md:w-3/4 space-y-6">
        <h1 className="text-3xl font-bold">Koi Trips</h1>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTrips.map((trip) => (
              <Card key={trip.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">{trip.description}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</p>
                    </div>
                    <div className="flex items-center">
                      <Plane className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{trip.departureAirport}</p>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="font-semibold">${trip.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{trip.tripDestinations.map(dest => dest.farm.name).join(', ')}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-semibold mb-2">Koi Varieties:</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(
                        trip.tripDestinations.flatMap(dest => dest.farm.varieties.map(v => v.name))
                      )).slice(0, 3).map((variety) => (
                        <Badge key={variety} variant="secondary">
                          {variety}
                        </Badge>
                      ))}
                      {trip.tripDestinations.flatMap(dest => dest.farm.varieties).length > 3 && (
                        <Badge variant="outline">+{trip.tripDestinations.flatMap(dest => dest.farm.varieties).length - 3} more</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-muted-foreground">No trips found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>)
  );
}