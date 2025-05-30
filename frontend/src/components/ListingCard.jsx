import { useState } from "react"
import { useNavigate } from "react-router-dom"

function ListingCard({ listing, viewMode = "grid", showSeller = false }) {
  const navigate = useNavigate()
  const [imageError, setImageError] = useState(false)


  const price =
    typeof listing.price === "number" ? listing.price.toFixed(2) : Number.parseFloat(listing.price).toFixed(2)

  const dateStr = listing.datePosted
  const formattedDate = dateStr
    ? new Date(dateStr).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : ""

  const timeAgo = dateStr ? getTimeAgo(new Date(dateStr)) : ""

  function getTimeAgo(date) {
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return formattedDate
  }

  const handleCardClick = (e) => {
    // Prevent navigation if clicking on action buttons
    if (e.target.closest(".action-button")) return
    navigate(`/listings/${listing.id}`)
  }


  const handleShare = (e) => {
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: listing.description,
        url: `${window.location.origin}/listings/${listing.id}`,
      })
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/listings/${listing.id}`)

    }
  }

  const getImageSrc = () => {
    if (imageError) return "/placeholder.svg?height=200&width=300"
    if (Array.isArray(listing.imageUrls) && listing.imageUrls.length > 0) {
      return listing.imageUrls[0] || "/placeholder.svg?height=200&width=300"
    }
    return "/placeholder.svg?height=200&width=300"
  }

  if (viewMode === "list") {
    return (
      <div
        className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 cursor-pointer group overflow-hidden"
        onClick={handleCardClick}
      >
        <div className="flex">
          {/* Image */}
          <div className="relative w-48 h-32 flex-shrink-0">
            <img
              src={getImageSrc() || "/placeholder.svg"}
              alt={listing.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
            {listing.imageUrls && listing.imageUrls.length > 1 && (
              <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                +{listing.imageUrls.length - 1}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 text-lg group-hover:text-purple-600 transition-colors line-clamp-2">
                  {listing.title}
                </h3>
                <button
                  onClick={handleShare}
                  className="action-button p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors ml-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                </button>
              </div>

              {listing.description && <p className="text-gray-600 text-sm line-clamp-2 mb-3">{listing.description}</p>}

              {listing.tags && listing.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {listing.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                  {listing.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{listing.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between items-end">
              <div>
                <div className="text-2xl font-bold text-purple-600">${price}</div>
                {timeAgo && <div className="text-xs text-gray-500">{timeAgo}</div>}
              </div>
              {showSeller && listing.seller && (
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{listing.seller.name}</div>
                  <div className="text-xs text-gray-500">{listing.seller.university}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid view (default)
  return (
    <div
      className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-200 cursor-pointer group overflow-hidden"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={getImageSrc() || "/placeholder.svg"}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        </div>

        {/* Image Count Badge */}
        {listing.imageUrls && listing.imageUrls.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            <svg className="w-3 h-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {listing.imageUrls.length}
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 left-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleShare}
            className="action-button p-2 rounded-full bg-white/90 text-gray-600 hover:bg-white hover:text-blue-500 transition-all backdrop-blur-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
          </button>
        </div>

        {/* Status Badge */}
        {listing.status && listing.status !== "active" && (
          <div className="absolute bottom-3 left-3">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                listing.status === "sold"
                  ? "bg-green-100 text-green-800"
                  : listing.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
              }`}
            >
              {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Price */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-lg group-hover:text-purple-600 transition-colors line-clamp-2 mb-1">
            {listing.title}
          </h3>
          <div className="text-2xl font-bold text-purple-600">${price}</div>
        </div>

        {/* Tags */}
        {listing.tags && listing.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {listing.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                {tag}
              </span>
            ))}
            {listing.tags.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{listing.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {timeAgo}
          </div>
          {showSeller && listing.seller && (
            <div className="flex items-center text-gray-600">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs mr-2">
                {listing.seller.name?.charAt(0) || "?"}
              </div>
              <span className="text-sm font-medium truncate max-w-20">{listing.seller.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ListingCard
