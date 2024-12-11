import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LayoutWithSidebar from './layouts/LayoutWithSidebar';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp'
import Dashboard from './Pages/Dashboard'
import Statistics from './Pages/Statistics'
import Settings from './Pages/Settings';
import NotFound from './Pages/NotFound'
import './App.css'
import { Client, Account } from 'appwrite';
import Recovery from './Pages/Recovery';
import NewPassword from './Pages/NewPassword';
import ConfirmUserEmail from './Pages/ConfirmUserEmail';

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
const account = new Account(client);

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    account.get()
      .then(response => {
        setIsAuthenticated(true);
        setIsLoading(false);
        // localStorage.setItem('blockAuth', 'true');
      })
      .catch(() => {
        setIsAuthenticated(false);
        setIsLoading(false);
        // localStorage.removeItem('blockAuth');
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children;
}

const isUserActive = localStorage.getItem('blockAuth') === 'true';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}

        {/* public routes but inactive after logged in */}
        <Route path="/login" element={
          isUserActive ? <Navigate to="/dashboard" replace /> : <Login />
        } />
        <Route path="/signup" element={
          isUserActive ? <Navigate to="/dashboard" replace /> : <SignUp />
        } />
        
        {/* For password recovery */}
        <Route path="/recovery/:userMail" element={ <Recovery /> } />
        <Route path="/new-password/:userMail" element={ <NewPassword /> } />
        <Route path="/confirm-email/:confirmCode" element={ <ConfirmUserEmail /> } />
        {/* Protected Routes with Sidebar */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
              <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/statistics" element={
          <ProtectedRoute>
              <Statistics />
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute>
              <Settings />
          </ProtectedRoute>
        } />
        
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* 404 Route - This should be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
