// File: frontend/src/components/Navbar.jsx


// File: frontend/src/components/Footer.jsx
#caa580 copy color
#eadbcc main footer color  
#964boo

// File: frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import DevotionalsPage from './pages/DevotionalsPage';
import BooksPage from './pages/BooksPage';
import ContactPage from './pages/ContactPage';
import PlaylistPage from './pages/PlaylistPage';

function App() {
  return (
    <Router>
      <div className="App min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/devotionals" element={<DevotionalsPage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/playlist" element={<PlaylistPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;


// pages/Devotionals.jsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DevotionalCard from '../components/DevotionalCard';
import { getAllDevotionals } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const WrittenDevotionals = () => {
  const [visibleDevotionals, setVisibleDevotionals] = useState(12);

  // Using TanStack Query to fetch devotionals
  const { data: devotionals, isLoading, isError, error, } = useQuery({
    queryKey: ['devotionals'],
    queryFn: getAllDevotionals,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const loadMore = () => {
    setVisibleDevotionals((prev) => prev + 12);
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage message={error.message} />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Daily Devotionals
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Spiritual nourishment for your daily walk with God
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {devotionals?.slice(0, visibleDevotionals).map((devotional) => (
            <DevotionalCard key={devotional._id} devotional={devotional} />
          ))}
        </div>

        {devotionals && visibleDevotionals < devotionals.length && (
          <div className="mt-10 text-center">
            <button
              onClick={loadMore}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
            >
              Load More Devotionals
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WrittenDevotionals;