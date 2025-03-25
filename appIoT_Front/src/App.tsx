import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard/Dashboard';
import { syncService } from './services/syncService';

const App: React.FC = () => {
  useEffect(() => {
    syncService.syncData()
      .then(({ success, stats }) => {
        if (success) {
          console.log(`Actualizadas ${stats?.updatedPlots} parcelas`);
        }
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
