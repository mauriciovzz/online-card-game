import { useEffect } from "react";

import { useSocket } from "@/contexts/SocketContext";

import type { SocketRes, UserName } from "@/types";

export const useUpdateUserName = (
  onFormSuccess: () => void,
  onFormError: (erroName: string) => void
) => {
  const { socket, setUserName } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleNameUpdated = (
      res: SocketRes<UserName>
    ) => {
      if (res.success) {
        setUserName(res.data.name);
        onFormSuccess();
      } else {
        onFormError(res.error);
      }
    };

    socket.on("user:nameUpdated", handleNameUpdated);

    return () => {
      socket.off("user:nameUpdated", handleNameUpdated);
    };
  }, [socket, setUserName, onFormSuccess, onFormError]);
};
