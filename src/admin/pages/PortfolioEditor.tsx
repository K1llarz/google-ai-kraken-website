import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, ExternalLink } from 'lucide-react';
import {
  createPortfolioItem,
  getPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  slugify,
} from '../../lib/portfolio';
import type { PortfolioInput, PostStatus } from '../../types';
import {
  Field,
  TextInput,
  TextArea,
  Select,
  Button,
  Spinner,
  ErrorBanner,
  ConfirmDialog,
  PageHeader,
} from '../components/ui';
import { MarkdownEditor } from '../components/MarkdownEditor';
import { ImageUpload } from '../components/ImageUpload';

const EMPTY: PortfolioInput = {
  title: '',
  slug: '',
  category: '',
  image: '',
  client: '',
  duration: '',
  challenge: '',
  solution: '',
  results: [],
  content: '',
  status: 'draft',
};

type Errors = Partial<Record<keyof PortfolioInput, string>>;

function validate(form: PortfolioInput): Errors {
  const errors: Errors = {};
  if (!form.title.trim()) errors.title = 'Title is required.';
  if (!form.slug.trim()) errors.slug = 'Slug is required.';
  else if (!/^[a-z0-9-]+$/.test(form.slug)) errors.slug = 'Use lowercase letters, numbers, and hyphens only.';
  if (!form.category.trim()) errors.category = 'Category is required.';
  return errors;
}

export function PortfolioEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();

  const [form, setForm] = useState<PortfolioInput>(EMPTY);
  const [resultsText, setResultsText] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const item = await getPortfolioItem(id!);
        if (!item) {
          setError('Project not found.');
          return;
        }
        const { id: _omit, createdAt, updatedAt, ...rest } = item;
        setForm(rest);
        setResultsText(item.results.join('\n'));
        setSlugEdited(true);
      } catch {
        setError('Failed to load the project.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isNew]);

  const set = <K extends keyof PortfolioInput>(key: K, value: PortfolioInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onTitleChange = (value: string) => {
    set('title', value);
    if (!slugEdited) set('slug', slugify(value));
  };

  const liveUrl = useMemo(() => (form.slug ? `/portfolio/${form.slug}` : null), [form.slug]);

  const save = async (status: PostStatus) => {
    const next: PortfolioInput = {
      ...form,
      status,
      results: resultsText.split('\n').map((r) => r.trim()).filter(Boolean),
    };
    const found = validate(next);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setError('Please fix the highlighted fields.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      if (isNew) {
        const newId = await createPortfolioItem(next);
        navigate(`/admin/portfolio/${newId}`, { replace: true });
      } else {
        await updatePortfolioItem(id!, next);
        setForm(next);
      }
    } catch {
      setError('Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isNew) return;
    setDeleting(true);
    try {
      await deletePortfolioItem(id!);
      navigate('/admin/portfolio', { replace: true });
    } catch {
      setError('Failed to delete the project.');
      setDeleting(false);
    }
  };

  if (loading) return <Spinner label="Loading project" />;

  return (
    <div>
      <Link to="/admin/portfolio" className="inline-flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-widest hover:text-brand-800 mb-6">
        <ArrowLeft size={16} /> All Projects
      </Link>

      <PageHeader title={isNew ? 'New Project' : 'Edit Project'} />

      {error && <div className="mb-6"><ErrorBanner message={error} /></div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Field label="Title" error={errors.title}>
            <TextInput value={form.title} onChange={(e) => onTitleChange(e.target.value)} placeholder="Project name" />
          </Field>

          <Field label="Slug" error={errors.slug} help={liveUrl ? `URL: ${liveUrl}` : undefined}>
            <TextInput
              value={form.slug}
              onChange={(e) => {
                setSlugEdited(true);
                set('slug', e.target.value);
              }}
            />
          </Field>

          <Field label="Case study (Markdown)">
            <MarkdownEditor value={form.content} onChange={(v) => set('content', v)} placeholder="Tell the story of this project…" />
          </Field>

          <Field label="The Challenge">
            <TextArea rows={3} value={form.challenge} onChange={(e) => set('challenge', e.target.value)} />
          </Field>

          <Field label="The Solution">
            <TextArea rows={3} value={form.solution} onChange={(e) => set('solution', e.target.value)} />
          </Field>

          <Field label="Results" help="One result per line.">
            <TextArea rows={4} value={resultsText} onChange={(e) => setResultsText(e.target.value)} placeholder={'200% Increase in online sales\n45% Growth in following'} />
          </Field>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-brand-100 p-6 space-y-4 shadow-sm">
            <Field label="Status">
              <Select value={form.status} onChange={(e) => set('status', e.target.value as PostStatus)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Select>
            </Field>
            <div className="flex flex-col gap-3 pt-2">
              <Button onClick={() => save(form.status)} loading={saving}>
                <Save size={16} /> {form.status === 'published' ? 'Save & Publish' : 'Save Draft'}
              </Button>
              {form.status === 'draft' && (
                <Button variant="secondary" onClick={() => save('published')} loading={saving}>
                  Publish now
                </Button>
              )}
              {!isNew && form.status === 'published' && liveUrl && (
                <a href={liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-widest hover:text-brand-800">
                  <ExternalLink size={14} /> View live
                </a>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-brand-100 p-6 space-y-4 shadow-sm">
            <h3 className="font-display font-bold text-brand-900">Cover Image</h3>
            <ImageUpload value={form.image} onChange={(url) => set('image', url)} folder="portfolio" />
          </div>

          <div className="bg-white rounded-3xl border border-brand-100 p-6 space-y-4 shadow-sm">
            <h3 className="font-display font-bold text-brand-900">Details</h3>
            <Field label="Category" error={errors.category} help="e.g. Design, AI/Tech, Performance Marketing">
              <TextInput value={form.category} onChange={(e) => set('category', e.target.value)} />
            </Field>
            <Field label="Client">
              <TextInput value={form.client} onChange={(e) => set('client', e.target.value)} />
            </Field>
            <Field label="Duration">
              <TextInput value={form.duration} onChange={(e) => set('duration', e.target.value)} placeholder="3 Months" />
            </Field>
          </div>

          {!isNew && (
            <Button variant="danger" onClick={() => setConfirmDelete(true)} className="w-full">
              <Trash2 size={16} /> Delete Project
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete project?"
        message={`"${form.title || 'Untitled'}" will be permanently deleted. This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
