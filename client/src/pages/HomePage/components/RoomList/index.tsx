import { Flex } from "@mantine/core";
import { useTranslation } from "react-i18next";

import { useRooms } from "@/hooks/useRooms";
import { LabeledBox, Spinner } from "@/components";
import { RoomsListItem } from "./RoomListItem";

interface RoomListProps {
  disabled: boolean;
}

export const RoomList = ({ disabled }: RoomListProps) => {
  const { t } = useTranslation();

  const { isLoading, rooms, joinRoom } = useRooms();
  const noRooms = rooms.length === 0;

  return (
    <LabeledBox
      text={t("joinMatch")}
      disabledText={t("finishUpdatingName")}
      disabled={disabled}
    >
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
          {t("noMatches")}
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
    </LabeledBox>
  );
};
