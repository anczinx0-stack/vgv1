import { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, Clock } from 'lucide-react';
import { supabase } from '../../utils/supabase';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const { data } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (data) {
        const notifs = data.map(log => ({
          id: log.id,
          type: log.action === 'issued' ? 'success' : log.action === 'revoked' ? 'warning' : 'info',
          title: getNotificationTitle(log.action),
          message: getNotificationMessage(log),
          timestamp: new Date(log.created_at),
          read: Math.random() > 0.5
        })) as Notification[];

        setNotifications(notifs);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationTitle = (action: string): string => {
    switch (action) {
      case 'issued':
        return 'Credential Issued';
      case 'verified':
        return 'Credential Verified';
      case 'shared':
        return 'Credential Shared';
      case 'revoked':
        return 'Credential Revoked';
      default:
        return 'System Event';
    }
  };

  const getNotificationMessage = (log: any): string => {
    switch (log.action) {
      case 'issued':
        return `New credential issued to ${log.actor_address.slice(0, 8)}...`;
      case 'verified':
        return `Credential verified by third party`;
      case 'shared':
        return `Credential shared with external party`;
      case 'revoked':
        return `Credential revoked by institution`;
      default:
        return 'System activity detected';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeBg = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/30';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/30';
      default:
        return 'bg-gray-500/10 border-gray-500/30';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-bold text-white">Notifications</h3>
        </div>
        <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
          {notifications.filter(n => !n.read).length}
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-3 bg-gray-700 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-1/2"></div>
            </div>
          ))
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 border rounded-lg transition-all ${
                notification.read
                  ? 'bg-gray-700 border-gray-600'
                  : `${getTypeBg(notification.type)} border`
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getTypeIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-white truncate">
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTimestamp(notification.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && notifications.length > 0 && (
        <button className="w-full mt-4 py-2 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
          View All Notifications
        </button>
      )}
    </div>
  );
}
