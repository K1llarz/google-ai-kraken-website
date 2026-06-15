import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, FilePenLine, CheckCircle2, Briefcase, Users, Plus, ArrowRight } from 'lucide-react';
import { listPosts } from '../../lib/posts';
import { listPortfolio } from '../../lib/portfolio';
import { listJobs } from '../../lib/jobs';
import type { Post } from '../../types';
import { PageHeader, Spinner, ErrorBanner, StatusBadge, Button } from '../components/ui';

function formatDate(post: Post): string {
  const ts = post.updatedAt ?? post.createdAt;
  return ts ? ts.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
}

export function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [jobsCount, setJobsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [loadedPosts, portfolio, jobs] = await Promise.all([
          listPosts(),
          listPortfolio(),
          listJobs(),
        ]);
        setPosts(loadedPosts);
        setPortfolioCount(portfolio.length);
        setJobsCount(jobs.length);
      } catch {
        setError('Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Spinner label="Loading dashboard" />;

  const total = posts.length;
  const drafts = posts.filter((p) => p.status === 'draft').length;
  const published = total - drafts;
  const recent = [...posts]
    .sort((a, b) => (b.updatedAt?.toMillis() ?? 0) - (a.updatedAt?.toMillis() ?? 0))
    .slice(0, 5);

  const stats = [
    { label: 'Total Posts', value: total, icon: FileText, color: 'text-brand-600 bg-brand-100' },
    { label: 'Published', value: published, icon: CheckCircle2, color: 'text-green-700 bg-green-100' },
    { label: 'Drafts', value: drafts, icon: FilePenLine, color: 'text-amber-700 bg-amber-100' },
    { label: 'Portfolio', value: portfolioCount, icon: Briefcase, color: 'text-brand-700 bg-brand-100' },
    { label: 'Open Roles', value: jobsCount, icon: Users, color: 'text-brand-600 bg-brand-100' },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your content."
        action={
          <Link to="/admin/posts/new">
            <Button>
              <Plus size={16} /> New Post
            </Button>
          </Link>
        }
      />

      {error && <div className="mb-6"><ErrorBanner message={error} /></div>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-3xl border border-brand-100 p-6 shadow-sm">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color}`}>
              <Icon size={22} />
            </div>
            <p className="text-4xl font-display font-bold text-brand-900">{value}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-brand-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-100">
          <h2 className="font-display font-bold text-brand-900">Recent Activity</h2>
          <Link to="/admin/posts" className="text-brand-600 text-xs font-bold uppercase tracking-widest hover:text-brand-800 inline-flex items-center gap-1">
            All posts <ArrowRight size={14} />
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400 font-medium">
            No posts yet. <Link to="/admin/posts/new" className="text-brand-600 font-bold">Create your first post</Link>.
          </div>
        ) : (
          <ul className="divide-y divide-brand-50">
            {recent.map((post) => (
              <li key={post.id}>
                <Link
                  to={`/admin/posts/${post.id}`}
                  className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-brand-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-brand-900 truncate">{post.title || 'Untitled'}</p>
                    <p className="text-xs text-gray-400 font-medium">Updated {formatDate(post)}</p>
                  </div>
                  <StatusBadge status={post.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
