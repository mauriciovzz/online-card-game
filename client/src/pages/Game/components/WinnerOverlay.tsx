import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Overlay, Paper, Text, Title } from "@mantine/core";
import { IconTrophyFilled } from "@tabler/icons-react";

import type { FinishedGameInfo } from "@shared/types";

interface Props {
  winner: FinishedGameInfo["winner"];
  clientId?: string;
  onFinished: () => void;
}

export const WinnerOverlay = ({
  winner,
  clientId,
  onFinished,
}: Props) => {
  const { t } = useTranslation();

  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onFinished();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onFinished]);

  if (!winner) return null;

  const clientWon = winner.id === clientId;

  return (
    <Overlay
      fixed={false}
      zIndex={1000}
      backgroundOpacity={0}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        h="100%"
        w="100%"
        withBorder
        p="sm"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <IconTrophyFilled size={32} />

        <Text size="lg" fw={700}>
          {clientWon
            ? t("game.clientWon")
            : t("game.someoneWon", {
                name: winner.name,
              })}
        </Text>

        <Text size="lg" fw={700}>
          +{winner.score} {t("game.points")}
        </Text>

        <Text c="dimmed">{t("game.returningLobby")}</Text>

        <Title order={2}>{seconds}</Title>
      </Paper>
    </Overlay>
  );
};
