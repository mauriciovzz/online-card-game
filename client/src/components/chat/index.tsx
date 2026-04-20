import { useMemo, useRef } from "react";
import {
  TextInput,
  Stack,
  Divider,
  Flex,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";

import { useChat } from "@/contexts/ChatContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useReadObserver } from "@/hooks/useReadObserver";
import { useScroll } from "@/hooks/useScroll";
import { useIsDark } from "@/hooks/useIsDark";
import { useScrollHeight } from "@/hooks/useScrollHeight";
import { AppBox } from "@/components";
import { Scroll } from "./components/Scroll";
import { MessageBubble } from "./components/MessageBubble";
import { TypingIndicator } from "./components/TypingIndicator";

type MsgsRef = Map<string, HTMLDivElement>;

export const Chat = () => {
  const { t } = useTranslation();

  const isMobile = useIsMobile();
  const themeColor = useThemeColor();
  const isDark = useIsDark();

  const { top, outerHeight, innerHeight } = useScrollHeight(
    { isMobile }
  );

  const {
    chatOpened,
    messages,
    sendMessage,
    startTyping,
    typers,
    emitRead,
    getMessageChecks,
    lastReadTS,
    myId,
  } = useChat();

  // input
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    initialValues: { newMessage: "" },
  });

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      const value = form.values.newMessage.trim();
      if (!value) return;

      sendMessage(value);
      form.setFieldValue("newMessage", "");
      inputRef.current?.focus();
    } else {
      startTyping();
    }
  };

  // hooks
  const vpRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<MsgsRef>(new Map());

  const showUsernameMap = useMemo(() => {
    return messages.map(
      (m, i) =>
        i === 0 || m.senderId !== messages[i - 1].senderId
    );
  }, [messages]);

  const {
    atBottom,
    scrollToBottom,
    handleScroll,
    firstUnreadIndex,
  } = useScroll({
    vpRef,
    lastReadTS,
    messages,
    messageRefs,
    typers,
    chatOpened,
    myId,
  });

  useReadObserver({
    chatOpened,
    vpRef,
    messages,
    messageRefs,
    lastReadTS,
    myId,
    emitRead,
  });

  return (
    <AppBox
      borderColor={themeColor}
      w="100%"
      h={outerHeight}
      bg={isDark ? "dark.7" : "white"}
      style={{
        top,
        visibility: chatOpened ? "visible" : "hidden",
        position: "absolute",
        pointerEvents: chatOpened ? "auto" : "none",
      }}
    >
      <Stack w="100%" gap={5} p="sm">
        <Scroll
          vpRef={vpRef}
          height={innerHeight}
          isMobile={isMobile}
          handleScroll={handleScroll}
          messages={messages}
          atBottom={atBottom}
          scrollToBottom={scrollToBottom}
        >
          <Flex justify="center" align="center">
            <Text
              size="xs"
              ta="center"
              p={2}
              px={10}
              bd={`1px solid ${themeColor}`}
              bdrs="md"
            >
              {t("chat.start")}
            </Text>
          </Flex>

          {messages.map((msg, i) => {
            const isFirstUnread = i === firstUnreadIndex;

            return (
              <div key={msg.id}>
                {isFirstUnread && (
                  <Divider
                    size="xs"
                    label={t("chat.newMessages")}
                    labelPosition="center"
                  />
                )}

                <MessageBubble
                  message={msg}
                  isMine={msg.senderId === myId}
                  showUsername={
                    isFirstUnread
                      ? true
                      : showUsernameMap[i]
                  }
                  checks={getMessageChecks(msg.id)}
                  themeColor={themeColor}
                  msgRef={(el) => {
                    if (el) {
                      el.setAttribute("data-id", msg.id);
                      messageRefs.current.set(msg.id, el);
                    } else {
                      messageRefs.current.delete(msg.id);
                    }
                  }}
                />
              </div>
            );
          })}

          {typers.size !== 0 && (
            <TypingIndicator
              typers={typers}
              themeColor={themeColor}
            />
          )}
        </Scroll>

        <form>
          <TextInput
            ref={inputRef}
            size={isMobile ? "md" : "sm"}
            mr={isMobile ? undefined : 8}
            radius="md"
            {...form.getInputProps("newMessage")}
            onKeyDown={handleKeyDown}
          />
        </form>
      </Stack>
    </AppBox>
  );
};
