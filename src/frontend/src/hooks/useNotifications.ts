// Notifications stored in localStorage key "lifedrop_notifications"
// Each notification: { id, message, timestamp, read, type }

const STORAGE_KEY = "lifedrop_notifications";

export type NotificationType = "info" | "success" | "alert";

export interface Notification {
  id: string;
  message: string;
  timestamp: number;
  read: boolean;
  type: NotificationType;
}

function loadNotifications(): Notification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Notification[]) : [];
  } catch {
    return [];
  }
}

function saveNotifications(notifications: Notification[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch {
    // ignore storage errors
  }
}

// Standalone function — safe to call outside React (e.g. in event handlers)
export function addNotificationGlobal(
  message: string,
  type: NotificationType = "info",
): void {
  const existing = loadNotifications();
  const newNotif: Notification = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    message,
    timestamp: Date.now(),
    read: false,
    type,
  };
  saveNotifications([newNotif, ...existing].slice(0, 100));
  // Dispatch a custom event so the hook can react
  window.dispatchEvent(new CustomEvent("lifedrop_notification"));
}

import { useCallback, useEffect, useState } from "react";

export function useNotifications() {
  const [notifications, setNotifications] =
    useState<Notification[]>(loadNotifications);

  // Sync from localStorage whenever the custom event fires
  useEffect(() => {
    function sync() {
      setNotifications(loadNotifications());
    }
    window.addEventListener("lifedrop_notification", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("lifedrop_notification", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback(
    (message: string, type: NotificationType = "info") => {
      addNotificationGlobal(message, type);
      setNotifications(loadNotifications());
    },
    [],
  );

  const markAllRead = useCallback(() => {
    const updated = loadNotifications().map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
    setNotifications(updated);
  }, []);

  const clearAll = useCallback(() => {
    saveNotifications([]);
    setNotifications([]);
  }, []);

  return { notifications, unreadCount, addNotification, markAllRead, clearAll };
}
