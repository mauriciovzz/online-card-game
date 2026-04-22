import { useSocket } from "@/contexts/SocketContext";

import type { SocketRes, UserName } from "@/types";

export const useUpdateUserName = (
  onFormSuccess: () => void,
  onFormError: (errorName: string) => void
) => {
  const { socket, setUserName } = useSocket();

  const updateUserName = (name: string) => {
    socket?.emit(
      "user:updateName",
      { newName: name },
      (res: SocketRes<UserName>) => {
        if (res.success) {
          setUserName(res.data.name);
          onFormSuccess();
        } else {
          onFormError(res.error);
        }
      }
    );
  };

  return { updateUserName };
};
