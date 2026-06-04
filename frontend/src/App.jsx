import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Roadmap from './pages/Roadmap';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="min-h-screen flex flex-col selection:bg-brand-navy selection:text-white">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-8">
        {currentPage === 'home' && <Home setCurrentPage={setCurrentPage} />}
        {currentPage === 'roadmap' && <Roadmap />}
      </main>

      <Footer />
    </div>
  );
}