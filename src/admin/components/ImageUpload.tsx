import React, { useRef, useState } from 'react';
import { Upload, Loader2, Trash2, Link as LinkIcon } from 'lucide-react';
import { uploadImage } from '../../lib/storage';

interface Props {
  value: string;
  onChange: (url: string) => void;
  folder: string;
}

/** Image picker: upload to Firebase Storage or paste a URL. Shows a preview. */
export function ImageUpload({ value, onChange, folder }: Props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError(null);
    setUploading(true);
    setProgress(0);
    try {
      const url = await uploadImage(file, folder, setProgress);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      {value && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-brand-100 bg-brand-50 group">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-red-500 shadow hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove image"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white border border-brand-100 text-brand-900 font-bold text-xs uppercase tracking-widest hover:border-brand-300 transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? `Uploading ${progress}%` : 'Upload image'}
        </button>

        <div className="flex-1 relative">
          <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-300" />
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…or paste an image URL"
            className="w-full bg-brand-50 border border-brand-100 rounded-full pl-8 pr-4 py-3 text-sm text-brand-900 font-medium focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
    </div>
  );
}
