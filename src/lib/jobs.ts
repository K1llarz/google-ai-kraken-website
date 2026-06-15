/**
 * Job openings data layer — LOCAL (localStorage) implementation.
 */
import type { JobOpening, JobInput } from '../types';
import { KEYS, readJSON, writeJSON, hasKey, nowISO, newId, toTimestamp } from './localStore';
import { jobOpenings as sampleJobs } from '../data';

interface StoredJob extends Omit<JobOpening, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

function toJob(record: StoredJob): JobOpening {
  return {
    ...record,
    createdAt: toTimestamp(record.createdAt),
    updatedAt: toTimestamp(record.updatedAt),
  };
}

function seedIfEmpty(): void {
  if (hasKey(KEYS.jobs)) return;
  const iso = new Date().toISOString();
  const seeded: StoredJob[] = sampleJobs.map((j) => ({
    id: j.id,
    title: j.title,
    department: j.department,
    location: j.location,
    type: j.type,
    description: '',
    status: 'published',
    createdAt: iso,
    updatedAt: iso,
  }));
  writeJSON(KEYS.jobs, seeded);
}

function readJobs(): StoredJob[] {
  seedIfEmpty();
  return readJSON<StoredJob[]>(KEYS.jobs, []);
}

function byNewest(a: string, b: string): number {
  return new Date(b).getTime() - new Date(a).getTime();
}

/** All jobs, newest first — admin. */
export async function listJobs(): Promise<JobOpening[]> {
  return readJobs().sort((a, b) => byNewest(a.createdAt, b.createdAt)).map(toJob);
}

/** Published jobs, newest first — public site. */
export async function listPublishedJobs(): Promise<JobOpening[]> {
  return readJobs()
    .filter((j) => j.status === 'published')
    .sort((a, b) => byNewest(a.createdAt, b.createdAt))
    .map(toJob);
}

export async function getJob(id: string): Promise<JobOpening | null> {
  const found = readJobs().find((j) => j.id === id);
  return found ? toJob(found) : null;
}

export async function createJob(input: JobInput): Promise<string> {
  const jobs = readJobs();
  const iso = nowISO();
  const id = newId();
  jobs.push({ ...input, id, createdAt: iso, updatedAt: iso });
  writeJSON(KEYS.jobs, jobs);
  return id;
}

export async function updateJob(id: string, input: JobInput): Promise<void> {
  const jobs = readJobs();
  const idx = jobs.findIndex((j) => j.id === id);
  if (idx === -1) throw new Error('Job not found.');
  jobs[idx] = { ...jobs[idx], ...input, updatedAt: nowISO() };
  writeJSON(KEYS.jobs, jobs);
}

export async function deleteJob(id: string): Promise<void> {
  writeJSON(KEYS.jobs, readJobs().filter((j) => j.id !== id));
}
