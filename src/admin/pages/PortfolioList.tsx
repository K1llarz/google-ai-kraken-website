import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { listPortfolio, deletePortfolioItem } from '../../lib/portfolio';
import type { PortfolioItem } from '../../types';
import {
  PageHeader,
  Spinner,
  ErrorBanner,
  StatusBadge,
  Button,
  ConfirmDialog,
} from '../components/ui';

export function PortfolioList() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [toDelete, setToDelete] = useState<PortfolioItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await listPortfolio());
      setError(null);
    } catch {
      setError('Could not load portfolio items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.client.toLowerCase().includes(term),
    );
  }, [items, search]);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deletePortfolioItem(toDelete.id);
      setItems((prev) => prev.filter((p) => p.id !== toDelete.id));
      setToDelete(null);
    } catch {
      setError('Failed to delete the item.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Portfolio"
        subtitle={`${items.length} project${items.length === 1 ? '' : 's'}`}
        action={
          <Link to="/admin/portfolio/new">
            <Button>
              <Plus size={16} /> New Project
            </Button>
          </Link>
        }
      />

      {error && <div className="mb-6"><ErrorBanner message={error} /></div>}

      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-300" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, category, or client…"
          className="w-full bg-white border border-brand-100 rounded-full pl-11 pr-4 py-3 text-sm font-medium text-brand-900 focus:outline-none focus:border-brand-500"
        />
      </div>

      {loading ? (
        <Spinner label="Loading portfolio" />
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-brand-100 px-6 py-16 text-center text-gray-400 font-medium">
          {items.length === 0 ? (
            <>No projects yet. <Link to="/admin/portfolio/new" className="text-brand-600 font-bold">Add one</Link>.</>
          ) : (
            'No projects match your search.'
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-brand-100 shadow-sm overflow-hidden divide-y divide-brand-50">
          {filtered.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-5 py-4 hover:bg-brand-50 transition-colors">
              {item.image ? (
                <img src={item.image} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0 bg-brand-50" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-brand-100 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <Link to={`/admin/portfolio/${item.id}`} className="font-bold text-brand-900 hover:text-brand-600 transition-colors block truncate">
                  {item.title || 'Untitled'}
                </Link>
                <p className="text-xs text-gray-400 font-medium truncate">
                  {item.category || 'Uncategorized'}{item.client ? ` · ${item.client}` : ''}
                </p>
              </div>
              <StatusBadge status={item.status} />
              <div className="flex items-center gap-1 shrink-0">
                {item.status === 'published' && (
                  <a href={`/portfolio/${item.slug}`} target="_blank" rel="noreferrer" title="View live" className="p-2 rounded-lg text-brand-400 hover:text-brand-600 hover:bg-white transition-colors">
                    <ExternalLink size={16} />
                  </a>
                )}
                <Link to={`/admin/portfolio/${item.id}`} title="Edit" className="p-2 rounded-lg text-brand-400 hover:text-brand-600 hover:bg-white transition-colors">
                  <Pencil size={16} />
                </Link>
                <button onClick={() => setToDelete(item)} title="Delete" className="p-2 rounded-lg text-brand-400 hover:text-red-500 hover:bg-white transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Delete project?"
        message={`"${toDelete?.title || 'Untitled'}" will be permanently deleted. This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
