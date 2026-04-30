import { useEffect, useMemo } from "react";

import type { Message } from "@shared/types";

interface Params {
  chatOpened: boolean;
  vpRef: React.RefObject<HTMLDivElement | null>;
  messages: Message[];
  messageRefs: React.RefObject<Map<string, HTMLDivElement>>;
  lastReadTS: number;
  myId?: string;
  emitRead: (timestamp: number) => void;
}

export const useReadObserver = ({
  chatOpened,
  vpRef,
  messages,
  messageRefs,
  lastReadTS,
  myId,
  emitRead,
}: Params) => {
  const messageMap = useMemo(() => {
    const map = new Map<string, Message>();
    messages.forEach((m) => map.set(m.id, m));
    return map;
  }, [messages]);

  // messages observer
  useEffect(() => {
    if (!chatOpened) return;

    const root = vpRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let maxSeen = lastReadTS;

        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const id = entry.target.getAttribute("data-id");
          if (!id) return;

          const msg = messageMap.get(id);
          if (!msg || msg.senderId === myId) return;

          if (msg.createdAt > maxSeen) {
            maxSeen = msg.createdAt;
          }
        });

        if (maxSeen > lastReadTS) {
          emitRead(maxSeen);
        }
      },
      {
        root,
        threshold: 0.5,
      }
    );

    messageRefs.current.forEach((el, id) => {
      const msg = messageMap.get(id);
      if (!msg) return;

      if (msg.createdAt > lastReadTS) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [
    chatOpened,
    emitRead,
    lastReadTS,
    messages,
    messageRefs,
    messageMap,
    myId,
    vpRef,
  ]);
};
