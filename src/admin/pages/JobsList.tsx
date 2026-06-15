import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { listJobs, deleteJob } from '../../lib/jobs';
import type { JobOpening } from '../../types';
import { PageHeader, Spinner, ErrorBanner, StatusBadge, Button, ConfirmDialog } from '../components/ui';

export function JobsList() {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<JobOpening | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setJobs(await listJobs());
      setError(null);
    } catch {
      setError('Could not load job openings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteJob(toDelete.id);
      setJobs((prev) => prev.filter((j) => j.id !== toDelete.id));
      setToDelete(null);
    } catch {
      setError('Failed to delete the job.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Careers"
        subtitle={`${jobs.length} role${jobs.length === 1 ? '' : 's'}`}
        action={
          <Link to="/admin/careers/new">
            <Button>
              <Plus size={16} /> New Role
            </Button>
          </Link>
        }
      />

      {error && <div className="mb-6"><ErrorBanner message={error} /></div>}

      {loading ? (
        <Spinner label="Loading roles" />
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-brand-100 px-6 py-16 text-center text-gray-400 font-medium">
          No roles yet. <Link to="/admin/careers/new" className="text-brand-600 font-bold">Add one</Link>.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-brand-100 shadow-sm overflow-hidden divide-y divide-brand-50">
          {jobs.map((job) => (
            <div key={job.id} className="flex items-center gap-4 px-5 py-4 hover:bg-brand-50 transition-colors">
              <div className="min-w-0 flex-1">
                <Link to={`/admin/careers/${job.id}`} className="font-bold text-brand-900 hover:text-brand-600 transition-colors block truncate">
                  {job.title || 'Untitled role'}
                </Link>
                <p className="text-xs text-gray-400 font-medium truncate">
                  {[job.department, job.location, job.type].filter(Boolean).join(' · ')}
                </p>
              </div>
              <StatusBadge status={job.status} />
              <div className="flex items-center gap-1 shrink-0">
                <Link to={`/admin/careers/${job.id}`} title="Edit" className="p-2 rounded-lg text-brand-400 hover:text-brand-600 hover:bg-white transition-colors">
                  <Pencil size={16} />
                </Link>
                <button onClick={() => setToDelete(job)} title="Delete" className="p-2 rounded-lg text-brand-400 hover:text-red-500 hover:bg-white transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Delete role?"
        message={`"${toDelete?.title || 'Untitled role'}" will be permanently deleted. This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
