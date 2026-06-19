// App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Common/Navbar';
import Footer from './components/Common/Footer';
import AppRoutes from './routes';
import { ShieldAlert, X } from 'lucide-react';
import './App.css';

// Subcomponent to display system alerts dynamically
function SystemAlertBanner() {
  const { adminAlerts, removeAdminAlert } = useApp();
  const activeAlerts = adminAlerts.filter(alert => alert.active);

  if (activeAlerts.length === 0) return null;

  return (
    <div className="system-alerts-container">
      {activeAlerts.map(alert => (
        <div key={alert.id} className="system-alert-bar slide-up">
          <div className="alert-content">
            <ShieldAlert size={18} className="alert-icon-warning" />
            <span className="alert-text">{alert.message}</span>
          </div>
          <button 
            className="alert-close-btn" 
            onClick={() => removeAdminAlert(alert.id)}
            aria-label="Dismiss Alert"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

// Subcomponent for floating Toast notifications
function ToastNotifications() {
  const { notifications } = useApp();
  const [activeToasts, setActiveToasts] = React.useState([]);

  // Check for new notifications and add to active toasts
  React.useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      // Only show toasts for items created in the last 6 seconds
      const isRecent = (Date.now() - new Date(latest.date).getTime()) < 6000;
      
      if (isRecent && !activeToasts.some(t => t.id === latest.id)) {
        setActiveToasts(prev => [latest, ...prev].slice(0, 3)); // show max 3
        
        // Remove toast after 4 seconds
        setTimeout(() => {
          setActiveToasts(prev => prev.filter(t => t.id !== latest.id));
        }, 4000);
      }
    }
  }, [notifications]);

  if (activeToasts.length === 0) return null;

  return (
    <div className="toast-container">
      {activeToasts.map(toast => (
        <div key={toast.id} className={`toast-card glass-card slide-up toast-${toast.type || 'info'}`}>
          <div className="toast-body-content">
            <span className="toast-message-text">{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function AppContent() {
  return (
    <div className="app-shell">
      <Navbar />
      <SystemAlertBanner />
      <main className="main-content">
        <AppRoutes />
      </main>
      <ToastNotifications />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AuthProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </AuthProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
