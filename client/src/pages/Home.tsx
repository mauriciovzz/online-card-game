import { Button, Stack } from "@mantine/core";
import { useNavigate } from "react-router";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <Stack>
      <Button
        onClick={() => {
          void navigate("/game-creation");
        }}
      >
        Create Game
      </Button>
      <Button
        onClick={() => {
          void navigate("/rooms");
        }}
      >
        Join a Game
      </Button>
      <Button
        onClick={() => {
          void navigate("/settings");
        }}
      >
        Settings
      </Button>
    </Stack>
  );
};
