/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Portfolio } from './pages/Portfolio';
import { PortfolioDetail } from './pages/PortfolioDetail';
import { Blog } from './pages/Blog';
import { BlogDetail } from './pages/BlogDetail';
import { Careers } from './pages/Careers';
import { Contact } from './pages/Contact';
import { AuthProvider } from './admin/AuthContext';
import { ProtectedRoute } from './admin/ProtectedRoute';
import { AdminLayout } from './admin/AdminLayout';
import { Login } from './admin/pages/Login';
import { Dashboard } from './admin/pages/Dashboard';
import { PostsList } from './admin/pages/PostsList';
import { PostEditor } from './admin/pages/PostEditor';
import { PortfolioList } from './admin/pages/PortfolioList';
import { PortfolioEditor } from './admin/pages/PortfolioEditor';
import { JobsList } from './admin/pages/JobsList';
import { JobEditor } from './admin/pages/JobEditor';
import { PagesList } from './admin/pages/PagesList';
import { PageEditor } from './admin/pages/PageEditor';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public site */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="portfolio/:slug" element={<PortfolioDetail />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogDetail />} />
            <Route path="careers" element={<Careers />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* Admin */}
          <Route path="/admin/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="posts" element={<PostsList />} />
              <Route path="posts/:id" element={<PostEditor />} />
              <Route path="portfolio" element={<PortfolioList />} />
              <Route path="portfolio/:id" element={<PortfolioEditor />} />
              <Route path="careers" element={<JobsList />} />
              <Route path="careers/:id" element={<JobEditor />} />
              <Route path="pages" element={<PagesList />} />
              <Route path="pages/:pageId" element={<PageEditor />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
