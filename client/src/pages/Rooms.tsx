import {
  CloseButton,
  Group,
  Paper,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useSocket } from "../contexts/SocketContext";
import { useColorScheme } from "../hooks/useColorScheme";
import { useNavigate } from "react-router";
import { PageLayout } from "../layouts/PageLayout";
import type { ShortRoomInfo } from "../types/types";

export const Rooms = () => {
  const { socket } = useSocket();
  const navigate = useNavigate();
  const { themeBorderColor } = useColorScheme();

  const [rooms, setRooms] = useState<ShortRoomInfo[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("room:getList");

    const handleList = ({
      availableRooms,
    }: {
      availableRooms: ShortRoomInfo[];
    }) => {
      setRooms(availableRooms);
    };

    const handleJoined = ({
      success,
      response,
    }: {
      success: boolean;
      response: string;
    }) => {
      if (success) {
        void navigate(`/room/${response}/lobby`);
      } else {
        console.log(response);
      }
    };

    socket.on("room:list", handleList);
    socket.on("room:joined", handleJoined);

    return () => {
      socket.off("room:list", handleList);
      socket.off("room:joined", handleJoined);
    };
  }, [navigate, socket]);

  const joinRoom = (roomId: string) => {
    if (socket) {
      socket.emit("room:join", { roomId });
    }
  };

  return (
    <PageLayout>
      <Group justify="space-between">
        Join a room
        <CloseButton onClick={() => void navigate("/")} />
      </Group>
      {rooms.map((room) => (
        <UnstyledButton
          key={room.roomId}
          onClick={() => {
            joinRoom(room.roomId);
          }}
        >
          <Paper
            key={room.roomName}
            p="xs"
            bd={`1px solid ${themeBorderColor}`}
            bdrs="lg"
          >
            <Group justify="between">
              <Text>{room.roomName}</Text>
              <Text>
                {room.numPlayers}/{room.capacity}
              </Text>
              <Text>
                {room.rules.useMirror && "mirror"} -{" "}
                {room.rules.useStair && "stair"}
              </Text>
            </Group>
          </Paper>
        </UnstyledButton>
      ))}
    </PageLayout>
  );
};
