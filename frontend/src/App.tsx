import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import CustomersPage from './pages/CustomersPage';
import MaterialsPage from './pages/MaterialsPage';
import UsersPage from './pages/UsersPage';
import KpisPage from './pages/KpisPage';
import AssignmentsPage from './pages/AssignmentsPage';
import EvaluationsPage from './pages/EvaluationsPage';
import WorkPlansPage from './pages/WorkPlansPage';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <HomePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute requireAdminOrManager>
                    <DashboardPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/customers"
                element={
                  <PrivateRoute requireAdmin>
                    <CustomersPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/materials"
                element={
                  <PrivateRoute requireAdmin>
                    <MaterialsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <PrivateRoute requireAdmin>
                    <UsersPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/kpis"
                element={
                  <PrivateRoute requireAdminOrManager>
                    <KpisPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/assignments"
                element={
                  <PrivateRoute requireAdminOrManager>
                    <AssignmentsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/evaluations"
                element={
                  <PrivateRoute>
                    <EvaluationsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/work-plans"
                element={
                  <PrivateRoute>
                    <WorkPlansPage />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
