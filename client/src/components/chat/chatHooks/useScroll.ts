import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import type { Message } from "@shared/types";

interface Params {
  vpRef: React.RefObject<HTMLDivElement | null>;
  lastReadRef: RefObject<number>;
  messages: Message[];
  messageRefs: RefObject<Map<string, HTMLDivElement>>;
  typers: Set<string>;
  chatOpened: boolean;
  socketId: string | undefined;
  threshold?: number;
}

export const useScroll = ({
  vpRef,
  lastReadRef,
  messages,
  messageRefs,
  typers,
  chatOpened,
  socketId,
  threshold = 150,
}: Params) => {
  const [atBottom, setAtBottom] = useState(true);

  const atBottomRef = useRef(atBottom);

  useEffect(() => {
    atBottomRef.current = atBottom;
  }, [atBottom]);

  // track scroll position -----------
  const handleScroll = () => {
    if (!chatOpened) return;

    const el = vpRef.current;
    if (!el) return;

    const { scrollHeight, clientHeight, scrollTop } = el;

    setAtBottom(scrollHeight - clientHeight <= scrollTop + threshold);
  };

  // scroll helpers -----------
  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      const el = vpRef.current;
      if (!el) return;

      el.scrollTo({ top: el.scrollHeight, behavior });
    },
    [vpRef],
  );

  const centerElement = useCallback(
    (el: HTMLElement) => {
      const container = vpRef.current;
      if (!container) return;

      const containerHeight = container.clientHeight;
      const offsetTop = el.offsetTop;
      const elHeight = el.offsetHeight;

      const top = offsetTop - containerHeight / 2 + elHeight / 2;

      container.scrollTo({ top, behavior: "auto" });
    },
    [vpRef],
  );

  // positioning on open -----------
  const [firstUnreadIndex, setFirstUnreadIndex] = useState<number | null>(null);

  const hadMessagesOnOpenRef = useRef(false);
  const hasInitializedRef = useRef(false);

  // captute state at open
  useEffect(() => {
    if (chatOpened && !hasInitializedRef.current) {
      hadMessagesOnOpenRef.current = messages.length > 0;
    }
  }, [chatOpened, messages.length]);

  // position on open
  useEffect(() => {
    if (!chatOpened) return;
    if (hasInitializedRef.current) return;

    if (!hadMessagesOnOpenRef.current) {
      hasInitializedRef.current = true;
      setFirstUnreadIndex(null);
      return;
    }

    if (!messages.length) return;

    setTimeout(() => {
      if (!hadMessagesOnOpenRef.current) {
        scrollToBottom("auto");
        hasInitializedRef.current = true;
        return;
      }

      const index = messages.findIndex(
        (m) => m.createdAt > lastReadRef.current && m.senderId !== socketId,
      );

      const finalIndex = index === -1 ? null : index;
      setFirstUnreadIndex(finalIndex);

      if (finalIndex === null) {
        scrollToBottom("auto");
      } else {
        const msg = messages[index];
        const el = messageRefs.current.get(msg.id);

        if (el) {
          centerElement(el);
        }
      }

      hasInitializedRef.current = true;
    }, 0);
  }, [
    chatOpened,
    messages,
    messageRefs,
    centerElement,
    scrollToBottom,
    socketId,
    lastReadRef,
  ]);

  // Reset on close
  useEffect(() => {
    if (!chatOpened) {
      hasInitializedRef.current = false;
      hadMessagesOnOpenRef.current = false;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFirstUnreadIndex(null);
    }
  }, [chatOpened]);

  // handle auto scroll to bottom -----------

  useEffect(() => {
    if (!chatOpened) return;
    if (messages.length === 0) return;
    if (!hasInitializedRef.current) return;

    const lastMsg = messages[messages.length - 1];
    const isMine = lastMsg.senderId === socketId;

    if (isMine || atBottomRef.current) {
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
  }, [messages, typers, socketId, scrollToBottom, chatOpened]);

  return { atBottom, scrollToBottom, handleScroll, firstUnreadIndex };
};
