// src/pages/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/Navbar';
import ListingCard from '../components/ListingCard';
import * as Slider from '@radix-ui/react-slider';

export default function SearchPage() {
  const [title, setTitle]       = useState('');
  const [tags, setTags]         = useState([]);
  const [minPrice, setMin]      = useState(0);
  const [maxPrice, setMax]      = useState(1000);
  const [sortBy, setSortBy]     = useState('');
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const SLIDER_MAX = 2000;
  const ALL_TAGS = [
    'Furniture','Appliances','Bedding','Clothes',
    'Shoewear','Decorations','Textbooks','Tickets',
    'Electronics','Sporting Goods','Stationery','Art Supplies'
  ];
  const SORT_OPTIONS = [
    { value: '',           label: 'None' },
    { value: 'priceAsc',   label: 'Price: Low → High' },
    { value: 'priceDesc',  label: 'Price: High → Low' },
    { value: 'titleAsc',   label: 'Title: A → Z' },
    { value: 'titleDesc',  label: 'Title: Z → A' },
    { value: 'dateAsc',    label: 'Date: Oldest → Newest' },
    { value: 'dateDesc',   label: 'Date: Newest → Oldest' },
  ];

  const toggleTag = tag =>
    setTags(ts => ts.includes(tag)
      ? ts.filter(t => t !== tag)
      : [...ts, tag]
    );

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const qs = new URLSearchParams();

      if (title.trim())        qs.set('title', title.trim());
      tags.forEach(t => t.trim() && qs.append('tags', t.trim()));
      qs.set('minPrice', minPrice);
      qs.set('maxPrice', maxPrice);

      const url = `http://localhost:8080/listings/search?${qs.toString()}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      let data = res.data;

      // client-side sorting
      switch (sortBy) {
        case 'priceAsc':
          data.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
          break;
        case 'priceDesc':
          data.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
          break;
        case 'titleAsc':
          data.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'titleDesc':
          data.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case 'dateAsc':
          data.sort((a, b) =>
            new Date(a.datePosted) - new Date(b.datePosted)
          );
          break;
        case 'dateDesc':
          data.sort((a, b) =>
            new Date(b.datePosted) - new Date(a.datePosted)
          );
          break;
        default:
          break;
      }

      setResults(data);
    } catch (e) {
      console.error(e);
      setError('Failed to search listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []); // initial on mount

  const handleSubmit = e => {
    e.preventDefault();
    fetchResults();
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Search Listings</h1>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {/* Name filter */}
          <div>
            <label className="block text-sm font-medium">Name Contains</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md"
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
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price range */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Price Range: ${minPrice} – ${maxPrice}
            </label>
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5"
              value={[minPrice, maxPrice]}
              onValueChange={([newMin, newMax]) => {
                setMin(newMin);
                setMax(newMax);
              }}
              min={0}
              max={SLIDER_MAX}
              step={1}
            >
              <Slider.Track className="bg-gray-200 relative flex-1 h-1 rounded">
                <Slider.Range className="absolute bg-blue-600 h-full rounded" />
              </Slider.Track>
              <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow" />
              <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow" />
            </Slider.Root>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        {loading && <p>Loading results…</p>}
        {error   && <p className="text-red-600">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {!loading && !results.length && <p>No matching listings.</p>}
          {results.map(item => (
            <ListingCard key={item.id} listing={item} />
          ))}
        </div>
      </div>
    </>
  );
}
