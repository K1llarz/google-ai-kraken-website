import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutTemplate, ChevronRight } from 'lucide-react';
import { PAGES } from '../../lib/content';
import { PageHeader } from '../components/ui';

export function PagesList() {
  return (
    <div>
      <PageHeader title="Pages" subtitle="Edit the content of your public pages." />

      <div className="bg-white rounded-3xl border border-brand-100 shadow-sm overflow-hidden divide-y divide-brand-50">
        {PAGES.map((page) => (
          <Link
            key={page.id}
            to={`/admin/pages/${page.id}`}
            className="flex items-center gap-4 px-6 py-5 hover:bg-brand-50 transition-colors group"
          >
            <div className="w-11 h-11 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
              <LayoutTemplate size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-brand-900 group-hover:text-brand-600 transition-colors">{page.label}</p>
              <p className="text-xs text-gray-400 font-medium">
                {page.path} · {page.fields.length} editable field{page.fields.length === 1 ? '' : 's'}
              </p>
            </div>
            <ChevronRight size={18} className="text-brand-300 group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </div>
    </div>
  );
}
