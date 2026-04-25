import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Flex } from "@mantine/core";

import { useSocket } from "@/contexts/SocketContext";
import { useJoinRoom } from "./useJoinRoom";
import { RoomButton } from "./RoomListItem";

export const RoomList = () => {
  const { t } = useTranslation();

  const { rooms, fetchRooms } = useSocket();
  const { joinRoom } = useJoinRoom();

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return rooms.length === 0 ? (
    <Flex
      w="100%"
      h="100%"
      align="center"
      justify="center"
      fw={700}
    >
      {t("room.empty")}
    </Flex>
  ) : (
    rooms.map((room) => (
      <RoomButton
        key={room.id}
        room={room}
        joinRoom={() => joinRoom(room.id)}
      />
    ))
  );
};
