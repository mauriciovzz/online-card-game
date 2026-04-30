import { SocketCallback, UserName } from ".";

export interface UserEvents {
  "user:updateName": (
    { newName }: { newName: string },
    callback: SocketCallback<UserName>
  ) => void;
}

export interface UserResponses {
  "user:connected": ({ name }: { name: string }) => void;
}
