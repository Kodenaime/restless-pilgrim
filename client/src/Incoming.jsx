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


Key: title        Value: "Sample Book"
Key: author       Value: "John Doe"
Key: description  Value: "A great book"
Key: genre        Value: "Fiction"
Key: publishedDate Value: "2023-01-01"
Key: isbn         Value: "1234567890123"
Key: price        Value: "19.99"