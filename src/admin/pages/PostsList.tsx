import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { listPosts, deletePost } from '../../lib/posts';
import type { Post, PostStatus } from '../../types';
import {
  PageHeader,
  Spinner,
  ErrorBanner,
  StatusBadge,
  Button,
  Select,
  ConfirmDialog,
} from '../components/ui';

type Filter = 'all' | PostStatus;

function postDate(post: Post): string {
  const ts = post.publishedAt ?? post.createdAt;
  return ts ? ts.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
}

export function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [toDelete, setToDelete] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setPosts(await listPosts());
      setError(null);
    } catch {
      setError('Could not load posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return posts.filter((p) => {
      if (filter !== 'all' && p.status !== filter) return false;
      if (!term) return true;
      return (
        p.title.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.tags.some((t) => t.toLowerCase().includes(term))
      );
    });
  }, [posts, search, filter]);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deletePost(toDelete.id);
      setPosts((prev) => prev.filter((p) => p.id !== toDelete.id));
      setToDelete(null);
    } catch {
      setError('Failed to delete the post.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Blog Posts"
        subtitle={`${posts.length} post${posts.length === 1 ? '' : 's'} total`}
        action={
          <Link to="/admin/posts/new">
            <Button>
              <Plus size={16} /> New Post
            </Button>
          </Link>
        }
      />

      {error && <div className="mb-6"><ErrorBanner message={error} /></div>}

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-300" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, category, or tag…"
            className="w-full bg-white border border-brand-100 rounded-full pl-11 pr-4 py-3 text-sm font-medium text-brand-900 focus:outline-none focus:border-brand-500"
          />
        </div>
        <Select value={filter} onChange={(e) => setFilter(e.target.value as Filter)} className="sm:w-48 !rounded-full">
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </Select>
      </div>

      {loading ? (
        <Spinner label="Loading posts" />
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-brand-100 px-6 py-16 text-center text-gray-400 font-medium">
          {posts.length === 0 ? (
            <>No posts yet. <Link to="/admin/posts/new" className="text-brand-600 font-bold">Create one</Link>.</>
          ) : (
            'No posts match your filters.'
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-brand-100 shadow-sm overflow-hidden divide-y divide-brand-50">
          {filtered.map((post) => (
            <div key={post.id} className="flex items-center gap-4 px-5 py-4 hover:bg-brand-50 transition-colors">
              {post.coverImage ? (
                <img src={post.coverImage} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0 bg-brand-50" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-brand-100 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <Link to={`/admin/posts/${post.id}`} className="font-bold text-brand-900 hover:text-brand-600 transition-colors block truncate">
                  {post.title || 'Untitled'}
                </Link>
                <p className="text-xs text-gray-400 font-medium truncate">
                  {post.category || 'Uncategorized'} · {postDate(post)}
                </p>
              </div>
              <StatusBadge status={post.status} />
              <div className="flex items-center gap-1 shrink-0">
                {post.status === 'published' && (
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    title="View live"
                    className="p-2 rounded-lg text-brand-400 hover:text-brand-600 hover:bg-white transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
                <Link
                  to={`/admin/posts/${post.id}`}
                  title="Edit"
                  className="p-2 rounded-lg text-brand-400 hover:text-brand-600 hover:bg-white transition-colors"
                >
                  <Pencil size={16} />
                </Link>
                <button
                  onClick={() => setToDelete(post)}
                  title="Delete"
                  className="p-2 rounded-lg text-brand-400 hover:text-red-500 hover:bg-white transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Delete post?"
        message={`"${toDelete?.title || 'Untitled'}" will be permanently deleted. This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
