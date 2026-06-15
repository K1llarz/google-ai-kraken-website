import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Eye, Pencil, ImagePlus, Loader2 } from 'lucide-react';
import { uploadImage } from '../../lib/storage';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/** Markdown body editor with a write/preview toggle and inline image upload. */
export function MarkdownEditor({ value, onChange, placeholder }: Props) {
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = (snippet: string) => {
    const el = textRef.current;
    if (!el) {
      onChange(value + snippet);
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    onChange(value.slice(0, start) + snippet + value.slice(end));
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const url = await uploadImage(file, 'posts');
      insertAtCursor(`\n![${file.name}](${url})\n`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const tabBtn = (active: boolean) =>
    `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${
      active ? 'bg-white text-brand-600 shadow-sm' : 'text-brand-400 hover:text-brand-600'
    }`;

  return (
    <div className="border border-brand-100 rounded-xl overflow-hidden bg-white">
      <div className="flex items-center justify-between bg-brand-50 border-b border-brand-100 px-3 py-2">
        <div className="flex items-center gap-1 bg-brand-100/60 rounded-lg p-1">
          <button type="button" className={tabBtn(tab === 'write')} onClick={() => setTab('write')}>
            <Pencil size={14} /> Write
          </button>
          <button type="button" className={tabBtn(tab === 'preview')} onClick={() => setTab('preview')}>
            <Eye size={14} /> Preview
          </button>
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-600 hover:text-brand-800 disabled:opacity-50"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
          {uploading ? 'Uploading…' : 'Insert image'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      {error && <p className="px-4 py-2 text-xs text-red-500 font-semibold bg-red-50">{error}</p>}

      {tab === 'write' ? (
        <textarea
          ref={textRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? 'Write your post in Markdown…'}
          rows={18}
          className="w-full px-4 py-3 font-mono text-sm text-brand-900 focus:outline-none resize-y leading-relaxed"
        />
      ) : (
        <div className="px-4 py-3 min-h-[20rem] markdown-body">
          {value.trim() ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          ) : (
            <p className="text-gray-400 italic">Nothing to preview yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
