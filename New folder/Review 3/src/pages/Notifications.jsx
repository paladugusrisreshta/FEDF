// Notifications.jsx
import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, Check, Trash2, Eye, BellOff, Info, 
  CheckCircle, AlertTriangle, ShieldCheck 
} from 'lucide-react';
import './Notifications.css';

export default function Notifications() {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    deleteNotification, 
    clearAllNotifications 
  } = useApp();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="notif-icon text-success" size={18} />;
      case 'warning':
        return <AlertTriangle className="notif-icon text-warning" size={18} />;
      case 'info':
      default:
        return <Info className="notif-icon text-info" size={18} />;
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-page page-fade-in">
      <div className="notifications-container">
        
        {/* Header */}
        <div className="notifications-header">
          <div>
            <span className="section-subtitle">CONCIERGE FEED</span>
            <h1 className="section-title text-left">Your Notifications</h1>
          </div>
          
          {notifications.length > 0 && (
            <div className="notifications-header-actions">
              {unreadCount > 0 && (
                <button 
                  className="luxury-btn luxury-btn-secondary notif-action-btn"
                  onClick={markAllNotificationsRead}
                >
                  <Check size={14} /> Mark All Read
                </button>
              )}
              <button 
                className="luxury-btn luxury-btn-secondary notif-action-btn delete-all-btn"
                onClick={clearAllNotifications}
              >
                <Trash2 size={14} /> Clear All
              </button>
            </div>
          )}
        </div>
        <div className="section-divider text-left m-0 mb-40"></div>

        {/* Notifications list */}
        {notifications.length === 0 ? (
          <div className="glass-card empty-notifications text-center">
            <BellOff size={44} className="gold-icon mb-16" />
            <h2 className="empty-title">All Quiet</h2>
            <p className="empty-desc">You have no system updates or customisation notifications at this time.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map(notif => (
              <div 
                key={notif.id} 
                className={`glass-card notification-item ${notif.read ? 'read-item' : 'unread-item'}`}
              >
                <div className="notif-badge-dot-wrapper">
                  {!notif.read && <span className="notif-unread-dot"></span>}
                  {getIcon(notif.type)}
                </div>

                <div className="notif-message-block">
                  <p className="notif-message">{notif.message}</p>
                  <span className="notif-date">{formatDate(notif.date)}</span>
                </div>

                <div className="notif-row-actions">
                  {!notif.read && (
                    <button 
                      className="notif-row-btn read-trigger"
                      onClick={() => markNotificationRead(notif.id)}
                      title="Mark as Read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button 
                    className="notif-row-btn delete-trigger"
                    onClick={() => deleteNotification(notif.id)}
                    title="Delete Notification"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
