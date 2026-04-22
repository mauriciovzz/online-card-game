import { Flex } from "@mantine/core";
import { useTranslation } from "react-i18next";

import { useJoinRoom } from "@/hooks/useJoinRoom";
import { DeactivatableBox, Spinner } from "@/components";
import { RoomsListItem } from "./RoomListItem";

interface RoomListProps {
  disabled: boolean;
}

export const RoomList = ({ disabled }: RoomListProps) => {
  const { t } = useTranslation();

  const { isLoading, rooms, joinRoom } = useJoinRoom();
  const noRooms = rooms.length === 0;

  return (
    <DeactivatableBox disabled={disabled}>
      {isLoading ? (
        <Spinner />
      ) : noRooms ? (
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
          <RoomsListItem
            key={room.id}
            room={room}
            joinRoom={joinRoom}
          />
        ))
      )}
    </DeactivatableBox>
  );
};
