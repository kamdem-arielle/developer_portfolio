import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from 'lucide-react';
import { BlogSection } from '../components/BlogSection';
import { Footer } from '../components/Footer';
export function BlogListPage() {
  return (
    <div className="min-h-screen bg-primary flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary/90 backdrop-blur-md border-b border-primary-dark/50">
        <div className="max-w-6xl mx-auto px-6 md:px-16 py-4 flex items-center justify-between">
    
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-slate hover:text-navy transition-colors">
            
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <Link to="/" className="font-heading text-2xl font-bold text-navy">
            AK <span className="text-accent-pink">Dev</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 md:px-12 w-full flex-grow">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.5
          }}
          className="pt-16 pb-0">
          
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy mb-4">
            All Blog Posts
          </h1>
          <p className="text-slate text-lg max-w-2xl">
            Thoughts on frontend development, cloud engineering, and the journey
            between them.
          </p>
        </motion.div>

        <BlogSection showAll />
      </main>

      <div className="max-w-6xl mx-auto px-6 md:px-12 w-full">
        <Footer />
      </div>
    </div>);

}