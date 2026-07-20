import { UserName } from "@shared/types";
import { SocketCallback } from "@/types";

export interface UserClientEvents {
  "user:updateName": (
    { newName }: { newName: string },
    callback: SocketCallback<UserName>,
  ) => void;
}

export interface UserServerEvents {
  "user:connected": ({ name }: UserName) => void;
}
