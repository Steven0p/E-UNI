import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import notificationService from '../services/notificationService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const refresh = useCallback(async () => {
    if (!user) return;
    const data = await notificationService.forUser(user.id);
    setNotifications(data);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <NotificationContext.Provider value={{ notifications, refresh }}>{children}</NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications doit être utilisé dans un NotificationProvider.');
  return context;
}
