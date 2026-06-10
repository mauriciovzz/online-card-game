import { useCreateRoom } from "./useCreateRoom";
import { AppButton, RoomForm } from "@/components";
import { RoomMembers } from "./RoomMembers";

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
        capacityComponent={<RoomMembers form={form} />}
      />

      <AppButton
        type="submit"
        text={"room.create"}
        disabled={!form.values.name.trim()}
      />
    </form>
  );
};
