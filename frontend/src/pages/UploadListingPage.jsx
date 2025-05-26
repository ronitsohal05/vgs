import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar';
import axios from 'axios';

export default function UploadListingPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  const ALL_TAGS = [
    'Furniture',
    'Appliances',
    'Bedding',
    'Clothes',
    'Shoewear',
    'Decorations',
    'Textbooks',
    'Tickets',
    'Electronics',
    'Sporting Goods',
    'Stationery',
    'Art Supplies',
    'Other'
  ];

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert('You can upload up to 5 images.');
      return;
    }
    setImages(files);
    setPreviews(files.map(file => URL.createObjectURL(file)));
  };

  const toggleTag = (tag) => {
    setTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !price || tags.length === 0) {
      alert('Please fill in all fields and select at least one tag.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    images.forEach(image => formData.append('images', image));
    tags.forEach(tag => formData.append('tags', tag));

    try {
      await axios.post('http://localhost:8080/listings', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to upload listing.');
    }
  };

  return (
    <>
      <NavBar />
      <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
        <h1 className="text-2xl font-bold mb-4">Create a New Listing</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium">Price ($)</label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map(tag => {
                const active = tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full border ${
                      active
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300'
                    } focus:outline-none`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium">Images (max 5)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="mt-1 block w-full"
            />
            <div className="mt-2 grid grid-cols-5 gap-2">
              {previews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Preview ${idx + 1}`}
                  className="h-24 w-24 object-cover rounded"
                />
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Upload Listing
          </button>
        </form>
      </div>
    </>
  );
}
