import { create } from "zustand";
import { createSelectors } from "./createSelectors";
import { NotificationStore } from "@/types/components/notification";

export const useNotificationStore = create<NotificationStore>()((set) => ({
  notifications: [],
  pushNotification: ({ appName, appIcon, title, message, action }) =>
    set((state) => ({
      notifications: [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          appName,
          appIcon,
          title,
          message,
          createdAt: Date.now(),
          action,
        },
        ...state.notifications,
      ].slice(0, 4),
    })),
  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id,
      ),
    })),
}));

export const useNotificationStoreSelectors =
  createSelectors(useNotificationStore);
