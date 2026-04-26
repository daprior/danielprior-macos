export type SystemNotification = {
  id: string;
  appName: string;
  appIcon?: string;
  title: string;
  message: string;
  createdAt: number;
  action?: {
    label: string;
    appId: string;
  };
};

type NotificationState = {
  notifications: SystemNotification[];
};

type NotificationActions = {
  pushNotification: (
    payload: Omit<SystemNotification, "id" | "createdAt">,
  ) => void;
  dismissNotification: (id: string) => void;
};

export type NotificationStore = NotificationState & NotificationActions;
