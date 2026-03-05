import { useNavigate, useParams } from "react-router";
import { useSocket } from "../../contexts/SocketContext";
import {
  Button,
  Group,
  CloseButton,
  Grid,
  Box,
} from "@mantine/core";
import { InputLabel } from "../../components/InputLabel";
import { PageLayout } from "../../layouts/PageLayout";
import { Chat } from "../../components/Chat";
import { useGame } from "../../contexts/GameContext";
import { PlayerSlotBox } from "./PlayerSlotBox";
import { ChatButton } from "../../components/chatButton";

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
  } = useGame();

  const leaveRoomLobby = () => {
    if (!socket) return;

    socket.emit("room:leave", { roomId });
    void navigate("/rooms");
  };

  const startGame = () => {
    if (!socket) return;

    socket.emit("room:startGame", { roomId });
  };

  const isAdmin = room.roomAdmin === socket?.id;

  if (!socket) return;

  return (
    <PageLayout>
      <Group justify="space-between">
        {room.roomName}
        <CloseButton onClick={leaveRoomLobby} />
      </Group>

      <Box>
        <InputLabel text="Players" />
        <Grid w="100%" gutter="xs" columns={2}>
          {Array.from({ length: 4 }, (_, index) => (
            <Grid.Col key={index} span={1}>
              <PlayerSlotBox
                index={index}
                player={room.players[index]}
                capacity={room.capacity}
              />
            </Grid.Col>
          ))}
        </Grid>
      </Box>

      <Box>
        <InputLabel text="Rules" />
        <Group>
          <Button flex={1}>Mirror</Button>
          <Button flex={1}>Stair</Button>
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
