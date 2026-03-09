import { useNavigate, useParams } from "react-router";
import { useSocket } from "../../contexts/SocketContext";
import {
  Button,
  Group,
  CloseButton,
  Box,
  SimpleGrid,
} from "@mantine/core";
import { InputLabel } from "../../components/InputLabel";
import { PageLayout } from "../../layouts/PageLayout";
import { Chat } from "../../components/Chat";
import { useRoom } from "../../contexts/RoomContext";
import { ChatButton } from "../../components/chatButton";
import LobbySlot from "./RoomSlot";

export const Lobby = () => {
  const { roomId } = useParams();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const {
    room,
    messages,
    unreadMessages,
    chatOpened,
    openChat,
    closeChat,
    sendMessage,
  } = useRoom();

  const { name, capacity, players } = room;

  const leaveRoomLobby = () => {
    if (!socket) return;

    socket.emit("room:leave", { roomId });
    void navigate("/rooms");
  };

  const startGame = () => {
    if (!socket) return;

    socket.emit("room:startGame", { roomId });
  };

  const isAdmin = room.adminId === socket?.id;

  if (!socket) return;

  return (
    <PageLayout>
      <Group justify="space-between">
        {name}
        <CloseButton onClick={leaveRoomLobby} />
      </Group>

      <Box>
        <InputLabel text="Players" />
        <SimpleGrid cols={2} spacing="xs">
          {[1, 2, 3, 4].map((key) => (
            <LobbySlot
              key={key}
              index={key - 1}
              availableSlot={key <= Number(capacity)}
              player={players.find((p) => p.pos === key)}
            />
          ))}
        </SimpleGrid>
      </Box>

      <Box>
        <InputLabel text="Rules" />
        <Group grow gap="xs">
          <Button>Mirror</Button>
          <Button>Stair</Button>
          <Button>Stack</Button>
        </Group>
      </Box>

      <Box flex={1}>
        <Group justify="right">
          <ChatButton
            unreadMessages={unreadMessages}
            onClick={openChat}
          />
        </Group>
      </Box>

      <Chat
        opened={chatOpened}
        close={closeChat}
        messages={messages}
        sendMessage={sendMessage}
        currentPlayerId={socket.id ?? ""}
      />

      {isAdmin && (
        <Button
          disabled={room.players.length < 2}
          onClick={startGame}
        >
          Start game
        </Button>
      )}
    </PageLayout>
  );
};
