'use client'

import "./index.css"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, MapPin, Star, Calendar, Users, DollarSign } from 'lucide-react'

export function HomepageComponent() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    { name: "Tanaka Yuki", comment: "KOSJapan helped me find the perfect Koi for my pond. Their expertise is unmatched!" },
    { name: "John Smith", comment: "The farm tour was an incredible experience. I learned so much about Koi breeding." },
    { name: "Maria Garcia", comment: "Outstanding service from start to finish. My Koi arrived healthy and beautiful." },
  ]

  const featuredTrips = [
    { title: "Tokyo Koi Adventure", duration: "5 days", price: "$2,999", groupSize: "Private Tour",
       image:"https://plus.unsplash.com/premium_photo-1661914240950-b0124f20a5c1?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dG9reW98ZW58MHx8MHx8fDA%3Dg" },
    { title: "Niigata Koi Expedition", duration: "7 days", price: "$3,999", groupSize: "Private Tour",
       image:"https://upload.wikimedia.org/wikipedia/commons/f/fd/Niigata_City_2022-01.jpg" },
    { title: "Hiroshima Koi Discovery", duration: "6 days", price: "$3,499", groupSize: "Private Tour",
       image:"https://img.baoninhbinh.org.vn/DATA/ARTICLES/2024/8/6/nhat-ban-tuong-niem-79-nam-vu-nem-bom-nguyen-tu-xuong-a782f.jpg" },
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  return (
    (<div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <img
          src="https://www.best4pets.in/cdn/shop/files/kohaku.best4pets.in.jpg?v=1683731525&width=2048"
          alt="Beautiful Koi fish"
          className="absolute inset-0 w-full h-full object-cover z-0" />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10" />
        <div
          className="relative z-20 h-full flex flex-col justify-center items-start text-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 leading-tight !text-white">Discover Japan's <br />Finest Koi</h1>
          <p className="text-xl sm:text-2xl mb-8 max-w-2xl !text-white">Embark on an unforgettable journey through Japan's most prestigious Koi farms</p>
          <Button
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-3 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
            Explore Koi Farms
          </Button>
        </div>
      </section>
      {/* Introduction Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2
          className="text-4xl sm:text-5xl font-bold text-center mb-12 text-gray-900">Welcome to KOSJapan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <Card
            className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <MapPin className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-2 text-gray-900">Expert-Guided Tours</h3>
              <p className="text-gray-600">Embark on exclusive tours to renowned Koi farms with our knowledgeable guides.</p>
            </CardContent>
          </Card>
          <Card
            className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <Star className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-2 text-gray-900">Premium Selection</h3>
              <p className="text-gray-600">Choose from a curated collection of top-quality Koi, handpicked by experts.</p>
            </CardContent>
          </Card>
          <Card
            className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <ChevronRight className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-2 text-gray-900">Seamless Experience</h3>
              <p className="text-gray-600">Enjoy a hassle-free process from selection to delivery of your perfect Koi.</p>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* Featured Koi Breeds */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12 !text-white">Featured Koi Breeds</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            
            {/* Kohaku Card */}
            <a href="/breeds/kohaku">
              <Card className="bg-gray-800 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <img
                  src="https://koilover.vn/uploads/images/nguon-goc-kohaku-3.jpg"
                  alt="Kohaku Koi"
                  className="w-full h-64 object-contain" />
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold mb-2">Kohaku</h3>
                  <p className="text-gray-300 mb-4">Discover the beauty of Kohaku Koi, known for their pure white skin with red patterns.</p>
                  <span className="text-red-400 hover:text-red-300 font-medium inline-flex items-center">
                    Learn more <ChevronRight className="ml-1 w-4 h-4" />
                  </span>
                </CardContent>
              </Card>
            </a>

            {/* Sanke Card */}
            <a href="/breeds/sanke">
              <Card className="bg-gray-800 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <img
                  src="https://www.hoangkhoikoifish.com/upload/product/sp-sanke-7488.png"
                  alt="Sanke Koi"
                  className="w-full h-64 object-contain" />
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold mb-2">Sanke</h3>
                  <p className="text-gray-300 mb-4">Explore Sanke Koi, featuring white bodies with red and black accents.</p>
                  <span className="text-red-400 hover:text-red-300 font-medium inline-flex items-center">
                    Learn more <ChevronRight className="ml-1 w-4 h-4" />
                  </span>
                </CardContent>
              </Card>
            </a>

            {/* Showa Card */}
            <a href="/breeds/showa">
              <Card className="bg-gray-800 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="https://cdn0497.cdn4s.com/media/showa1.jpg"
                  alt="Showa Koi"
                  className="w-full h-64 object-contain" />
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold mb-2">Showa</h3>
                  <p className="text-gray-300 mb-4">Admire the Showa Koi, known for their black bodies with red and white patterns.</p>
                  <span className="text-red-400 hover:text-red-300 font-medium inline-flex items-center">
                    Learn more <ChevronRight className="ml-1 w-4 h-4" />
                  </span>
                </CardContent>
              </Card>
            </a>

          </div>
        </div>
      </section>

      {/* Feature Trips Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-red-600">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12 text-white">Featured Koi Farm Trips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredTrips.map((trip, index) => (
              <Card
                key={index}
                className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img
                src={trip.image} // Use the image link from the trip object
                alt={trip.title}
                className="w-full h-64 object-cover" />
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">{trip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-700">
                      <Calendar className="w-5 h-5 mr-2 text-red-600" /> {trip.duration}
                    </li>
                    <li className="flex items-center text-gray-700">
                      <Users className="w-5 h-5 mr-2 text-red-600" /> {trip.groupSize}
                    </li>
                    <li className="flex items-center text-gray-700">
                      <DollarSign className="w-5 h-5 mr-2 text-red-600" /> {trip.price}
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white">Book Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
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
          <p className="text-xl mb-8">Book a tour to Japan's finest Koi farms and find your perfect Koi.</p>
          <Button
            size="lg"
            variant="outline"
            className="bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-3 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
            Book a Farm Tour
          </Button>
        </div>
      </section>
      {/* Footer */}
      {/* <footer className="bg-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a
                href="/about"
                className="hover:text-red-400 transition-colors duration-200">About Us</a></li>
              <li><a
                href="/farms"
                className="hover:text-red-400 transition-colors duration-200">Koi Farms</a></li>
              <li><a
                href="/breeds"
                className="hover:text-red-400 transition-colors duration-200">Koi Breeds</a></li>
              <li><a
                href="/tours"
                className="hover:text-red-400 transition-colors duration-200">Farm Tours</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4">Contact Us</h3>
            <p className="mb-2">Email: info@kosjapan.com</p>
            <p className="mb-2">Phone: +81 3-1234-5678</p>
            <p>Address: 1-2-3 Chiyoda, Tokyo, Japan</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-2xl hover:text-red-400 transition-colors duration-200">Facebook</a>
              <a
                href="#"
                className="text-2xl hover:text-red-400 transition-colors duration-200">Instagram</a>
              <a
                href="#"
                className="text-2xl hover:text-red-400 transition-colors duration-200">Twitter</a>
            </div>
          </div>
        </div>
        <div className="mt-12 text-center text-gray-400">
          <p>&copy; 2024 KOSJapan. All rights reserved.</p>
        </div>
      </footer> */}
    </div>)
  );
}