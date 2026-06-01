import {
  PlayerId,
  Message,
  LastRead,
  ReadUpdate,
} from "@shared/types";

interface Content {
  content: string;
}

export interface ChatClientEvents {
  "chat:sendMessage": (newData: Content) => void;

  "chat:typing:start": () => void;

  "chat:typing:stop": () => void;

  "chat:read": (newData: LastRead) => void;
}

export interface ChatServerEvents {
  "chat:newMessage": (newMessage: Message) => void;

  "chat:typing:start": (newData: PlayerId) => void;

  "chat:typing:stop": (newData: PlayerId) => void;

  "chat:readUpdate": (newData: ReadUpdate) => void;
}
