import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import type { PostStatus } from '../../types';

/* ------------------------------------------------------------------ inputs */

const fieldLabel = 'block text-[10px] uppercase tracking-widest font-black text-brand-400 mb-2';
const fieldBase =
  'w-full bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-brand-900 font-medium';

interface FieldProps {
  label: string;
  error?: string;
  help?: string;
  children: React.ReactNode;
}

export function Field({ label, error, help, children }: FieldProps) {
  return (
    <div>
      <label className={fieldLabel}>{label}</label>
      {children}
      {help && !error && <p className="mt-1 text-xs text-gray-400">{help}</p>}
      {error && <p className="mt-1 text-xs text-red-500 font-semibold">{error}</p>}
    </div>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
export function TextInput(props: InputProps) {
  return <input {...props} className={`${fieldBase} ${props.className ?? ''}`} />;
}

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
export function TextArea(props: TextAreaProps) {
  return <textarea {...props} className={`${fieldBase} resize-y ${props.className ?? ''}`} />;
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;
export function Select(props: SelectProps) {
  return <select {...props} className={`${fieldBase} ${props.className ?? ''}`} />;
}

/* ----------------------------------------------------------------- buttons */

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-md shadow-brand-200 disabled:bg-brand-400',
  secondary: 'bg-white text-brand-900 border border-brand-100 hover:border-brand-300',
  danger: 'bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-100 disabled:bg-red-300',
  ghost: 'text-brand-600 hover:text-brand-800',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

export function Button({ variant = 'primary', loading, children, className, disabled, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-colors disabled:cursor-not-allowed ${variants[variant]} ${className ?? ''}`}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

/* ------------------------------------------------------------- status etc. */

export function StatusBadge({ status }: { status: PostStatus }) {
  const published = status === 'published';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-black ${
        published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${published ? 'bg-green-500' : 'bg-amber-500'}`} />
      {status}
    </span>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-brand-400 gap-3">
      <Loader2 className="animate-spin" size={28} />
      {label && <p className="text-xs font-bold uppercase tracking-widest">{label}</p>}
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm font-semibold">
      <AlertCircle size={18} className="shrink-0 mt-0.5" />
      <span className="break-words">{message}</span>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-gray-500 font-medium mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------ confirm modal */

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  loading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-950/40 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] shadow-2xl border border-brand-100 max-w-md w-full p-8">
        <h3 className="text-xl font-display font-bold text-brand-900 mb-2">{title}</h3>
        <p className="text-gray-600 font-medium mb-8">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
