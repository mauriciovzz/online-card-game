import type { ReactNode } from "react";
import {
  notifications,
  type NotificationData,
} from "@mantine/notifications";
import { useTranslation } from "react-i18next";

const notificationProps: {
  message: ReactNode;
  position: NotificationData["position"];
  autoClose: number;
  withBorder: boolean;
} = {
  message: undefined,
  position: "bottom-center",
  autoClose: 4000,
  withBorder: true,
};

export const useNotification = () => {
  const { t } = useTranslation();

  const onSuccess = (msg: string) => {
    notifications.show({
      title: msg,
      color: "green",
      ...notificationProps,
    });
  };

  const onError = (errorMsg: string) => {
    notifications.show({
      title: t(errorMsg),
      color: "red",
      ...notificationProps,
    });
  };

  return { onSuccess, onError };
};
