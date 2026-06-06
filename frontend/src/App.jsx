import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import NoSession from './components/NoSession';
import Home from './pages/Home';
import Roadmap from './pages/Roadmap';
import Resources from './pages/Resources';
import Timetable from './pages/Timetable';
import Progress from './pages/Progress';

export default function App() {
  const [sessionId, setSessionId] = useState(null);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col selection:bg-brand-navy selection:text-white">
        <Header />
        <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/roadmap" element={<Roadmap setSessionId={setSessionId} />} />
            <Route path="/resources" element={sessionId ? <Resources sessionId={sessionId} /> : <NoSession />} />
            <Route path="/timetable" element={sessionId ? <Timetable sessionId={sessionId} /> : <NoSession />} />
            <Route path="/progress" element={sessionId ? <Progress sessionId={sessionId} /> : <NoSession />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}