import { SegmentedControl, Stack } from "@mantine/core";

import { ROOM_CAPACITY_OPTIONS } from "@/constants";
import { useIsMobile } from "@/hooks";
import { useUpdateCapacity } from "./useUpdateCapacity";
import { Label } from "@/components";

import type { Room } from "@shared/types";

interface Props {
  room: Room;
}

export const CapacityChanger = ({ room }: Props) => {
  const isMobile = useIsMobile();

  const { capacity, capacityError, onCapacityChange } =
    useUpdateCapacity({ room });

  return (
    <Stack gap={0} w="100%">
      <Label
        text={"room.numPlayers"}
        size="sm"
        error={capacityError}
      />
      <SegmentedControl
        size={isMobile ? "md" : "sm"}
        value={capacity}
        onChange={onCapacityChange}
        data={ROOM_CAPACITY_OPTIONS}
      />
    </Stack>
  );
};
