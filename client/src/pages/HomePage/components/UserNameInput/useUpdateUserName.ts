import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";

import { ERROR_METADATA } from "@/constants";
import { useSocket } from "@/contexts/SocketContext";

import type { SocketRes, UserName } from "@shared/types";

export const useUpdateUserName = (onUpdate: () => void) => {
  const { t } = useTranslation();
  const { socketRef, userName, setUserName } = useSocket();

  const form = useForm<UserName>({
    initialValues: { name: userName },

    validate: {
      name: (value) => {
        if (value.length < 1) return t("errors.common.empty");
        if (value.length > 10) return t("errors.name.maxLength");
        return null;
      },
    },
  });

  const updateUserName = ({ name }: UserName) => {
    if (userName.trim() === name.trim()) return;

    socketRef.current?.emit(
      "user:updateName",
      { newName: name },
      (res: SocketRes<UserName>) => {
        if (res.success) {
          setUserName(res.data.name);
          onUpdate();
        } else {
          const meta = ERROR_METADATA[res.error];
          if (!meta.message) return;

          form.setFieldError("name", t(meta.message));
        }
      },
    );
  };

  return { userName, form, updateUserName };
};
