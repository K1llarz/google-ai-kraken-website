import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { Field, TextInput, Button, ErrorBanner } from '../components/ui';

export function Login() {
  const { user, isAdmin, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? '/admin';

  // Already authenticated as admin -> skip the login screen.
  if (!loading && user && isAdmin) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      const code = (err as { code?: string })?.code;
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('Incorrect email or password.');
      } else {
        setError(err instanceof Error ? err.message : 'Unable to sign in.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 text-white mb-4">
            <Lock size={24} />
          </div>
          <h1 className="text-3xl font-display font-bold text-white">
            Kraken<span className="text-brand-400">.</span> Admin
          </h1>
          <p className="text-brand-300 font-medium mt-2">Sign in to manage your site.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-2xl p-8 space-y-6">
          {error && <ErrorBanner message={error} />}
          <Field label="Email">
            <TextInput
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Password">
            <TextInput
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <Button type="submit" loading={submitting} className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
