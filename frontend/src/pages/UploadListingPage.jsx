import { useState } from "react"
import { useNavigate } from "react-router-dom"
import NavBar from "../components/Navbar"
import axios from "axios"

export default function UploadListingPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [tags, setTags] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const navigate = useNavigate()

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
    "Other",
  ]

  const handleImagesChange = (files) => {
    const fileArray = Array.from(files)
    if (fileArray.length > 5) {
      setError("You can upload up to 5 images.")
      return
    }
    setImages(fileArray)
    setPreviews(fileArray.map((file) => URL.createObjectURL(file)))
    setError("")
  }

  const handleFileInput = (e) => {
    handleImagesChange(e.target.files)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImagesChange(e.dataTransfer.files)
    }
  }

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    setImages(newImages)
    setPreviews(newPreviews)
  }

  const toggleTag = (tag) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!title.trim() || !description.trim() || !price || tags.length === 0) {
      setError("Please fill in all fields and select at least one category.")
      return
    }

    if (Number.parseFloat(price) <= 0) {
      setError("Price must be greater than 0.")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      setError("You must be logged in to create a listing.")
      return
    }

    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("title", title.trim())
    formData.append("description", description.trim())
    formData.append("price", price)
    images.forEach((image) => formData.append("images", image))
    tags.forEach((tag) => formData.append("tags", tag))

    try {
      await axios.post("http://localhost:8080/listings", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      navigate("/dashboard")
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || "Failed to upload listing. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Sell Your Item</h1>
              <p className="text-xl text-purple-100 max-w-2xl mx-auto">
                Create a listing and connect with buyers on your campus
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8">
                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-red-700 text-sm">{error}</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Information */}
                  <div>
                    <h2 className="text-xl font-semibold mb-6 text-gray-900">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Title */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Item Title *</label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          placeholder="e.g., iPhone 13 Pro Max - Excellent Condition"
                          maxLength={100}
                        />
                        <p className="mt-1 text-xs text-gray-500">{title.length}/100 characters</p>
                      </div>

                      {/* Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-500 text-lg">$</span>
                          <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>

                      {/* Categories */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Categories * ({tags.length} selected)
                        </label>
                        <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                          <div className="grid grid-cols-2 gap-2">
                            {ALL_TAGS.map((tag) => {
                              const active = tags.includes(tag)
                              return (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => toggleTag(tag)}
                                  className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                                    active
                                      ? "bg-purple-100 text-purple-700 border-purple-200"
                                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                                  }`}
                                >
                                  {tag}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Describe your item in detail. Include condition, age, features, and any other relevant information..."
                      maxLength={1000}
                    />
                    <p className="mt-1 text-xs text-gray-500">{description.length}/1000 characters</p>
                  </div>

                  {/* Images */}
                  <div>
                    <h2 className="text-xl font-semibold mb-6 text-gray-900">Photos</h2>
                    <div className="space-y-4">
                      {/* Upload Area */}
                      <div
                        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                          dragActive
                            ? "border-purple-400 bg-purple-50"
                            : "border-gray-300 hover:border-purple-400 hover:bg-purple-50"
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileInput}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="space-y-4">
                          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-purple-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-lg font-medium text-gray-900">Upload photos of your item</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Drag and drop images here, or click to browse (max 5 images)
                            </p>
                          </div>
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            Choose Files
                          </button>
                        </div>
                      </div>

                      {/* Image Previews */}
                      {previews.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-3">
                            Selected Images ({previews.length}/5)
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {previews.map((src, idx) => (
                              <div key={idx} className="relative group">
                                <img
                                  src={src || "/placeholder.svg"}
                                  alt={`Preview ${idx + 1}`}
                                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(idx)}
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  ×
                                </button>
                                {idx === 0 && (
                                  <span className="absolute bottom-1 left-1 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                                    Main
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            The first image will be used as the main photo. Drag to reorder.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <h3 className="text-sm font-medium text-blue-900 mb-2">Tips for a great listing</h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Use clear, well-lit photos from multiple angles</li>
                          <li>• Write a detailed description including condition and features</li>
                          <li>• Set a fair price by checking similar items</li>
                          <li>• Choose relevant categories to help buyers find your item</li>
                          <li>• Be honest about any flaws or wear</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => navigate("/dashboard")}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !title || !description || !price || tags.length === 0}
                      className={`flex-1 px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
                        isSubmitting || !title || !description || !price || tags.length === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-[1.02] shadow-lg"
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
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
                          Creating Listing...
                        </div>
                      ) : (
                        "Create Listing"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}