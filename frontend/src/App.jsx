import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/layout/Footer';

import { Home } from './pages/Home';
import { Journal } from './pages/Journal';
import { ArticleDetail } from './pages/ArticleDetail';
import { Experiments } from './pages/Experiments';
import { About } from './pages/About';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-[#08090B] text-[#F5F7FA] font-sans antialiased selection:bg-[#6C8CFF]/30 selection:text-white flex flex-col justify-between">
        <div>
          <Navbar />
          <main className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-12 pb-8">
            <Routes>
              {/* Journal & Lab Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/journal/:slug" element={<ArticleDetail />} />
              <Route path="/experiments" element={<Experiments />} />
              <Route path="/about" element={<About />} />

              {/* Fallback 404 */}
              <Route
                path="*"
                element={
                  <div className="py-24 text-center space-y-4">
                    <div className="font-mono text-4xl text-[#6C8CFF] font-bold">404</div>
                    <h1 className="font-mono text-xl text-[#F5F7FA]">SIGNAL NOT FOUND</h1>
                    <p className="text-sm text-[#9CA3AF]">
                      The page or signal you requested does not exist.
                    </p>
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
