"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import NavBar from "../components/Navbar"
import ListingCard from "../components/ListingCard"
import * as Slider from "@radix-ui/react-slider"

export default function SearchPage() {
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState([])
  const [minPrice, setMin] = useState(0)
  const [maxPrice, setMax] = useState(1000)
  const [sortBy, setSortBy] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState("grid") // grid or list

  const SLIDER_MAX = 2000
  const ALL_TAGS = [
    "Furniture",
    "Appliances",
    "Bedding",
    "Clothes",
    "Shoewear",
    "Decorations",
    "Textbooks",
    "Tickets",
    "Electronics",
    "Sporting Goods",
    "Stationery",
    "Art Supplies",
  ]
  const SORT_OPTIONS = [
    { value: "", label: "Relevance" },
    { value: "priceAsc", label: "Price: Low → High" },
    { value: "priceDesc", label: "Price: High → Low" },
    { value: "titleAsc", label: "Title: A → Z" },
    { value: "titleDesc", label: "Title: Z → A" },
    { value: "dateAsc", label: "Date: Oldest → Newest" },
    { value: "dateDesc", label: "Date: Newest → Oldest" },
  ]

  const toggleTag = (tag) => setTags((ts) => (ts.includes(tag) ? ts.filter((t) => t !== tag) : [...ts, tag]))

  const fetchResults = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      const qs = new URLSearchParams()

      if (title.trim()) qs.set("title", title.trim())
      tags.forEach((t) => t.trim() && qs.append("tags", t.trim()))
      qs.set("minPrice", minPrice)
      qs.set("maxPrice", maxPrice)

      const url = `http://localhost:8080/listings/search?${qs.toString()}`
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = res.data

      // client-side sorting
      switch (sortBy) {
        case "priceAsc":
          data.sort((a, b) => Number.parseFloat(a.price) - Number.parseFloat(b.price))
          break
        case "priceDesc":
          data.sort((a, b) => Number.parseFloat(b.price) - Number.parseFloat(a.price))
          break
        case "titleAsc":
          data.sort((a, b) => a.title.localeCompare(b.title))
          break
        case "titleDesc":
          data.sort((a, b) => b.title.localeCompare(a.title))
          break
        case "dateAsc":
          data.sort((a, b) => new Date(a.datePosted) - new Date(b.datePosted))
          break
        case "dateDesc":
          data.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted))
          break
        default:
          break
      }

      setResults(data)
    } catch (e) {
      console.error(e)
      setError("Failed to search listings.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResults()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchResults()
  }

  const clearFilters = () => {
    setTitle("")
    setTags([])
    setMin(0)
    setMax(1000)
    setSortBy("")
  }

  const activeFiltersCount = [title.trim() ? 1 : 0, tags.length, minPrice > 0 || maxPrice < 1000 ? 1 : 0].reduce(
    (a, b) => a + b,
    0,
  )

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Find What You Need</h1>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Discover amazing deals from fellow students on your campus
              </p>

              {/* Main Search Bar */}
              <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="relative">
                  <div className="flex">
                    <div className="relative flex-1">
                      <svg
                        className="absolute left-4 top-4 h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white rounded-l-lg border-0 focus:ring-2 focus:ring-purple-300 text-lg"
                        placeholder="Search for items..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-4 bg-purple-500 hover:bg-purple-400 text-white font-medium rounded-r-lg transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        "Search"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="lg:w-80">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-sm border"
                >
                  <span className="font-medium">Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
                  <svg
                    className={`w-5 h-5 transition-transform ${showFilters ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Filters Panel */}
              <div className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Filters</h3>
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-purple-600 hover:text-purple-500 font-medium"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {/* Categories */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3 text-gray-900">Categories</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {ALL_TAGS.map((tag) => {
                        const active = tags.includes(tag)
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              active
                                ? "bg-purple-100 text-purple-700 border border-purple-200"
                                : "hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{tag}</span>
                              {active && (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3 text-gray-900">Price Range</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>${minPrice}</span>
                        <span>${maxPrice}</span>
                      </div>
                      <Slider.Root
                        className="relative flex items-center select-none touch-none w-full h-5"
                        value={[minPrice, maxPrice]}
                        onValueChange={([newMin, newMax]) => {
                          setMin(newMin)
                          setMax(newMax)
                        }}
                        min={0}
                        max={SLIDER_MAX}
                        step={10}
                      >
                        <Slider.Track className="bg-gray-200 relative flex-1 h-2 rounded-full">
                          <Slider.Range className="absolute bg-purple-600 h-full rounded-full" />
                        </Slider.Track>
                        <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-purple-600 rounded-full shadow-lg hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-300" />
                        <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-purple-600 rounded-full shadow-lg hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-300" />
                      </Slider.Root>
                    </div>
                  </div>

                  {/* Apply Filters Button */}
                  <button
                    onClick={fetchResults}
                    disabled={loading}
                    className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 font-medium"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {loading ? "Searching..." : `${results.length} items found`}
                    </h2>
                    {activeFiltersCount > 0 && (
                      <p className="text-sm text-gray-600 mt-1">{activeFiltersCount} filters applied</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* View Mode Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                        }`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                        }`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Sort Dropdown */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Active Filters */}
                {(tags.length > 0 || title.trim() || minPrice > 0 || maxPrice < 1000) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {title.trim() && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700">
                          Search: "{title}"
                          <button onClick={() => setTitle("")} className="ml-2 hover:text-purple-900">
                            ×
                          </button>
                        </span>
                      )}
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700"
                        >
                          {tag}
                          <button onClick={() => toggleTag(tag)} className="ml-2 hover:text-blue-900">
                            ×
                          </button>
                        </span>
                      ))}
                      {(minPrice > 0 || maxPrice < 1000) && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                          ${minPrice} - ${maxPrice}
                          <button
                            onClick={() => {
                              setMin(0)
                              setMax(1000)
                            }}
                            className="ml-2 hover:text-green-900"
                          >
                            ×
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-red-700">{error}</span>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <svg className="animate-spin h-8 w-8 text-purple-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <p className="text-gray-600">Searching for items...</p>
                  </div>
                </div>
              )}

              {/* No Results */}
              {!loading && !error && results.length === 0 && (
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Results Grid */}
              {!loading && results.length > 0 && (
                <div
                  className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}
                >
                  {results.map((item) => (
                    <ListingCard key={item.id} listing={item} viewMode={viewMode} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
