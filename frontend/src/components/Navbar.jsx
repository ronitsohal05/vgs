import { useState, useEffect, useRef } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import axios from "axios"

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const profileDropdownRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setLoggedIn(false)
      return
    }

    setLoggedIn(true)

    axios
      .get("http://localhost:8080/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token")
        setLoggedIn(false)
        navigate("/")
      })
  }, [navigate])

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false)
    // Close profile dropdown when route changes
    setProfileDropdownOpen(false)
  }, [location.pathname])

  useEffect(() => {
    // Close profile dropdown when clicking outside
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    setLoggedIn(false)
    setProfileDropdownOpen(false)
    navigate("/")
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-gradient-to-r from-purple-700 to-indigo-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <svg className="h-8 w-8 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="ml-2 text-xl font-bold text-white">Virtual Garage Sale</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {loggedIn && (
                <>
                  <Link
                    to="/browse"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive("/browse")
                        ? "bg-purple-900 text-white"
                        : "text-purple-100 hover:bg-purple-600 hover:text-white"
                    }`}
                  >
                    Browse
                  </Link>
                  <Link
                    to="/upload"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive("/upload")
                        ? "bg-purple-900 text-white"
                        : "text-purple-100 hover:bg-purple-600 hover:text-white"
                    }`}
                  >
                    Sell
                  </Link>
                  <Link
                    to="/chat"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive("/chat")
                        ? "bg-purple-900 text-white"
                        : "text-purple-100 hover:bg-purple-600 hover:text-white"
                    }`}
                  >
                    Chat
                  </Link>
                </>
              )}

              {loggedIn ? (
                <div className="relative ml-3" ref={profileDropdownRef}>
                  <div>
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-purple-800 focus:ring-white"
                    >
                      <span className="sr-only">Open user menu</span>
                      {user?.profilePictureLink ? (
                        <img
                          className="h-9 w-9 rounded-full border-2 border-purple-300 object-cover"
                          src={user.profilePictureLink || "/placeholder.svg"}
                          alt="Profile"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-purple-500 flex items-center justify-center border-2 border-purple-300">
                          <span className="text-white font-medium">{user?.first?.charAt(0) || "U"}</span>
                        </div>
                      )}
                      <svg
                        className={`ml-1 h-4 w-4 text-purple-200 transition-transform duration-200 ${
                          profileDropdownOpen ? "transform rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  {profileDropdownOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                      <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-100">
                        Dashboard
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm font-medium text-purple-100 hover:text-white transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium rounded-md bg-purple-500 text-white hover:bg-purple-400 transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    Log In
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {loggedIn && user?.profilePictureLink && (
              <Link to="/dashboard" className="mr-2">
                <img
                  src={user.profilePictureLink || "/placeholder.svg"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-purple-300 object-cover"
                />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-purple-200 hover:text-white hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? "block" : "hidden"} md:hidden bg-purple-800`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {loggedIn && (
            <>
              <Link
                to="/browse"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/browse")
                    ? "bg-purple-900 text-white"
                    : "text-purple-100 hover:bg-purple-600 hover:text-white"
                }`}
              >
                Browse
              </Link>
              <Link
                to="/upload"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/upload")
                    ? "bg-purple-900 text-white"
                    : "text-purple-100 hover:bg-purple-600 hover:text-white"
                }`}
              >
                Sell
              </Link>
              <Link
                to="/chat"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/chat")
                    ? "bg-purple-900 text-white"
                    : "text-purple-100 hover:bg-purple-600 hover:text-white"
                }`}
              >
                Chat
              </Link>
              <Link
                to="/dashboard"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/dashboard")
                    ? "bg-purple-900 text-white"
                    : "text-purple-100 hover:bg-purple-600 hover:text-white"
                }`}
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-300 hover:bg-red-900 hover:text-white"
              >
                Sign out
              </button>
            </>
          )}

          {!loggedIn && (
            <>
              <Link
                to="/signup"
                className="block px-3 py-2 rounded-md text-base font-medium text-purple-100 hover:bg-purple-600 hover:text-white"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-purple-100 hover:bg-purple-600 hover:text-white"
              >
                Log In
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}