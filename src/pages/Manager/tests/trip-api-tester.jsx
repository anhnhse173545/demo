import { useState, useCallback } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

const api = axios.create({
  baseURL: 'http://localhost:8081',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default function TripApiTesterComponent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const [Atrip, setAtrip] = useState({
    id: '',
    start_date: '',
    end_date: '',
    departure_airport: '',
    price: 0.0,
    status: '',
    is_deleted: false
  })

  const [tripId, setTripId] = useState('')
  const [tripData, setTripData] = useState({})
  const [tripPaymentId, setTripPaymentId] = useState('')
  const [tripPaymentData, setTripPaymentData] = useState({})
  const [tripDestinationId, setTripDestinationId] = useState('')
  const [tripDestinationData, setTripDestinationData] = useState({})

  const handleError = useCallback((error) => {
    if (axios.isAxiosError(error)) {
      setError(error.response?.data?.message || error.message)
    } else {
      setError('An unexpected error occurred')
    }
    setLoading(false)
  }, [])

  const handleSuccess = useCallback((data) => {
    setResult(data)
    setLoading(false)
    setError(null)
  }, [])

  // Trip API calls
  const updateTrip = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.put(`/api/trip/update/${tripId}`, tripData)
      handleSuccess(response.data)
    } catch (error) {
      handleError(error)
    }
  }
  const createTrip = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.post('/api/trip/create', tripData)
      handleSuccess(response.data)
    } catch (error) {
      handleError(error)
    }
  }

  const listTrips = async () => {
    setLoading(true)
    try {
      const response = await api.get('/api/trip/list')
      handleSuccess(response.data)
    } catch (error) {
      handleError(error)
    }
  }

  const getTrip = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.get(`/api/trip/get/${tripId}`)
      handleSuccess(response.data)
    } catch (error) {
      handleError(error)
    }
  }

  const deleteTrip = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.delete(`/api/trip/${tripId}`)
      handleSuccess(response.data)
    } catch (error) {
      handleError(error)
    }
  }

  // Trip Payment API calls
  const deleteTripPayment = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.put(`/api/trip-payment/delete/${tripPaymentId}`)
      handleSuccess(response.data)
    } catch (error) {
      handleError(error)
    }
  }

  const createTripPayment = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.post('/api/trip-payment/create', tripPaymentData)
      handleSuccess(response.data)
    } catch (error) {
      handleError(error)
    }
  }

  const listTripPayments = async () => {
    setLoading(true)
    try {
      const response = await api.get('/api/trip-payment/list')
      handleSuccess(response.data)
    } catch (error) {
      handleError(error)
    }
  }

  const getTripPayment = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.get(`/api/trip-payment/get/${tripPaymentId}`)
      handleSuccess(response.data)
    } catch (error) {
      handleError(error)
    }
  }

  // Trip Destination API calls
  const updateTripDestination = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.put(`/api/trip-destination/${tripDestinationId}/update`, tripDestinationData)
      handleSuccess(response.data)
    } catch (error) {
      handleError(error)
    }
  }

  const createTripDestination = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.post(`/api/trip-destination/${tripId}/create`, tripDestinationData)
      handleSuccess(response.data)
    } catch (error) {
      handleError(error)
    }
  }

  const listTripDestinations = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.get(`/api/trip-destination/${tripId}/list`)
      handleSuccess(response.data)
    } catch (error) {
      handleError(error)
    }
  }

  const getTripDestination = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.get(`/api/trip-destination/get/${tripDestinationId}`)
      handleSuccess(response.data)
    } catch (error) {
      handleError(error)
    }
  }

  const deleteTripDestination = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.delete(`/api/trip-destination/${tripDestinationId}/delete`)
      handleSuccess(response.data)
    } catch (error) {
      handleError(error)
    }
  }

  return (
    (<div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Trip API Tester</h1>
      <Tabs defaultValue="trip" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="trip">Trip</TabsTrigger>
          <TabsTrigger value="payment">Trip Payment</TabsTrigger>
          <TabsTrigger value="destination">Trip Destination</TabsTrigger>
        </TabsList>

        {/* Trip Tab */}
        <TabsContent value="trip">
          <Card>
            <CardHeader>
              <CardTitle>Trip API</CardTitle>
              <CardDescription>Test Trip-related API endpoints</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Trip ID"
                value={tripId}
                onChange={(e) => setTripId(e.target.value)} />
              <Textarea
                placeholder="Trip Data (JSON)"
                value={JSON.stringify(tripData)}
                onChange={(e) => setTripData(JSON.parse(e.target.value))} />
              <div className="flex space-x-2">
                <Button onClick={updateTrip}>Update Trip</Button>
                <Button onClick={createTrip}>Create Trip</Button>
                <Button onClick={listTrips}>List Trips</Button>
                <Button onClick={getTrip}>Get Trip</Button>
                <Button onClick={deleteTrip}>Delete Trip</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trip Payment Tab */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Trip Payment API</CardTitle>
              <CardDescription>Test Trip Payment-related API endpoints</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Trip Payment ID"
                value={tripPaymentId}
                onChange={(e) => setTripPaymentId(e.target.value)} />
              <Textarea
                placeholder="Trip Payment Data (JSON)"
                value={JSON.stringify(tripPaymentData)}
                onChange={(e) => setTripPaymentData(JSON.parse(e.target.value))} />
              <div className="flex space-x-2">
                <Button onClick={deleteTripPayment}>Delete Trip Payment</Button>
                <Button onClick={createTripPayment}>Create Trip Payment</Button>
                <Button onClick={listTripPayments}>List Trip Payments</Button>
                <Button onClick={getTripPayment}>Get Trip Payment</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trip Destination Tab */}
        <TabsContent value="destination">
          <Card>
            <CardHeader>
              <CardTitle>Trip Destination API</CardTitle>
              <CardDescription>Test Trip Destination-related API endpoints</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Trip Destination ID"
                value={tripDestinationId}
                onChange={(e) => setTripDestinationId(e.target.value)} />
              <Input
                placeholder="Trip ID (for create/list)"
                value={tripId}
                onChange={(e) => setTripId(e.target.value)} />
              <Textarea
                placeholder="Trip Destination Data (JSON)"
                value={JSON.stringify(tripDestinationData)}
                onChange={(e) => setTripDestinationData(JSON.parse(e.target.value))} />
              <div className="flex space-x-2">
                <Button onClick={updateTripDestination}>Update Trip Destination</Button>
                <Button onClick={createTripDestination}>Create Trip Destination</Button>
                <Button onClick={listTripDestinations}>List Trip Destinations</Button>
                <Button onClick={getTripDestination}>Get Trip Destination</Button>
                <Button onClick={deleteTripDestination}>Delete Trip Destination</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {loading && (
        <div className="mt-4 text-center">
          <Loader2 className="inline-block animate-spin" />
          <span className="ml-2">Loading...</span>
        </div>
      )}
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {result && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>API Response</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>)
  );
}