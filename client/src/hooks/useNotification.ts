import type { ReactNode } from "react";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import type {
  CutInfo,
  EffectInfo,
  NotificationInfo,
} from "@shared/types";
import { GAME_COLORS } from "@/constants";

const getPlayerColor = (pos: number) =>
  GAME_COLORS[pos - 1].hex;

const notificationProps: {
  message: ReactNode;
  withBorder: boolean;
  autoClose: number;
} = {
  message: undefined,
  withBorder: true,
  autoClose: 2000,
};

export const useNotification = () => {
  const { t } = useTranslation();

  const showNoti = ({
    msg,
    color,
    props,
  }: {
    msg: string;
    color?: string;
    props?: Record<string, unknown>;
  }) => {
    notifications.clean();

    notifications.show({
      title: t(msg, props),
      color,
      ...notificationProps,
    });
  };

  const successNoti = (msg: string) => {
    showNoti({ msg, color: "green" });
  };

  const errorNoti = (msg: string) => {
    showNoti({ msg, color: "red" });
  };

  const effectNoti = (data: EffectInfo) => {
    const isSkip = data.type === "SKIP";

    showNoti({
      msg: isSkip ? "game.skipEffect" : "game.drawEffect",
      props: isSkip ? undefined : { cards: data.cards },
      color: getPlayerColor(data.pos),
    });
  };

  const cutNoti = ({ name, pos }: NotificationInfo) => {
    showNoti({
      msg: "game.cutter",
      props: { name },
      color: getPlayerColor(pos),
    });
  };

  const cuttedNoti = (playerId: string, data: CutInfo) => {
    if (playerId === data.cuttedId) {
      showNoti({
        msg: "game.cutted",
        props: { name: data.cutterName },
        color: getPlayerColor(data.cutterPos),
      });
      return;
    }

    showNoti({
      msg: "game.cut",
      props: {
        cutter: data.cutterName,
        cutted: data.cuttedName,
      },
      color: getPlayerColor(data.cuttedPos),
    });
  };

  const unoNoti = (
    iCalled: boolean,
    { name, pos }: NotificationInfo
  ) => {
    showNoti({
      msg: iCalled ? "game.calledUno" : "game.unoCalled",
      props: { name },
      color: getPlayerColor(pos),
    });
  };

  const timeoutNoti = (hadToDraw: boolean) => {
    showNoti({
      msg: hadToDraw
        ? "game.timeoutWithCard"
        : "game.timeout",
      color: "black",
    });
  };

  const quitNoti = (name: string) => {
    showNoti({
      msg: "game.playerQuit",
      props: { name },
      color: "black",
    });
  };

  return {
    successNoti,
    errorNoti,
    effectNoti,
    cutNoti,
    cuttedNoti,
    unoNoti,
    timeoutNoti,
    quitNoti,
  };
};
