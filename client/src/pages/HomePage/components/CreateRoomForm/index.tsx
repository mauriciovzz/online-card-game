import { AppButton, RoomFormBase } from "@/components";
import { useCreateRoom } from "./useCreateRoom";

export const CreateRoomForm = () => {
  const { form, createRoom } = useCreateRoom();

  return (
    <RoomFormBase
      form={form}
      onSubmit={createRoom}
      showSeats
      submitButtom={<AppButton type="submit" text={"room.create"} />}
    />
  );
};
