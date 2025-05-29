import { Link } from "react-router-dom"
import NavBar from "../components/Navbar"

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      {/* Navigation */}
      <NavBar />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 pt-20 pb-24 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-24 h-24 bg-purple-200 rounded-full opacity-50 blur-xl"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-200 rounded-full opacity-50 blur-xl"></div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-indigo-600">
                  Your Go-To Student Marketplace
                </h1>
                <p className="text-gray-700 max-w-2xl mb-8 text-lg leading-relaxed">
                  Virtual Garage Sale helps college students buy, sell, and swap with ease. With camera uploads, AI
                  tagging, and student verification, we make campus listings simple, safe, and efficient.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-medium text-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Sign Up Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Right side - CSS Marketplace Illustration */}
            <div className="lg:w-1/2 lg:pl-12 relative">
              <div className="relative h-96 lg:h-[500px]">
                {/* Background circles */}
                <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full opacity-60 animate-pulse"></div>
                <div className="absolute bottom-20 left-5 w-24 h-24 bg-gradient-to-br from-indigo-200 to-indigo-300 rounded-full opacity-60 animate-pulse delay-1000"></div>

                {/* Floating product cards */}
                <div className="absolute top-8 left-8 bg-white rounded-xl shadow-lg p-4 w-32 transform rotate-3 animate-bounce delay-500">
                  <div className="bg-gradient-to-br from-purple-400 to-purple-500 h-16 rounded-lg mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded mb-1"></div>
                  <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                  <div className="mt-2 text-xs font-bold text-green-600">$25</div>
                </div>

                <div className="absolute top-20 right-16 bg-white rounded-xl shadow-lg p-4 w-32 transform -rotate-2 animate-bounce delay-700">
                  <div className="bg-gradient-to-br from-indigo-400 to-indigo-500 h-16 rounded-lg mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded mb-1"></div>
                  <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                  <div className="mt-2 text-xs font-bold text-green-600">$15</div>
                </div>

                <div className="absolute bottom-32 left-12 bg-white rounded-xl shadow-lg p-4 w-32 transform rotate-1 animate-bounce delay-300">
                  <div className="bg-gradient-to-br from-pink-400 to-pink-500 h-16 rounded-lg mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded mb-1"></div>
                  <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                  <div className="mt-2 text-xs font-bold text-green-600">$40</div>
                </div>

                <div className="absolute bottom-16 right-8 bg-white rounded-xl shadow-lg p-4 w-32 transform -rotate-1 animate-bounce delay-1000">
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-500 h-16 rounded-lg mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded mb-1"></div>
                  <div className="h-2 bg-gray-200 rounded w-3/5"></div>
                  <div className="mt-2 text-xs font-bold text-green-600">$8</div>
                </div>

                {/* Central phone mockup */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="bg-gray-900 rounded-3xl p-2 w-48 h-80 shadow-2xl">
                    <div className="bg-white rounded-2xl h-full p-4 overflow-hidden">
                      {/* Phone header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        </div>
                        <div className="text-xs font-bold text-purple-600">VGS</div>
                      </div>

                      {/* Search bar */}
                      <div className="bg-gray-100 rounded-lg p-2 mb-4">
                        <div className="flex items-center">
                          <svg
                            className="w-3 h-3 text-gray-400 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                          <div className="h-1 bg-gray-300 rounded flex-1"></div>
                        </div>
                      </div>

                      {/* Mini product grid */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gradient-to-br from-purple-300 to-purple-400 rounded-lg h-12"></div>
                        <div className="bg-gradient-to-br from-indigo-300 to-indigo-400 rounded-lg h-12"></div>
                        <div className="bg-gradient-to-br from-pink-300 to-pink-400 rounded-lg h-12"></div>
                        <div className="bg-gradient-to-br from-yellow-300 to-orange-400 rounded-lg h-12"></div>
                      </div>

                      {/* Bottom navigation */}
                      <div className="absolute bottom-6 left-4 right-4 flex justify-around">
                        <div className="w-6 h-1 bg-purple-400 rounded"></div>
                        <div className="w-6 h-1 bg-gray-300 rounded"></div>
                        <div className="w-6 h-1 bg-gray-300 rounded"></div>
                        <div className="w-6 h-1 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Students Love Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform is designed specifically for college students, making buying and selling on campus easier
              than ever.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-purple-50 rounded-xl p-8 transition-all hover:shadow-lg">
              <div className="bg-purple-100 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Students Only</h3>
              <p className="text-gray-600">
                Our .edu email verification ensures you're only dealing with fellow students, creating a safer
                marketplace environment.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-indigo-50 rounded-xl p-8 transition-all hover:shadow-lg">
              <div className="bg-indigo-100 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Quick Camera Uploads</h3>
              <p className="text-gray-600">
                Snap a photo, and our AI automatically categorizes and tags your items, making listing as simple as
                taking a picture.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-purple-50 rounded-xl p-8 transition-all hover:shadow-lg">
              <div className="bg-purple-100 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">In-App Messaging</h3>
              <p className="text-gray-600">
                Communicate safely with buyers and sellers through our secure messaging system without sharing personal
                contact info.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join Your Campus Marketplace?</h2>
          <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
            Sign up today and start buying, selling, and connecting with students on your campus.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="bg-white text-purple-700 px-8 py-4 rounded-lg font-medium text-lg hover:bg-purple-50 transition-all shadow-lg transform hover:scale-105"
            >
              Create Account
            </Link>
            <Link
              to="/browse"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-white/10 transition-all"
            >
              Browse Listings
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
