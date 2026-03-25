import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { SideBars } from './components/SideBars';
import { HomePage } from './pages/HomePage';
import { BlogListPage } from './pages/BlogListPage';
import { BlogPostPage } from './pages/BlogPostPage';
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
function MainLayout() {
  const [activeSection, setActiveSection] = useState('hero');
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isBlogPage = location.pathname.startsWith('/blog');
  useEffect(() => {
    if (!isHomePage) return;
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0.1
    };
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));
    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [isHomePage]);
  return (
    <div className="min-h-screen bg-primary text-navy font-body selection:bg-accent-pink selection:text-white">
      {!isBlogPage && <Sidebar activeSection={activeSection} />}
      <SideBars />

      {/* Main Content Area - Adjusted for better spacing */}
      <main className={isBlogPage ? 'md:px-16' : 'px-6 md:px-16 lg:px-24 xl:px-32 pt-20'}>
        <div className={`${isHomePage ? 'max-w-7xl' : ''} mx-auto`}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogListPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
          </Routes>
        </div>
      </main>
    </div>);

}
export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <MainLayout />
    </BrowserRouter>);

}