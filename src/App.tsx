import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Code Splitting: Lazy load pages for better performance
const DashboardPage = lazy(() => import(/* viteChunkName: "dashboard" */ './components/features/dashboard/DashboardPage').then(module => ({ default: module.DashboardPage })));
const ReportPage = lazy(() => import(/* viteChunkName: "reports" */ './components/features/reports/ReportPage').then(module => ({ default: module.ReportPage })));
const MachinePage = lazy(() => import(/* viteChunkName: "machines" */ './components/features/machines/MachinePage').then(module => ({ default: module.MachinePage })));
const SettingsPage = lazy(() => import(/* viteChunkName: "settings" */ './components/features/settings/SettingsPage').then(module => ({ default: module.SettingsPage })));
const NotFoundPage = lazy(() => import(/* viteChunkName: "shared" */ './components/shared/NotFoundPage').then(module => ({ default: module.NotFoundPage })));

// Loading Component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="size-10 border-4 border-signal-blue/30 border-t-signal-blue rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-500 animate-pulse">SignalCraft 로딩 중...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/machines" element={<MachinePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
