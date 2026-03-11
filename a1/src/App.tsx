import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ExaminerDashboard } from './pages/ExaminerDashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import './App.css';

function App() {
  const { isAuthenticated, currentUser } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLoginSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (!isAuthenticated || !currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Route based on user role
  if (currentUser.role === 'Admin') {
    return <AdminDashboard key={refreshKey} />;
  }

  if (currentUser.role === 'Examiner') {
    return <ExaminerDashboard key={refreshKey} />;
  }

  if (currentUser.role === 'Student') {
    return <StudentDashboard key={refreshKey} />;
  }

  return <div>Unknown role</div>;
}

export default App;
