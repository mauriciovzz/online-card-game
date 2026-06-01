import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";

import { ERRORS_MAP } from "@/constants";
import { useSocket } from "@/contexts/SocketContext";

import type { SocketRes, UserName } from "@shared/types";

export const useUpdateUserName = (onUpdate: () => void) => {
  const { t } = useTranslation();
  const { socket, userName, setUserName } = useSocket();

  const form = useForm<UserName>({
    initialValues: {
      name: userName,
    },

    validate: {
      name: (value) => {
        if (value.length < 1)
          return t("errors.common.empty");
        if (value.length > 10)
          return t("errors.name.maxLength");
        return null;
      },
    },
  });

  const updateUserName = ({ name }: UserName) => {
    if (userName.trim() === name.trim()) return;

    socket?.emit(
      "user:updateName",
      { newName: name },
      (res: SocketRes<UserName>) => {
        if (res.success) {
          setUserName(res.data.name);
          onUpdate();
        } else {
          const errorMsg = ERRORS_MAP[res.error];
          form.setFieldError("name", t(errorMsg));
        }
      }
    );
  };

  return { userName, form, updateUserName };
};
