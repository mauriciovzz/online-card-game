import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Socket } from "socket.io-client";

import type {
  Message,
  SocketRes,
  Typer,
  ReadUpdate,
  PlayerSlot,
} from "@/types";

type RStype = Record<string, number>;
type TStype = Set<string>;
type TTOtype = NodeJS.Timeout | null;

export const useChatState = (
  socket: Socket | null,
  roomPlayers: PlayerSlot[]
) => {
  const [chatOpened, setChatOpened] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [unread, setUnread] = useState(0);

  const [typers, setTypers] = useState<TStype>(new Set());
  const [readState, setReadState] = useState<RStype>({});

  const lastReadRef = useRef(0);
  const typingTimeoutRef = useRef<TTOtype>(null);
  const isTypingRef = useRef(false);

  // new messages ----------
  const handleNewMessage = useCallback(
    (res: SocketRes<Message>) => {
      if (!res.success) return;

      const msg = res.data;
      setMessages((prev) => [...prev, msg]);
      setUnread((prev) => (chatOpened ? prev : prev + 1));

      if (msg.senderId !== socket?.id) {
        setTypers((prev) => {
          const next = new Set(prev);
          next.delete(msg.senderId);
          return next;
        });
      }
    },
    [chatOpened, socket?.id]
  );

  // typing handlers ----------
  const startTyping = () => {
    if (!socket) return;

    if (!isTypingRef.current) {
      socket.emit("chat:typing:start");
      isTypingRef.current = true;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("chat:typing:stop");
      isTypingRef.current = false;
    }, 1500);
  };

  const stopTypingImmediately = () => {
    if (!socket) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isTypingRef.current) {
      socket.emit("chat:typing:stop");
      isTypingRef.current = false;
    }
  };

  const handleTypingStart = useCallback(
    (res: SocketRes<Typer>) => {
      if (!res.success) return;

      setTypers((prev) =>
        new Set(prev).add(res.data.userId)
      );
    },
    []
  );

  const handleTypingStop = useCallback(
    (res: SocketRes<Typer>) => {
      if (!res.success) return;

      setTypers((prev) => {
        const next = new Set(prev);
        next.delete(res.data.userId);
        return next;
      });
    },
    []
  );

  // receips handlers ----------
  const handleReadUpdate = useCallback(
    (res: SocketRes<ReadUpdate>) => {
      if (!res.success) return;

      const { playerId, lastReadCreatedAt } = res.data;

      setReadState((prev) => {
        const current = prev[playerId] ?? 0;
        if (lastReadCreatedAt <= current) return prev;

        return { ...prev, [playerId]: lastReadCreatedAt };
      });
    },
    []
  );

  const emitRead = (timestamp: number) => {
    if (!socket) return;
    if (timestamp <= lastReadRef.current) return;

    lastReadRef.current = timestamp;

    socket.emit("chat:read", {
      lastReadCreatedAt: timestamp,
    });
  };

  // sockets ----------
  useEffect(() => {
    if (!socket) return;

    socket.on("chat:newMessage", handleNewMessage);
    socket.on("chat:typing:start", handleTypingStart);
    socket.on("chat:typing:stop", handleTypingStop);
    socket.on("chat:readUpdate", handleReadUpdate);

    return () => {
      socket.off("chat:newMessage", handleNewMessage);
      socket.off("chat:typing:start", handleTypingStart);
      socket.off("chat:typing:stop", handleTypingStop);
      socket.off("chat:readUpdate", handleReadUpdate);
    };
  }, [
    socket,
    handleNewMessage,
    handleTypingStart,
    handleTypingStop,
    handleReadUpdate,
  ]);

  // send message ---------
  const sendMessage = (content: string) => {
    if (!socket) return;
    socket.emit("chat:sendMessage", { content });
    stopTypingImmediately();
  };

  // message checks ----------
  const messageChecks = useMemo(() => {
    const map = new Map<
      string,
      { playerId: string; isRead: boolean }[]
    >();

    for (const m of messages) {
      const checks = roomPlayers
        .filter((p) => p.id !== m.senderId)
        .filter((p) => p.joinedAt <= m.createdAt)
        .map((p) => {
          const lastRead = readState[p.id];
          return {
            playerId: p.id,
            isRead: lastRead
              ? m.createdAt <= lastRead
              : false,
          };
        });

      map.set(m.id, checks);
    }

    return map;
  }, [messages, readState, roomPlayers]);

  return {
    messages,
    unread,
    chatOpened,
    openChat: () => {
      setUnread(0);
      setChatOpened(true);
    },
    closeChat: () => {
      setChatOpened(false);
    },

    sendMessage,

    typers,
    startTyping,

    emitRead,
    lastReadTS: lastReadRef.current,

    getMessageChecks: (id: string) =>
      messageChecks.get(id) ?? [],
  };
};
