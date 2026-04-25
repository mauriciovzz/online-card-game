import { ROOM_CAPACITY_OPTIONS } from "@/constants";
import { useCreateRoom } from "./useCreateRoom";
import {
  AppButton,
  FormSegmentedControl,
  RoomForm,
} from "@/components";

export const CreateRoom = () => {
  const { form, createRoom } = useCreateRoom();

  return (
    <form
      onSubmit={form.onSubmit(createRoom)}
      style={{
        height: "100%",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <RoomForm
        form={form}
        capacityComponent={
          <FormSegmentedControl
            label={"room.numPlayers"}
            data={ROOM_CAPACITY_OPTIONS}
            form={form}
            formKey="capacity"
          />
        }
      />

      <AppButton
        type="submit"
        text={"room.create"}
        disabled={!form.values.name.trim()}
      />
    </form>
  );
};
