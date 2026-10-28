import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { ReviewsList } from './pages/ReviewsList';
import { SubmitContent } from './pages/SubmitContent';
import { ReviewDetails } from './pages/ReviewDetails';
import { KnowledgeHub } from './pages/KnowledgeHub';
import { ApprovalQueue } from './pages/ApprovalQueue';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="reviews" element={<ReviewsList />} />
            <Route path="reviews/:id" element={<ReviewDetails />} />
            <Route path="submit" element={<SubmitContent />} />
            <Route path="knowledge" element={<KnowledgeHub />} />
            <Route path="approvals" element={<ApprovalQueue />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
