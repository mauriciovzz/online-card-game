import { useRoom } from "@/contexts/RoomContext";
import { Game } from "./Game";
import { Lobby } from "./Lobby";

export const Room = () => {
  const { roomView } = useRoom();

  switch (roomView) {
    case "lobby":
      return <Lobby />;
    case "game":
      return <Game />;
  }
};
