import React from "react"

/// Sample product data
const products = [
  { id: 1, name: "Smartwatch", price: "$179.99" },
  { id: 2, name: "Headphones", price: "$69.99" },
  { id: 3, name: "Running Shoes", price: "$39.99" },
  { id: 4, name: "Laptop", price: "$899.99" },
  { id: 5, name: "Textbooks", price: "$49.99" },
  { id: 6, name: "Desk Lamp", price: "$24.99" },
  { id: 7, name: "Backpack", price: "$59.99" },
  { id: 8, name: "Coffee Maker", price: "$34.99" },
  { id: 9, name: "Bluetooth Speaker", price: "$45.99" },
  { id: 10, name: "Desk Chair", price: "$129.99" },
]

export default function LandingPageCarousel() {
  // Duplicate products multiple times to create seamless infinite scroll
  const duplicatedProducts = [...products, ...products, ...products]

  return (
    <div className="w-full overflow-hidden">
      {/* Film strip top border */}
      <div className="w-full h-6 bg-gray-900 flex justify-between items-center px-2">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={`top-${i}`} className="w-3 h-3 bg-gray-700 rounded-full" />
        ))}
      </div>

      {/* Scrolling film tape content */}
      <div className="bg-gray-100 py-6 overflow-hidden">
        <div className="flex animate-scroll">
          {duplicatedProducts.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="flex-shrink-0 w-48 mx-4 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
            >
              <div className="p-4 flex justify-center items-center h-32 bg-gray-50">
                <div className="w-20 h-20 bg-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 text-xs text-center font-medium">{product.name}</span>
                </div>
              </div>
              <div className="p-3 bg-white">
                <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
                <p className="font-bold text-lg">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Film strip bottom border */}
      <div className="w-full h-6 bg-gray-900 flex justify-between items-center px-2">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={`bottom-${i}`} className="w-3 h-3 bg-gray-700 rounded-full" />
        ))}
      </div>
    </div>
  )
}