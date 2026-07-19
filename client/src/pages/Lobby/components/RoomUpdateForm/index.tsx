import { AppButton, RoomFormBase } from "@/components";
import { useUpdateRoom } from "./useUpdateRoom";

import type { Room } from "@shared/types";

interface Props {
  room: Room;
  close: () => void;
}

export const RoomUpdateForm = ({ room }: Props) => {
  const { form, updateRoom } = useUpdateRoom(room);

  return (
    <RoomFormBase
      form={form}
      onSubmit={updateRoom}
      room={room}
      submitButtom={<AppButton type="submit" text={"common.save"} />}
    />
  );
};
