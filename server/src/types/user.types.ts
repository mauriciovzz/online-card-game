import { UserName } from "@shared/types";
import { SocketCallback } from "@/types";

export interface UserEvents {
  "user:updateName": (
    { newName }: { newName: string },
    callback: SocketCallback<UserName>
  ) => void;
}

export interface UserResponses {
  "user:connected": ({ name }: UserName) => void;
}
