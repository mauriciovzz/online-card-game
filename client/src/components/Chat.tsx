import { useEffect, useRef } from "react";
import {
  ActionIcon,
  Modal,
  ScrollArea,
  TextInput,
  Group,
  Box,
  Stack,
  Text,
  Divider,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconSend2 } from "@tabler/icons-react";

import type { Message } from "@/types";

interface ChatProps {
  opened: boolean;
  close: () => void;
  messages: Message[];
  sendMessage: (message: string) => void;
  currentPlayerId: string;
}

export const Chat = ({
  opened,
  close,
  messages,
  sendMessage,
  currentPlayerId,
}: ChatProps) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef(true);

  const BOTTOM_THRESHOLD = 150;

  const handleScroll = () => {
    const el = viewportRef.current;
    if (!el) return;

    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;

    shouldAutoScrollRef.current =
      distanceFromBottom < BOTTOM_THRESHOLD;
  };

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    if (shouldAutoScrollRef.current) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    if (!opened) return;

    const timer = setTimeout(() => {
      const el = viewportRef.current;
      if (!el) return;

      el.scrollTo({
        top: el.scrollHeight,
        behavior: "auto",
      });
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [opened]);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      newMessage: "",
    },
  });

  const handleSendMessage = (newMessage: string) => {
    const content = newMessage.trim();

    if (content) {
      sendMessage(content);
      form.setValues({ newMessage: "" });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Messages"
      w={600}
    >
      <Stack gap={5}>
        <Divider />

        <ScrollArea
          h={300}
          type="hover"
          viewportRef={viewportRef}
          onScrollPositionChange={handleScroll}
        >
          <Stack gap={3}>
            {messages.map((m, i) => {
              const isMine = m.playerId === currentPlayerId;
              const isPrevMine =
                i === 0
                  ? isMine
                  : messages[i - 1].playerId ===
                    messages[i].playerId;

              return (
                <Stack
                  key={`${m.playerId}-${String(m.date)}`}
                  gap={0}
                >
                  {!isMine && !isPrevMine && (
                    <Text size="xs" c={m.color} fw={700}>
                      {m.userName}
                    </Text>
                  )}
                  <Group
                    w="100%"
                    justify={isMine ? "right" : "left"}
                  >
                    <Box
                      bd={`1px solid ${m.color}`}
                      bdrs="md"
                      p="xs"
                      maw="66%"
                    >
                      <Text size="sm">{m.message}</Text>
                      {/* <Text size="xs">
                        {dayjs(m.date).format("hh:mm a")}
                      </Text> */}
                    </Box>
                  </Group>
                </Stack>
              );
            })}
          </Stack>
        </ScrollArea>

        <Divider />

        <form
          onSubmit={form.onSubmit((values) => {
            handleSendMessage(values.newMessage);
          })}
        >
          <TextInput
            key={form.key("newMessage")}
            {...form.getInputProps("newMessage")}
            rightSection={
              <ActionIcon type="submit">
                <IconSend2 />
              </ActionIcon>
            }
          />
        </form>
      </Stack>
    </Modal>
  );
};
