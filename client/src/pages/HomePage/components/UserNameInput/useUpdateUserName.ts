import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";

import { useSocket } from "@/contexts/SocketContext";

import type { SocketRes, UserName } from "@/types";

const ERROR_MAP: Record<string, string> = {
  NAME_EMPTY: "errors.name.empty",
  NAME_MAX_LENGTH: "errors.name.maxLength",
  NAME_TAKEN: "errors.name.taken",
};

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
          form.setFieldError(
            "name",
            t(ERROR_MAP[res.error])
          );
        }
      }
    );
  };

  return { userName, form, updateUserName };
};
