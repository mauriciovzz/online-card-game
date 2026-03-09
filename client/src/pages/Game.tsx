import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useSocket } from "../contexts/SocketContext";
import {
  Button,
  Box,
  Flex,
  Group,
  Divider,
} from "@mantine/core";
import { Chat } from "../components/Chat";
import { useRoom } from "../contexts/RoomContext";
import type { GameState } from "../types/types";
import { ChatButton } from "../components/chatButton";

interface Turn {
  currentPlayerId: string;
  turnStartedAt: Date | null;
  hasDrawnCard: boolean;
}

export const Game = () => {
  const { roomId } = useParams();
  const { socket } = useSocket();
  const {
    room,
    messages,
    unreadMessages,
    chatOpened,
    openChat,
    closeChat,
    sendMessage,
  } = useRoom();

  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const [gameState, setGameState] =
    useState<GameState | null>(null);
  const [turn, setTurn] = useState<Turn | null>(null);
  const [isMyTurn, setIsMyTurn] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const startLocalCountDown = (duration: number) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      const end = Date.now() + duration;

      intervalRef.current = window.setInterval(() => {
        const remaining = Math.max(0, end - Date.now());
        setCountdown(Math.ceil(remaining / 1000));

        if (remaining <= 0 && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }, 200);
    };

    socket.emit("game:getState", { roomId });

    const handleUpdatedState = (
      newGameState: GameState
    ) => {
      setGameState(newGameState);
    };

    const handleTurnStart = (newTurnData: Turn) => {
      console.log(
        "turn started for: ",
        newTurnData.currentPlayerId
      );

      setTurn(newTurnData);

      if (socket.id === newTurnData.currentPlayerId) {
        setIsMyTurn(true);
      } else {
        setIsMyTurn(false);
      }

      startLocalCountDown(30000);
    };

    const handleTimeout = ({
      playerId,
    }: {
      playerId: string;
    }) => {
      console.log("turn finished for:", playerId);
    };

    socket.on("game:updatedState", handleUpdatedState);

    socket.on("game:turnStart", handleTurnStart);
    socket.on("game:playerTimeout", handleTimeout);
    return () => {
      socket.off("game:updatedState", handleUpdatedState);

      socket.off("game:turnStart", handleTurnStart);
      socket.off("game:playerTimeout", handleTimeout);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [roomId, socket]);

  const endTurn = () => {
    if (!socket) return;

    socket.emit("game:endTurn", { roomId });
  };

  return (
    <Flex direction="column" h="100vh">
      <Box h={50}>{room.name}</Box>

      <Divider />

      <Box flex={1}>
        {countdown}
        {" - "}
        {isMyTurn ? "is your turn!" : "is not your turn!"}

        <Box>
          {gameState?.myCards.map((card) => `${card} - `)}
        </Box>

        <Box flex={1} bg="blue">
          <ChatButton
            unreadMessages={unreadMessages}
            onClick={openChat}
          />
        </Box>

        <Box flex={1} bg="red">
          <Button disabled={!isMyTurn} onClick={endTurn}>
            end turn
          </Button>
        </Box>

        <Chat
          opened={chatOpened}
          close={closeChat}
          messages={messages}
          sendMessage={sendMessage}
        />
      </Box>

      <Divider />

      <Group p="sm">
        <Flex
          w="30"
          bdrs="md"
          bd="1px solid red"
          justify="center"
        >
          {countdown}
        </Flex>

        <Flex
          w={134}
          bdrs="md"
          bd="1px solid red"
          justify="center"
        >
          {`${room.players.find((p) => p.id === turn?.currentPlayerId)?.name ?? "Unknown"}'s turn`}
        </Flex>
      </Group>
    </Flex>
  );
};
