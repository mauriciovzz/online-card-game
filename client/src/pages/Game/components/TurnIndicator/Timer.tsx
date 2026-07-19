import { useState, useEffect } from "react";
import { Flex } from "@mantine/core";

interface Props {
  size: number;
  turnStart: number;
  turnDuration: string;
}

export const Timer = ({ size, turnStart, turnDuration }: Props) => {
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const duration = Number(turnDuration) * 1000;
    const end = turnStart + duration;
    const offset = turnStart - Date.now();

    const update = () => {
      const serverNow = Date.now() + offset;

      const remaining = Math.max(0, end - serverNow);

      setCountdown(Math.ceil(remaining / 1000));
    };

    update();

    const id = window.setInterval(update, 200);

    return () => {
      clearInterval(id);
    };
  }, [turnStart, turnDuration]);

  return (
    <Flex w={size} h={20} align="center" justify="center">
      {countdown}
    </Flex>
  );
};
