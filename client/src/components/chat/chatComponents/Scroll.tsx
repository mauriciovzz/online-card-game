import { useEffect, useState, type ReactNode, type RefObject } from "react";
import { Flex, ScrollArea } from "@mantine/core";

import { ScrollDownButton } from "./ScrollDownButton";

import type { Message } from "@shared/types";

interface Props {
  vpRef: RefObject<HTMLDivElement | null>;
  height: number;
  isMobile: boolean;
  handleScroll: () => void;
  messages: Message[];
  atBottom: boolean;
  scrollToBottom: () => void;
  children: ReactNode;
}

export const Scroll = ({
  vpRef,
  height,
  isMobile,
  handleScroll,
  messages,
  atBottom,
  scrollToBottom,
  children,
}: Props) => {
  const [lastSeenIndex, setLastSeenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (atBottom) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLastSeenIndex(messages.length - 1);
    }
  }, [atBottom, messages.length]);

  const unread =
    lastSeenIndex === null ? 0 : messages.length - 1 - lastSeenIndex;

  return (
    <ScrollArea
      viewportRef={vpRef}
      h={height}
      type={isMobile ? "never" : "hover"}
      offsetScrollbars={isMobile ? undefined : "y"}
      scrollbars="y"
      scrollbarSize={8}
      onScrollPositionChange={handleScroll}
      pos="relative"
    >
      <Flex mih={height} direction="column" justify="flex-end" gap={3}>
        {children}
      </Flex>

      {!atBottom && (
        <ScrollDownButton
          isMobile={isMobile}
          unread={unread}
          onClick={scrollToBottom}
        />
      )}
    </ScrollArea>
  );
};
