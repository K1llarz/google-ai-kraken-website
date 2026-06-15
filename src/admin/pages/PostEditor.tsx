import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, ExternalLink } from 'lucide-react';
import { createPost, getPost, updatePost, deletePost, slugify } from '../../lib/posts';
import type { PostInput, PostStatus } from '../../types';
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

const EMPTY: PostInput = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  coverImage: '',
  category: '',
  tags: [],
  author: '',
  authorRole: '',
  readTime: '',
  status: 'draft',
  seoTitle: '',
  seoDescription: '',
};

type Errors = Partial<Record<keyof PostInput, string>>;

function validate(form: PostInput): Errors {
  const errors: Errors = {};
  if (!form.title.trim()) errors.title = 'Title is required.';
  if (!form.slug.trim()) errors.slug = 'Slug is required.';
  else if (!/^[a-z0-9-]+$/.test(form.slug)) errors.slug = 'Use lowercase letters, numbers, and hyphens only.';
  if (!form.content.trim()) errors.content = 'Content is required.';
  if (form.status === 'published' && !form.excerpt.trim()) {
    errors.excerpt = 'An excerpt is required before publishing.';
  }
  if (form.seoDescription.length > 160) errors.seoDescription = 'Keep meta description under 160 characters.';
  return errors;
}

export function PostEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();

  const [form, setForm] = useState<PostInput>(EMPTY);
  const [tagsText, setTagsText] = useState('');
  const [wasPublished, setWasPublished] = useState(false);
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
        const post = await getPost(id!);
        if (!post) {
          setError('Post not found.');
          return;
        }
        const { id: _omit, createdAt, updatedAt, publishedAt, ...rest } = post;
        setForm(rest);
        setTagsText(post.tags.join(', '));
        setWasPublished(post.status === 'published');
        setSlugEdited(true); // don't auto-rewrite an existing slug
      } catch {
        setError('Failed to load the post.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isNew]);

  const set = <K extends keyof PostInput>(key: K, value: PostInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onTitleChange = (value: string) => {
    set('title', value);
    if (!slugEdited) set('slug', slugify(value));
  };

  const liveUrl = useMemo(() => (form.slug ? `/blog/${form.slug}` : null), [form.slug]);

  const save = async (status: PostStatus) => {
    const next: PostInput = {
      ...form,
      status,
      tags: tagsText.split(',').map((t) => t.trim()).filter(Boolean),
      seoTitle: form.seoTitle.trim() || form.title.trim(),
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
        const newId = await createPost(next);
        navigate(`/admin/posts/${newId}`, { replace: true });
      } else {
        await updatePost(id!, next, wasPublished);
        setForm(next);
        setWasPublished(status === 'published');
      }
    } catch {
      setError('Save failed. Check your connection and permissions.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isNew) return;
    setDeleting(true);
    try {
      await deletePost(id!);
      navigate('/admin/posts', { replace: true });
    } catch {
      setError('Failed to delete the post.');
      setDeleting(false);
    }
  };

  if (loading) return <Spinner label="Loading post" />;

  return (
    <div>
      <Link to="/admin/posts" className="inline-flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-widest hover:text-brand-800 mb-6">
        <ArrowLeft size={16} /> All Posts
      </Link>

      <PageHeader title={isNew ? 'New Post' : 'Edit Post'} />

      {error && <div className="mb-6"><ErrorBanner message={error} /></div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          <Field label="Title" error={errors.title}>
            <TextInput value={form.title} onChange={(e) => onTitleChange(e.target.value)} placeholder="A compelling headline" />
          </Field>

          <Field label="Slug" error={errors.slug} help={liveUrl ? `URL: ${liveUrl}` : undefined}>
            <TextInput
              value={form.slug}
              onChange={(e) => {
                setSlugEdited(true);
                set('slug', e.target.value);
              }}
              placeholder="auto-generated-from-title"
            />
          </Field>

          <Field label="Content (Markdown)" error={errors.content}>
            <MarkdownEditor value={form.content} onChange={(v) => set('content', v)} />
          </Field>

          <Field label="Excerpt" error={errors.excerpt} help="Short summary shown in listings.">
            <TextArea rows={3} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} />
          </Field>
        </div>

        {/* Sidebar */}
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
            <ImageUpload value={form.coverImage} onChange={(url) => set('coverImage', url)} folder="posts" />
          </div>

          <div className="bg-white rounded-3xl border border-brand-100 p-6 space-y-4 shadow-sm">
            <h3 className="font-display font-bold text-brand-900">Organize</h3>
            <Field label="Category">
              <TextInput value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="e.g. AI, Design" />
            </Field>
            <Field label="Tags" help="Comma-separated.">
              <TextInput value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="marketing, growth" />
            </Field>
            <Field label="Author">
              <TextInput value={form.author} onChange={(e) => set('author', e.target.value)} />
            </Field>
            <Field label="Author role">
              <TextInput value={form.authorRole} onChange={(e) => set('authorRole', e.target.value)} placeholder="Head of Growth" />
            </Field>
            <Field label="Read time">
              <TextInput value={form.readTime} onChange={(e) => set('readTime', e.target.value)} placeholder="5 min read" />
            </Field>
          </div>

          <div className="bg-white rounded-3xl border border-brand-100 p-6 space-y-4 shadow-sm">
            <h3 className="font-display font-bold text-brand-900">SEO</h3>
            <Field label="Meta title" help="Defaults to the post title.">
              <TextInput value={form.seoTitle} onChange={(e) => set('seoTitle', e.target.value)} />
            </Field>
            <Field label="Meta description" error={errors.seoDescription} help={`${form.seoDescription.length}/160`}>
              <TextArea rows={3} value={form.seoDescription} onChange={(e) => set('seoDescription', e.target.value)} />
            </Field>
          </div>

          {!isNew && (
            <Button variant="danger" onClick={() => setConfirmDelete(true)} className="w-full">
              <Trash2 size={16} /> Delete Post
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete post?"
        message={`"${form.title || 'Untitled'}" will be permanently deleted. This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
