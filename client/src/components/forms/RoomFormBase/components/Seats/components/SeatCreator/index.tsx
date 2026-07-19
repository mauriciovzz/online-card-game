import { useState } from "react";
import { Group, UnstyledButton, isLightColor } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

import { PLAYER_TYPES } from "@/constants";
import { SeatFrame } from "../SeatFrame";

import classes from "./SeatCreator.module.css";

import type { PlayerPos, PlayerType } from "@shared/types";
import { useIsDark } from "@/hooks";

const AddButton = ({ onClick }: { onClick: () => void }) => (
  <UnstyledButton
    w="100%"
    h="100%"
    className={classes.inner}
    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    onClick={onClick}
  >
    <IconPlus size={20} />
  </UnstyledButton>
);

const PlayerTypeButtons = ({
  pos,
  color,
  onSelect,
}: {
  pos: PlayerPos;
  color: string;
  onSelect: (type: PlayerType) => void;
}) => {
  const isDark = useIsDark();

  const iconColor = isLightColor(isDark ? "#242424" : "#f1f3f5")
    ? "#495057"
    : "#b8b8b8";

  const iconHoverColor = pos === 3 ? "black" : "white";

  return (
    <Group gap={0} flex={1}>
      {PLAYER_TYPES.map(({ key, icon: Icon }) => (
        <UnstyledButton
          key={key}
          h={24}
          flex={1}
          bdrs="sm"
          onClick={() => {
            onSelect(key);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "--background-color": color,
            "--icon-color": iconColor,
            "--icon-hover-color": iconHoverColor,
          }}
          className={classes.playerTypeButtom}
        >
          <Icon size={18} />
        </UnstyledButton>
      ))}
    </Group>
  );
};

interface Props {
  pos: PlayerPos;
  autoHuman?: boolean;
  color: string;
  onSelect: (type: PlayerType) => void;
}

export const SeatCreator = ({ pos, autoHuman, color, onSelect }: Props) => {
  const [opened, setOpened] = useState(false);

  const action = {
    corner: autoHuman,
    onClick: () => {
      setOpened(false);
    },
  };

  const onButtonClick = autoHuman
    ? () => {
        onSelect("human");
      }
    : () => {
        setOpened(true);
      };

  return (
    <SeatFrame
      pos={pos}
      color={opened ? color : undefined}
      pad
      action={opened ? action : undefined}
    >
      {!opened ? (
        <AddButton onClick={onButtonClick} />
      ) : (
        <PlayerTypeButtons pos={pos} color={color} onSelect={onSelect} />
      )}
    </SeatFrame>
  );
};
