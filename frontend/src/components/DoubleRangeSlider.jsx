import React from 'react';

export default function DoubleRangeSlider({ min, max, values, onChange }) {
  const [minVal, maxVal] = values;

  const handleMinChange = e => {
    const value = Math.min(Number(e.target.value), maxVal - 1);
    onChange([value, maxVal]);
  };

  const handleMaxChange = e => {
    const value = Math.max(Number(e.target.value), minVal + 1);
    onChange([minVal, value]);
  };

  // Compute the fill percentages
  const rangeDistance = max - min;
  const minPercent = ((minVal - min) / rangeDistance) * 100;
  const maxPercent = ((maxVal - min) / rangeDistance) * 100;

  return (
    <div className="relative w-full h-6">
      {/* Invisible range inputs */}
      <input
        type="range"
        min={min} max={max} value={minVal}
        onChange={handleMinChange}
        className="absolute w-full h-2 bg-transparent pointer-events-none appearance-none"
        style={{ zIndex: minVal > max - 100 ? 5 : 3 }}
      />
      <input
        type="range"
        min={min} max={max} value={maxVal}
        onChange={handleMaxChange}
        className="absolute w-full h-2 bg-transparent pointer-events-none appearance-none"
      />

      {/* Track background */}
      <div className="absolute top-2 left-0 right-0 h-1 bg-gray-300 rounded" />
      {/* Filled range */}
      <div
        className="absolute top-2 h-1 bg-blue-600 rounded"
        style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
      />

      {/* Thumb styling */}
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          pointer-events: all;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          border: 2px solid #2563EB;
          cursor: pointer;
          appearance: none;
        }
        input[type="range"]::-moz-range-thumb {
          pointer-events: all;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          border: 2px solid #2563EB;
          cursor: pointer;
          appearance: none;
        }
      `}</style>
    </div>
  );
}
