import { useCallback, useEffect } from "react";

import { useSocket } from "@/contexts/SocketContext";

import type { SocketRes, UserName } from "@/types";

export const useUpdateUserName = (
  onFormSuccess: () => void,
  onFormError: (erroName: string) => void
) => {
  const { socket, setUserName } = useSocket();

  const handleNameUpdated = useCallback(
    (res: SocketRes<UserName>) => {
      if (res.success) {
        setUserName(res.data.name);
        onFormSuccess();
      } else {
        onFormError(res.error);
      }
    },
    [onFormError, onFormSuccess, setUserName]
  );

  useEffect(() => {
    if (!socket) return;

    socket.on("user:nameUpdated", handleNameUpdated);

    return () => {
      socket.off("user:nameUpdated", handleNameUpdated);
    };
  }, [
    socket,
    setUserName,
    onFormSuccess,
    onFormError,
    handleNameUpdated,
  ]);

  const updateUserName = (name: string) => {
    socket?.emit("user:updateName", { newName: name });
  };

  return { updateUserName };
};
