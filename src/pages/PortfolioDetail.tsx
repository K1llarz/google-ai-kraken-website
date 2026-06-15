import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AnimatedSection } from '../components/AnimatedSection';
import { Skeleton } from '../components/Skeleton';
import { getPublishedPortfolioBySlug } from '../lib/portfolio';
import type { PortfolioItem } from '../types';

export function PortfolioDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    (async () => {
      try {
        setItem(slug ? await getPublishedPortfolioBySlug(slug) : null);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (!loading && !item) {
    return (
      <div className="min-h-screen bg-brand-50 pt-40 px-6 text-center">
        <h1 className="text-3xl font-bold text-brand-900 mb-4">Project Not Found</h1>
        <Link to="/portfolio" className="text-brand-600 hover:text-brand-800 font-bold uppercase tracking-widest text-xs">← Back to Portfolio</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
        <div className="mb-12">
          <Link to="/portfolio" className="inline-flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-widest hover:text-brand-800 transition-colors">
            <ArrowLeft size={16} />
            Back to Portfolio
          </Link>
        </div>

        {loading || !item ? (
          <div className="max-w-4xl">
            <Skeleton className="h-6 w-32 mb-6 rounded-full" />
            <Skeleton className="h-16 w-3/4 mb-6 rounded-xl" />
            <Skeleton className="h-6 w-1/2 rounded-full" />
          </div>
        ) : (
          <AnimatedSection className="max-w-4xl">
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-400 mb-6 block">
              {item.category}
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-brand-900 mb-8 tracking-tight leading-tight">
              {item.title}
            </h1>
            <div className="flex flex-wrap gap-8 text-sm pt-8 border-t border-brand-100">
              {item.client && (
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.2em] font-black text-brand-400 mb-1">Client</span>
                  <strong className="text-brand-900">{item.client}</strong>
                </div>
              )}
              {item.duration && (
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.2em] font-black text-brand-400 mb-1">Duration</span>
                  <strong className="text-brand-900">{item.duration}</strong>
                </div>
              )}
            </div>
          </AnimatedSection>
        )}
      </section>

      {/* Hero Image */}
      {(loading || item?.image) && (
        <section className="px-6 max-w-7xl mx-auto mb-20">
          {loading || !item ? (
            <Skeleton className="w-full aspect-[21/9] rounded-[2.5rem]" />
          ) : (
            <AnimatedSection>
              <div className="aspect-[21/9] rounded-[2.5rem] overflow-hidden border border-brand-100">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
            </AnimatedSection>
          )}
        </section>
      )}

      {/* Content */}
      <section className="px-6 max-w-7xl mx-auto pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {loading || !item ? (
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
                <div className="markdown-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.content}</ReactMarkdown>
                </div>
              </AnimatedSection>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-12">
            {loading || !item ? (
              <div>
                <Skeleton className="h-6 w-1/2 mb-4 rounded-md" />
                <Skeleton className="h-20 w-full mb-8 rounded-xl" />
                <Skeleton className="h-6 w-1/2 mb-4 rounded-md" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
            ) : (
              <>
                {item.challenge && (
                  <AnimatedSection>
                    <h3 className="text-xl font-bold font-display text-brand-900 mb-4">The Challenge</h3>
                    <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100 text-gray-700 font-medium">
                      {item.challenge}
                    </div>
                  </AnimatedSection>
                )}
                {item.solution && (
                  <AnimatedSection delay={0.1}>
                    <h3 className="text-xl font-bold font-display text-brand-900 mb-4">The Solution</h3>
                    <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100 text-gray-700 font-medium">
                      {item.solution}
                    </div>
                  </AnimatedSection>
                )}
                {item.results.length > 0 && (
                  <AnimatedSection delay={0.2}>
                    <h3 className="text-xl font-bold font-display text-brand-900 mb-4">The Results</h3>
                    <ul className="space-y-4">
                      {item.results.map((res, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                            ✓
                          </span>
                          <span className="text-brand-900 font-bold">{res}</span>
                        </li>
                      ))}
                    </ul>
                  </AnimatedSection>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
