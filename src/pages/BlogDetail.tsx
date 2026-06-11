import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AnimatedSection } from '../components/AnimatedSection';
import { Skeleton } from '../components/Skeleton';
import { blogPosts } from '../data';

export function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [id]);

  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-brand-50 pt-40 px-6 text-center">
        <h1 className="text-3xl font-bold text-brand-900 mb-4">Article Not Found</h1>
        <Link to="/blog" className="text-brand-600 hover:text-brand-800 font-bold uppercase tracking-widest text-xs">← Back to Insights</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="pt-32 pb-16 px-6 max-w-4xl mx-auto">
        <div className="mb-12">
          <Link to="/blog" className="inline-flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-widest hover:text-brand-800 transition-colors">
            <ArrowLeft size={16} />
            Back to Insights
          </Link>
        </div>
        
        {loading ? (
          <div>
            <Skeleton className="h-6 w-32 mb-6 rounded-full" />
            <Skeleton className="h-16 w-full mb-6 rounded-xl" />
            <Skeleton className="h-6 w-1/2 rounded-full" />
          </div>
        ) : (
          <AnimatedSection>
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-brand-50 border border-brand-100 text-brand-600 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-black">
                {post.category}
              </span>
              <span className="text-[10px] uppercase tracking-widest font-black text-brand-400">
                {post.readTime}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-brand-900 mb-8 tracking-tight leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 pt-8 border-t border-brand-100">
              <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-lg">
                {post.author?.[0]}
              </div>
              <div>
                <strong className="block text-brand-900 font-bold">{post.author}</strong>
                <span className="text-xs font-bold uppercase tracking-widest text-brand-400">{post.authorRole} • {post.date}</span>
              </div>
            </div>
          </AnimatedSection>
        )}
      </section>

      {/* Hero Image */}
      <section className="px-6 max-w-5xl mx-auto mb-20">
        {loading ? (
          <Skeleton className="w-full aspect-[21/9] rounded-[2.5rem]" />
        ) : (
          <AnimatedSection>
            <div className="aspect-[21/9] rounded-[2.5rem] overflow-hidden border border-brand-100">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </AnimatedSection>
        )}
      </section>

      {/* Content */}
      <section className="px-6 max-w-3xl mx-auto pb-32">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-4/5 rounded-md" />
            <div className="h-8" />
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-3/4 rounded-md" />
          </div>
        ) : (
          <AnimatedSection>
            <div className="prose prose-lg prose-brand max-w-none text-gray-700 font-medium leading-relaxed">
              {post.content?.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="mb-6 text-xl leading-relaxed">{paragraph}</p>
              ))}
            </div>
          </AnimatedSection>
        )}
      </section>
    </div>
  );
}
