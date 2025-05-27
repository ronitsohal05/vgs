import React from "react";
import { Link } from 'react-router-dom';
import FilmTapeCarousel from "../components/LandingPageCarousel";
import NavBar from "../components/Navbar";


function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <NavBar />

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-8 leading-tight">
          Your Go-To Student
          <br />
          Marketplace
        </h1>

        <p className="text-center text-gray-700 max-w-3xl mx-auto mb-12 text-lg leading-relaxed">
          Virtual Garage Sale helps college students buy, sell, and swap with ease. With camera uploads, AI tagging, and
          student verification, we make campus listings simple, safe, and efficient.
        </p>

        <div className="flex justify-center mb-16">
          <Link
            to="/login"
            className="bg-gray-900 text-white px-8 py-3 rounded-full flex items-center text-lg hover:bg-gray-800 transition-colors"
          >
            Sign In
          </Link>
        </div>

        {/* Film Tape Carousel */}
        <FilmTapeCarousel />
      </div>
    </div>
  );
}

export default LandingPage;
