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
import type {
  AvailableRooms,
  Room,
  RoomId,
  SocketRes,
} from "../types/types";

export const Rooms = () => {
  const { socket } = useSocket();
  const navigate = useNavigate();
  const { themeBorderColor } = useColorScheme();

  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("room:getAvailable");

    const handleNewList = (
      res: SocketRes<AvailableRooms>
    ) => {
      if (res.success) {
        setRooms(res.data.availableRooms);
      }
    };

    const handleJoined = (res: SocketRes<RoomId>) => {
      if (res.success) {
        void navigate(`/room/${res.data.roomId}/lobby`);
      } else {
        console.log(res.error);
      }
    };

    socket.on("room:list", handleNewList);
    socket.on("room:joined", handleJoined);

    return () => {
      socket.off("room:list", handleNewList);
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
          key={room.id}
          onClick={() => {
            joinRoom(room.id);
          }}
        >
          <Paper
            key={room.name}
            p="xs"
            bd={`1px solid ${themeBorderColor}`}
            bdrs="lg"
          >
            <Group justify="between">
              <Text>{room.name}</Text>
              <Text>
                {room.players.length}/{room.capacity}
              </Text>
              <Text>
                {room.rules.mirror && "mirror"} -{" "}
                {room.rules.stair && "stair"} -{" "}
                {room.rules.stack && "stack"}
              </Text>
            </Group>
          </Paper>
        </UnstyledButton>
      ))}
    </PageLayout>
  );
};
