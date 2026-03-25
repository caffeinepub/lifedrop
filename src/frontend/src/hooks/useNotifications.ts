// Notifications stored in localStorage key "lifedrop_notifications"
// Each notification: { id, message, timestamp, read, type }

const STORAGE_KEY = "lifedrop_notifications";
// Track dismissed global (backend) notification IDs
const DISMISSED_KEY = "lifedrop_dismissed_global_notifs";

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
    const all = raw ? (JSON.parse(raw) as Notification[]) : [];
    const registeredAt = Number.parseInt(
      localStorage.getItem("lifedrop_registered_at") ?? "0",
      10,
    );
    if (registeredAt > 0) {
      return all.filter((n) => n.timestamp >= registeredAt);
    }
    return all;
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

export function loadDismissedGlobalIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function dismissGlobalNotification(id: string): void {
  const set = loadDismissedGlobalIds();
  set.add(id);
  try {
    localStorage.setItem(DISMISSED_KEY, JSON.stringify([...set]));
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent("lifedrop_notification"));
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
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(
    loadDismissedGlobalIds,
  );

  // Sync from localStorage whenever the custom event fires
  useEffect(() => {
    function sync() {
      setNotifications(loadNotifications());
      setDismissedIds(loadDismissedGlobalIds());
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

  const deleteNotification = useCallback((id: string) => {
    const updated = loadNotifications().filter((n) => n.id !== id);
    saveNotifications(updated);
    setNotifications(updated);
  }, []);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAllRead,
    clearAll,
    deleteNotification,
    dismissedIds,
  };
}
