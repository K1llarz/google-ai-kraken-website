import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { createJob, getJob, updateJob, deleteJob } from '../../lib/jobs';
import type { JobInput, PostStatus } from '../../types';
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

const EMPTY: JobInput = {
  title: '',
  department: '',
  location: '',
  type: 'Full-time',
  description: '',
  status: 'published',
};

type Errors = Partial<Record<keyof JobInput, string>>;

function validate(form: JobInput): Errors {
  const errors: Errors = {};
  if (!form.title.trim()) errors.title = 'Title is required.';
  if (!form.department.trim()) errors.department = 'Department is required.';
  if (!form.location.trim()) errors.location = 'Location is required.';
  return errors;
}

export function JobEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();

  const [form, setForm] = useState<JobInput>(EMPTY);
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
        const job = await getJob(id!);
        if (!job) {
          setError('Role not found.');
          return;
        }
        const { id: _omit, createdAt, updatedAt, ...rest } = job;
        setForm(rest);
      } catch {
        setError('Failed to load the role.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isNew]);

  const set = <K extends keyof JobInput>(key: K, value: JobInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setError('Please fix the highlighted fields.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      if (isNew) {
        const newId = await createJob(form);
        navigate(`/admin/careers/${newId}`, { replace: true });
      } else {
        await updateJob(id!, form);
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
      await deleteJob(id!);
      navigate('/admin/careers', { replace: true });
    } catch {
      setError('Failed to delete the role.');
      setDeleting(false);
    }
  };

  if (loading) return <Spinner label="Loading role" />;

  return (
    <div>
      <Link to="/admin/careers" className="inline-flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-widest hover:text-brand-800 mb-6">
        <ArrowLeft size={16} /> All Roles
      </Link>

      <PageHeader title={isNew ? 'New Role' : 'Edit Role'} />

      {error && <div className="mb-6"><ErrorBanner message={error} /></div>}

      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-3xl border border-brand-100 p-6 md:p-8 space-y-4 shadow-sm">
          <Field label="Title" error={errors.title}>
            <TextInput value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Senior Visual Designer" />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Department" error={errors.department}>
              <TextInput value={form.department} onChange={(e) => set('department', e.target.value)} placeholder="Creative" />
            </Field>
            <Field label="Location" error={errors.location}>
              <TextInput value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="Remote" />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Type">
              <Select value={form.type} onChange={(e) => set('type', e.target.value)}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </Select>
            </Field>
            <Field label="Status">
              <Select value={form.status} onChange={(e) => set('status', e.target.value as PostStatus)}>
                <option value="published">Published</option>
                <option value="draft">Draft (hidden)</option>
              </Select>
            </Field>
          </div>
          <Field label="Description" help="Shown to applicants. Optional.">
            <TextArea rows={5} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </Field>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={save} loading={saving}>
            <Save size={16} /> Save Role
          </Button>
          {!isNew && (
            <Button variant="danger" onClick={() => setConfirmDelete(true)}>
              <Trash2 size={16} /> Delete
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete role?"
        message={`"${form.title || 'Untitled role'}" will be permanently deleted. This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
