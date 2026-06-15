import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Save, ExternalLink, CheckCircle2 } from 'lucide-react';
import { getPageDef, defaultsFor } from '../../lib/content';
import { getPageContent, savePageContent } from '../../lib/pages';
import {
  Field,
  TextInput,
  TextArea,
  Button,
  Spinner,
  ErrorBanner,
  PageHeader,
} from '../components/ui';
import { ImageUpload } from '../components/ImageUpload';

export function PageEditor() {
  const { pageId } = useParams<{ pageId: string }>();
  const def = pageId ? getPageDef(pageId) : undefined;

  const [fields, setFields] = useState<Record<string, string>>({});
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!def) return;
    setLoading(true);
    setSaved(false);
    (async () => {
      const base = defaultsFor(def.id);
      try {
        const stored = await getPageContent(def.id);
        if (stored) {
          const merged = { ...base };
          for (const [k, v] of Object.entries(stored.fields)) {
            if (typeof v === 'string') merged[k] = v;
          }
          setFields(merged);
          setSeoTitle(stored.seoTitle);
          setSeoDescription(stored.seoDescription);
        } else {
          setFields(base);
        }
      } catch {
        setError('Could not load saved content; showing defaults.');
        setFields(base);
      } finally {
        setLoading(false);
      }
    })();
  }, [def]);

  if (!def) return <Navigate to="/admin/pages" replace />;

  const setField = (key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (seoDescription.length > 160) {
      setError('Keep the meta description under 160 characters.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await savePageContent(def.id, { fields, seoTitle, seoDescription });
      setSaved(true);
    } catch {
      setError('Save failed. Check your connection and permissions.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner label="Loading content" />;

  return (
    <div>
      <Link to="/admin/pages" className="inline-flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-widest hover:text-brand-800 mb-6">
        <ArrowLeft size={16} /> All Pages
      </Link>

      <PageHeader
        title={`Edit: ${def.label}`}
        subtitle="Changes go live on the public site as soon as you save."
        action={
          <a href={def.path} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-widest hover:text-brand-800">
            <ExternalLink size={14} /> View page
          </a>
        }
      />

      {error && <div className="mb-6"><ErrorBanner message={error} /></div>}

      <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-brand-100 p-6 md:p-8 space-y-6 shadow-sm">
          {def.fields.map((f) => (
            <Field key={f.key} label={f.label} help={f.help}>
              {f.type === 'image' ? (
                <ImageUpload value={fields[f.key] ?? ''} onChange={(url) => setField(f.key, url)} folder="pages" />
              ) : f.type === 'textarea' || f.type === 'markdown' ? (
                <TextArea rows={f.type === 'markdown' ? 8 : 3} value={fields[f.key] ?? ''} onChange={(e) => setField(f.key, e.target.value)} />
              ) : (
                <TextInput value={fields[f.key] ?? ''} onChange={(e) => setField(f.key, e.target.value)} />
              )}
            </Field>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-brand-100 p-6 md:p-8 space-y-4 shadow-sm">
          <h3 className="font-display font-bold text-brand-900">SEO Metadata</h3>
          <Field label="Meta title">
            <TextInput value={seoTitle} onChange={(e) => { setSeoTitle(e.target.value); setSaved(false); }} placeholder={`${def.label} · Kroma`} />
          </Field>
          <Field label="Meta description" help={`${seoDescription.length}/160`}>
            <TextArea rows={3} value={seoDescription} onChange={(e) => { setSeoDescription(e.target.value); setSaved(false); }} />
          </Field>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={handleSave} loading={saving}>
            <Save size={16} /> Save Changes
          </Button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-green-600 font-bold text-xs uppercase tracking-widest">
              <CheckCircle2 size={16} /> Saved
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
