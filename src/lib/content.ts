import { useEffect, useState } from 'react';
import { getPageContent } from './pages';

export type FieldType = 'text' | 'textarea' | 'markdown' | 'image';

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  /** Default value — mirrors the copy currently hardcoded in each page. */
  default: string;
  help?: string;
}

export interface PageDef {
  id: string;
  /** Public route the page renders at (for "view live" links). */
  path: string;
  label: string;
  fields: FieldDef[];
}

/**
 * Registry of editable static pages. Each public page reads its values through
 * `usePageContent(pageId)`, falling back to these defaults so the site renders
 * identically until an admin overrides a field.
 */
export const PAGES: PageDef[] = [
  {
    id: 'home',
    path: '/',
    label: 'Home',
    fields: [
      { key: 'heroTitle', label: 'Hero title', type: 'text', default: "Let's Build Something Unforgettable." },
      { key: 'heroSubtitle', label: 'Hero subtitle', type: 'textarea', default: 'Partner with Kroma to turn your vision into a bold digital presence — captivating audiences and driving measurable growth.' },
      { key: 'heroCtaLabel', label: 'Hero button label', type: 'text', default: 'Contact Us' },
      { key: 'aboutLabel', label: 'About section label', type: 'text', default: 'About Kroma' },
      { key: 'aboutHeading', label: 'About section heading', type: 'text', default: "We don't just build brands. We build movements." },
      { key: 'servicesHeading', label: 'Services section heading', type: 'text', default: 'Everything you need to scale, under one roof.' },
      { key: 'portfolioHeading', label: 'Portfolio section heading', type: 'text', default: 'Selected projects.' },
      { key: 'careersHeading', label: 'Careers banner heading', type: 'text', default: 'Do the best work of your life.' },
      { key: 'careersBody', label: 'Careers banner body', type: 'textarea', default: "We're always looking for brilliant misfits, visionary creatives, and ruthless optimizers to join the team." },
    ],
  },
  {
    id: 'about',
    path: '/about',
    label: 'About',
    fields: [
      { key: 'heroTitle', label: 'Hero title', type: 'text', default: 'We are the anti-agency.' },
      { key: 'heroSubtitle', label: 'Hero subtitle', type: 'textarea', default: 'Born out of frustration with slow, outdated marketing practices. We move fast, think deeply, and craft experiences that actually convert.' },
      { key: 'heroImage', label: 'Hero image', type: 'image', default: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2000' },
      { key: 'missionHeading', label: 'Mission heading', type: 'textarea', default: 'Our mission is to help exceptional brands become undeniable.' },
      { key: 'teamHeading', label: 'Team section heading', type: 'text', default: 'The minds behind the magic.' },
    ],
  },
  {
    id: 'services',
    path: '/services',
    label: 'Services',
    fields: [
      { key: 'heroTitle', label: 'Hero title', type: 'text', default: 'Our Core Services' },
      { key: 'heroSubtitle', label: 'Hero subtitle', type: 'textarea', default: "We don't do everything. We do what we're exceptionally good at. Here is how we scale brands to the moon." },
    ],
  },
  {
    id: 'portfolio',
    path: '/portfolio',
    label: 'Portfolio',
    fields: [
      { key: 'heroTitle', label: 'Hero title', type: 'text', default: 'Selected Work' },
      { key: 'heroSubtitle', label: 'Hero subtitle', type: 'textarea', default: 'A showcase of our proudest digital transformations and growth accelerations.' },
    ],
  },
  {
    id: 'careers',
    path: '/careers',
    label: 'Careers',
    fields: [
      { key: 'heroTitle', label: 'Hero title', type: 'text', default: 'Build the future with us.' },
      { key: 'heroSubtitle', label: 'Hero subtitle', type: 'textarea', default: 'We are a collective of creators, engineers, and strategists. Join a culture that champions bold ideas and ruthless execution.' },
    ],
  },
  {
    id: 'contact',
    path: '/contact',
    label: 'Contact',
    fields: [
      { key: 'heroTitle', label: 'Hero title', type: 'text', default: "Let's build together." },
      { key: 'heroSubtitle', label: 'Hero subtitle', type: 'textarea', default: "Ready to dramatically scale your brand? Drop us a line and let's get to work." },
      { key: 'email', label: 'Email address', type: 'text', default: 'hello@kroma.agency' },
      { key: 'phone', label: 'Phone number', type: 'text', default: '+1 (555) 000-0000' },
      { key: 'address', label: 'Office address', type: 'textarea', default: '123 Marketing Ave, Suite 400\nNew York, NY 10001' },
    ],
  },
];

export function getPageDef(id: string): PageDef | undefined {
  return PAGES.find((p) => p.id === id);
}

/** Build a key->default map for a page. */
export function defaultsFor(id: string): Record<string, string> {
  const def = getPageDef(id);
  if (!def) return {};
  return Object.fromEntries(def.fields.map((f) => [f.key, f.default]));
}

/**
 * Read editable content for a page: merges Firestore overrides over registry
 * defaults. Used by the public pages so admin edits are reflected live.
 */
export function usePageContent(pageId: string) {
  const defaults = defaultsFor(pageId);
  const [content, setContent] = useState<Record<string, string>>(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const stored = await getPageContent(pageId);
      if (!active) return;
      if (stored) {
        // Only override defaults with non-empty stored values.
        const merged = { ...defaults };
        for (const [k, v] of Object.entries(stored.fields)) {
          if (typeof v === 'string' && v.length > 0) merged[k] = v;
        }
        setContent(merged);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  return { content, loading };
}
