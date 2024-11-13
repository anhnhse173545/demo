import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, MapPin, Star, Calendar, Users, DollarSign, Phone, Loader2, Plane, Fish } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

const farmApi = axios.create({
  baseURL: 'http://localhost:8080/api/farm'
})

const tripApi = axios.create({
  baseURL: 'http://localhost:8080/api/trip'
})

export function HomepageComponent() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const navigate = useNavigate()
  const [farms, setFarms] = useState([])
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const testimonials = [
    { name: "Tanaka Yuki", comment: "KOSJapan helped me find the perfect Koi for my pond. Their expertise is unmatched!" },
    { name: "John Smith", comment: "The farm tour was an incredible experience. I learned so much about Koi breeding." },
    { name: "Maria Garcia", comment: "Outstanding service from start to finish. My Koi arrived healthy and beautiful." },
  ]

  useEffect(() => {
    fetchFarms()
    fetchTrips()
  }, [])

  const fetchFarms = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await farmApi.get('/list')
      setFarms(response.data.slice(0, 3)) // Only take the first 3 farms for the homepage
    } catch (err) {
      setError('An error occurred while loading the farm list.')
      console.error('Error fetching farms:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchTrips = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await tripApi.get('/list')
      setTrips(response.data.slice(0, 3)) // Only take the first 3 trips for the homepage
    } catch (err) {
      setError('An error occurred while loading the trip list.')
      console.error('Error fetching trips:', err)
    } finally {
      setLoading(false)
    }
  }

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <img
          src="https://www.best4pets.in/cdn/shop/files/kohaku.best4pets.in.jpg?v=1683731525&width=2048"
          alt="Beautiful Koi fish"
          className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="relative z-20 h-full flex flex-col justify-center items-start text-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 leading-tight !text-white">Discover Japan's <br />Finest Koi</h1>
          <p className="text-xl sm:text-2xl mb-8 max-w-2xl !text-white">Embark on an unforgettable journey through Japan's most prestigious Koi farms</p>
          <Button
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-3 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => navigate("/koifarmpage")}
          >
            Explore Koi Farms
          </Button>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12 text-gray-900">Welcome to KOSJapan</h2>
        {/* <div className="mb-12 text-center">
          <img
            src="/frontend/src/assets/IMG_0378-1024x768.jpg?height=400&width=600"
            alt="Colorful Koi fish swimming in a pond"
            className="rounded-lg shadow-lg mx-auto"
            width={600}
            height={400}
          />
        </div> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <MapPin className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-2 text-gray-900">Expert-Guided Tours</h3>
              <p className="text-gray-600">Embark on exclusive tours to renowned Koi farms with our knowledgeable guides.</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <Star className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-2 text-gray-900">Premium Selection</h3>
              <p className="text-gray-600">Choose from a curated collection of top-quality Koi, handpicked by experts.</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <ChevronRight className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-2 text-gray-900">Seamless Experience</h3>
              <p className="text-gray-600">Enjoy a hassle-free process from selection to delivery of your perfect Koi.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Koi Farm Trips Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-red-600">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12 text-white">Featured Koi Farm Trips</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          ) : error ? (
            <div className="text-center text-white">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {trips.map((trip) => (
                <Card key={trip.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900">{trip.description}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="w-5 h-5 mr-2 text-red-600" />
                        <p>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</p>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Plane className="w-5 h-5 mr-2 text-red-600" />
                        <p>{trip.departureAirport}</p>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <DollarSign className="w-5 h-5 mr-2 text-red-600" />
                        <p className="font-semibold">${trip.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <MapPin className="w-5 h-5 mr-2 text-red-600" />
                        <p>{trip.tripDestinations.map(dest => dest.farm.name).join(', ')}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-semibold mb-2 text-gray-900">Koi Varieties:</p>
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
                    <Button onClick={() => navigate(`/trip/${trip.id}`)} className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white">View Trip</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Koi Farms Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12 text-gray-900">Featured Koi Farms</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-gray-600">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {farms.map((farm) => (
                <Card key={farm.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
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
                    <CardTitle className="text-2xl font-bold text-gray-900">{farm.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{farm.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-700">
                        <MapPin className="w-5 h-5 mr-2 text-red-600" />
                        <p>{farm.address}</p>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Phone className="w-5 h-5 mr-2 text-red-600" />
                        <p>{farm.phoneNumber}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-semibold mb-2 text-gray-900">Koi Varieties:</p>
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
                    <Button onClick={() => navigate(`/farm/${farm.id}`)} className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white">View Farm</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-12 text-gray-900">What Our Customers Say</h2>
          <Card className="mb-8 bg-white shadow-lg">
            <CardContent className="p-8">
              <p className="text-xl italic mb-4 text-gray-700">{testimonials[currentTestimonial].comment}</p>
              <p className="font-semibold text-gray-900">- {testimonials[currentTestimonial].name}</p>
            </CardContent>
          </Card>
          <Button
            onClick={nextTestimonial}
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50">
            Next Testimonial
          </Button>
        </div>
      </section>

      {/* Call-to-Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 !text-white">Ready to Start Your Koi Journey?</h2>
          <p className="text-xl mb-8">Book a tour to Japan's finest Koi farms and find your perfect  Koi.</p>
          <Button
            size="lg"
            variant="outline"
            className="bg-white text-red-600 hover:bg-gray-100  text-lg px-8 py-3 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => navigate("/contact")}>
            Book a Farm Tour
          </Button>
        </div>
      </section>
    </div>
  )
}