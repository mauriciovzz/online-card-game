import {
  Group,
  Stack,
  Flex,
  Text,
  Box,
} from "@mantine/core";
import dayjs from "dayjs";
import { IconCheck } from "@tabler/icons-react";

import { useRoom } from "@/contexts/RoomContext";

import type { Message } from "@/types";

interface Props {
  message: Message;
  isMine: boolean;
  showUsername: boolean;
  checks: { playerId: string; isRead: boolean }[];
  themeColor: string;
  msgRef: (el: HTMLDivElement | null) => void;
}

export const MessageBubble = ({
  message,
  isMine,
  showUsername,
  checks,
  themeColor,
  msgRef,
}: Props) => {
  const { getPlayerColor } = useRoom();

  return (
    <Group
      ref={msgRef}
      w="100%"
      justify={isMine ? "right" : "left"}
    >
      <Stack
        gap={0}
        maw="80%"
        p={8}
        style={{
          border: `1px solid ${themeColor}`,
          borderRadius: isMine
            ? "8px 8px 0px 8px"
            : "8px 8px 8px 0px",
        }}
      >
        {!isMine && showUsername && (
          <Text
            size="xs"
            c={getPlayerColor(message.senderId)?.string}
            fw={700}
          >
            {message.senderName}
          </Text>
        )}

        <Text
          size="sm"
          style={{
            overflowWrap: "anywhere",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
          }}
        >
          {message.content}
        </Text>

        <Group
          gap={2}
          justify={!isMine ? "flex-start" : "flex-end"}
        >
          <Flex h={15} align="flex-end">
            <Text
              size="10px"
              ta={isMine ? "right" : "left"}
            >
              {dayjs(message.createdAt).format("HH:mm")}
            </Text>
          </Flex>

          {isMine && (
            <Group gap={0}>
              {checks.map(({ playerId, isRead }, i) => (
                <Box
                  key={message.id + playerId}
                  h={15}
                  style={{
                    marginLeft: i === 0 ? 0 : -10,
                    zIndex: i * 10,
                  }}
                >
                  <IconCheck
                    size={15}
                    stroke={1.5}
                    color={
                      isRead
                        ? getPlayerColor(playerId)?.css
                        : themeColor
                    }
                  />
                </Box>
              ))}
            </Group>
          )}
        </Group>
      </Stack>
    </Group>
  );
};
