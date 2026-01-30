'use client';

import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import HistoryPage from './pages/HistoryPage';

type Page = 'landing' | 'dashboard' | 'history';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  return (
    <>
      {currentPage === 'landing' && (
        <LandingPage
          onNavigateToDashboard={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard
          onNavigateToLanding={() => setCurrentPage('landing')}
          onNavigateToHistory={() => setCurrentPage('history')}
        />
      )}
      {currentPage === 'history' && (
        <HistoryPage
          onBackToDashboard={() => setCurrentPage('dashboard')}
        />
      )}
    </>
  );
}
