// File: frontend/src/components/BookCard.jsx
import React, { useState } from 'react';

const BookCard = ({ book }) => {
  const [imageError, setImageError] = useState(false);

  // Handle image loading errors
  const handleImageError = () => {
    setImageError(true);
  };

  // Format price display
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `${price.toFixed(2)}`;
    }
    return price || 'Price not available';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      {/* Book Cover Image */}
      <div className="relative aspect-[3/4] bg-gray-200 overflow-hidden">
        {!imageError && book.coverImageUrl ? (
          <img
            src={book.coverImageUrl}
            alt={`Cover of ${book.title}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-xs text-gray-500">No Image</p>
            </div>
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
      </div>

      {/* Book Details */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight">
          {book.title || 'Untitled Book'}
        </h3>

        {/* Author */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-1">
          {book.author ? `by ${book.author}` : 'Author unknown'}
        </p>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-[#964B00]">
            {formatPrice(book.price)}
          </span>
          
          <button className="bg-[#964B00] hover:bg-[#7a3d00] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v8a2 2 0 002 2h6a2 2 0 002-2v-8m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v4.01" />
            </svg>
            <span>Add to Cart</span>
          </button>
        </div>
      </div>

      {/* Optional: Book Description Preview (if available) */}
      {book.description && (
        <div className="px-4 pb-4">
          <p className="text-gray-600 text-xs line-clamp-2">
            {book.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default BookCard;