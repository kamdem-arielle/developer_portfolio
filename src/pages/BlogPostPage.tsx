import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, ClockIcon, CalendarIcon } from 'lucide-react';
import { blogPosts } from '../components/BlogSection';
import { Footer } from '../components/Footer';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
const categoryColors:any = {
  Frontend: 'bg-accent-pink/10 text-accent-pink border-accent-pink/20',
  DevOps:
  'bg-accent-lavender/10 text-accent-lavender border-accent-lavender/20',
  Cloud: 'bg-accent-coral/10 text-accent-coral border-accent-coral/20',
  Career: 'bg-navy/10 text-navy border-navy/20'
};
export function BlogPostPage() {
  const { slug } = useParams<{
    slug: string;
  }>();
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) {
    return <Navigate to="/blog" replace />;
  }
  // Get related posts (same category, excluding current)
  const relatedPosts = blogPosts.
  filter((p) => p.category === post.category && p.id !== post.id).
  slice(0, 2);
  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary/90 backdrop-blur-md border-b border-primary-dark/50">
        <div className="max-w-4xl mx-auto px-6 md:px-16 py-4 flex items-center justify-between">
          <Link
            to="/blog"
            className="inline-flex items-center text-sm font-medium text-slate hover:text-navy transition-colors">
            
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            All Posts
          </Link>
          <Link to="/" className="font-heading text-2xl font-bold text-navy">
            AK <span className="text-accent-pink">Dev</span>
          </Link>
        </div>
      </header>

      {/* Article */}
      <main className="max-w-4xl mx-auto px-6 md:px-12">
        <article className="py-16">
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
            }}>
            
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${categoryColors[post.category]}`}>
                
                {post.category}
              </span>
              <span className="flex items-center text-sm text-slate">
                <CalendarIcon className="w-4 h-4 mr-1.5" />
                {post.date}
              </span>
              <span className="flex items-center text-sm text-slate">
                <ClockIcon className="w-4 h-4 mr-1.5" />
                {post.readTime}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-navy mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-slate leading-relaxed mb-12 pb-12 border-b border-primary-dark/30">
              {post.excerpt}
            </p>

            {/* Content */}
            {post.contentType === 'markdown' ? (
              <MarkdownRenderer content={post.content} />
            ) : (
              <div
                className="prose prose-lg max-w-none
                  prose-headings:font-heading prose-headings:text-navy prose-headings:font-bold
                  prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                  prose-p:text-slate prose-p:leading-relaxed prose-p:mb-6
                  prose-a:text-accent-pink prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-navy prose-strong:font-semibold
                  prose-code:text-accent-lavender prose-code:bg-accent-lavender/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                "
                dangerouslySetInnerHTML={{
                  __html: post.content
                }} />
            )}
            
          </motion.div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 &&
        <section className="py-16 border-t border-primary-dark/30">
            <h2 className="font-heading text-2xl font-bold text-navy mb-8">
              Related Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) =>
            <Link
              key={relatedPost.id}
              to={`/blog/${relatedPost.slug}`}
              className="group bg-white rounded-2xl p-6 shadow-warm hover:shadow-warm-hover transition-all duration-300 border border-primary-dark/20">
              
                  <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border mb-4 ${categoryColors[relatedPost.category]}`}>
                
                    {relatedPost.category}
                  </span>
                  <h3 className="font-heading text-xl font-bold text-navy group-hover:text-accent-pink transition-colors mb-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-slate text-sm line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                </Link>
            )}
            </div>
          </section>
        }

        <Footer />
      </main>
    </div>);

}