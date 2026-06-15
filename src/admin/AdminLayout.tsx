import React, { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, FileText, LayoutTemplate, LogOut, ExternalLink, Menu, X } from 'lucide-react';
import { useAuth } from './AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/posts', label: 'Blog Posts', icon: FileText, end: false },
  { to: '/admin/pages', label: 'Pages', icon: LayoutTemplate, end: false },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = (
    <nav className="flex flex-col gap-1">
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
              isActive
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-200'
                : 'text-brand-200 hover:bg-brand-800 hover:text-white'
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-brand-50 flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-brand-900 text-white flex-col p-6 fixed h-screen">
        <Link to="/admin" className="text-2xl font-black font-display tracking-tighter text-white mb-10">
          Kroma<span className="text-brand-400">.</span>
          <span className="block text-[10px] uppercase tracking-[0.2em] font-black text-brand-400 mt-1">Admin</span>
        </Link>
        {navLinks}
        <div className="mt-auto pt-6 border-t border-brand-800">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-brand-300 hover:text-white transition-colors"
          >
            <ExternalLink size={14} /> View Site
          </a>
          <p className="px-4 pt-3 text-xs text-brand-400 truncate" title={user?.email ?? ''}>
            {user?.email}
          </p>
          <button
            onClick={logout}
            className="mt-2 w-full flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-brand-200 hover:text-white transition-colors"
          >
            <LogOut size={14} /> Log out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 bg-brand-900 text-white flex items-center justify-between px-4 h-14">
        <Link to="/admin" className="font-black font-display tracking-tighter">
          Kroma<span className="text-brand-400">.</span> Admin
        </Link>
        <button onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu" className="p-2">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>
      {mobileOpen && (
        <div className="lg:hidden fixed top-14 inset-x-0 z-40 bg-brand-900 text-white p-4">
          {navLinks}
          <button
            onClick={logout}
            className="mt-4 w-full flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold text-brand-200 hover:bg-brand-800"
          >
            <LogOut size={18} /> Log out
          </button>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 min-w-0">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
