import { Message, PlayerId } from ".";

interface Content {
  content: string;
}

export interface LastRead {
  lastReadCreatedAt: number;
}

export interface ReadUpdate extends PlayerId {
  lastReadCreatedAt: number;
}

export interface ChatEvents {
  "chat:sendMessage": (newData: Content) => void;

  "chat:typing:start": () => void;

  "chat:typing:stop": () => void;

  "chat:read": (newData: LastRead) => void;
}

export interface ChatResponses {
  "chat:newMessage": (newMessage: Message) => void;

  "chat:typing:start": (newData: PlayerId) => void;

  "chat:typing:stop": (newData: PlayerId) => void;

  "chat:readUpdate": (newData: ReadUpdate) => void;
}
