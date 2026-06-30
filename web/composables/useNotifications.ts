import { usePushNotifications } from "./usePushNotifications";

export const useNotifications = () => {
  const {
    notifications,
    unreadCount,
    inboxLoading,
    fetchNotifications,
    markNotificationRead: markRead,
    markAllNotificationsRead: markAllRead,
    startInboxSync,
  } = usePushNotifications();

  return {
    notifications,
    unreadCount,
    inboxLoading,
    fetchNotifications,
    markRead,
    markAllRead,
    startInboxSync,
  };
};
