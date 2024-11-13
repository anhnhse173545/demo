'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, MapPin, Star, Calendar, Users, DollarSign } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export function HomepageGuest() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const navigate = useNavigate();
  const testimonials = [
    { name: "Tanaka Yuki", comment: "KOSJapan helped me find the perfect Koi for my pond. Their expertise is unmatched!" },
    { name: "John Smith", comment: "The farm tour was an incredible experience. I learned so much about Koi breeding." },
    { name: "Maria Garcia", comment: "Outstanding service from start to finish. My Koi arrived healthy and beautiful." },
  ];

  const featuredTrips = [
    { title: "Tokyo Koi Adventure", duration: "5 days", price: "$2,999", groupSize: "Private Tour",
      image: "https://plus.unsplash.com/premium_photo-1661914240950-b0124f20a5c1?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dG9reW98ZW58MHx8MHx8fDA%3Dg" },
    { title: "Niigata Koi Expedition", duration: "7 days", price: "$3,999", groupSize: "Private Tour",
      image: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Niigata_City_2022-01.jpg" },
    { title: "Hiroshima Koi Discovery", duration: "6 days", price: "$3,499", groupSize: "Private Tour",
      image: "https://img.baoninhbinh.org.vn/DATA/ARTICLES/2024/8/6/nhat-ban-tuong-niem-79-nam-vu-nem-bom-nguyen-tu-xuong-a782f.jpg" },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 leading-tight">Discover Japan's <br />Finest Koi</h1>
          <p className="text-xl sm:text-2xl mb-8 max-w-2xl">Embark on an unforgettable journey through Japan's most prestigious Koi farms</p>
          <Button
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-3 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => navigate("/koifarmpage")}>
            Explore Koi Farms
          </Button>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12 text-gray-900">Welcome to KOSJapan</h2>
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

      {/* Featured Koi Breeds */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12">Featured Koi Breeds</h2>
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
                  <p className="text-gray-300 mb-4">Admire Showa Koi, characterized by their striking black bodies with red and white patterns.</p>
                  <span className="text-red-400 hover:text-red-300 font-medium inline-flex items-center">
                    Learn more <ChevronRight className="ml-1 w-4 h-4" />
                  </span>
                </CardContent>
              </Card>
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12">What Our Guests Say</h2>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg italic mb-4">"{testimonials[currentTestimonial].comment}"</p>
          <p className="font-bold mb-4">{testimonials[currentTestimonial].name}</p>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white text-lg px-6 py-2 rounded-full"
            onClick={nextTestimonial}>
            Next Testimonial
          </Button>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Join Our Koi Family!</h2>
          <p className="text-lg mb-6">Sign up to receive exclusive offers, updates, and a special gift with your first order!</p>
          <Button
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-3 rounded-full transition duration-300 ease-in-out"
            onClick={() => navigate("/signup")}>
            Sign Up Now
          </Button>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12 text-gray-900">Featured Tours</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featuredTrips.map((trip, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <img src={trip.image} alt={trip.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2">{trip.title}</h3>
                <p className="text-gray-600 mb-2">Duration: {trip.duration}</p>
                <p className="text-gray-600 mb-2">Group Size: {trip.groupSize}</p>
                <p className="text-red-600 font-bold mb-2">{trip.price}</p>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white text-lg px-4 py-2 rounded-full"
                  onClick={() => navigate(`/tours/${trip.title.replace(/\s+/g, '-').toLowerCase()}`)}>
                  Book Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-10 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2024 KOSJapan. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
