import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Devotionals from './pages/Devotionals';
import Books from './pages/Books';
import Contact from './pages/Contact';
import Playlist from './pages/Playlist';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DevotionalDetails from './pages/DevotionalDetails';
import WrittenDevotionals from './pages/WrittenDevotionals';
import AudioDevotionals from './pages/AudioDevotionals';

function App() {
  return (
    
      <div className="App min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/devotionals" element={<Devotionals />} />
          <Route path="/audio-devotionals" element={<AudioDevotionals />} />
          <Route path="/written-devotionals" element={<WrittenDevotionals />} />
          <Route path="/devotionals/:id" element={<DevotionalDetails />} />
          <Route path="/books" element={<Books />} />
          <Route path="/playlist" element={<Playlist />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        </main>
        <Footer />        
      </div>
   
  );
}

export default App;