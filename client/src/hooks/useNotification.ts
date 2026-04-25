import type { ReactNode } from "react";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";

const notificationProps: {
  message: ReactNode;
  withBorder: boolean;
} = {
  message: undefined,
  withBorder: true,
};

export const useNotification = () => {
  const { t } = useTranslation();

  const successNoti = (msg: string) => {
    notifications.show({
      title: t(msg),
      color: "green",
      ...notificationProps,
    });
  };

  const errorNoti = (error: string) => {
    notifications.show({
      title: t(error),
      color: "red",
      ...notificationProps,
    });
  };

  return { successNoti, errorNoti };
};
