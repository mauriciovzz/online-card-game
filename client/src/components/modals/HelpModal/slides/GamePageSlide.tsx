import { Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";

import {
  SlideTitle,
  SlideParagraph,
  SlideSubTitle,
  SlideList,
} from "../components";

export const GamePageSlide = () => {
  const { t } = useTranslation();

  return (
    <>
      <SlideTitle text={t("help.game.heading")} />

      <Stack gap={3}>
        <SlideSubTitle text={t("help.game.seatsTitle")} />
        <SlideParagraph text={t("help.game.seatsDesc")} />
        <SlideList
          items={
            t("help.game.seatsCriteria", {
              returnObjects: true,
            }) as string[]
          }
        />
        <SlideParagraph text={t("help.game.turn")} />
      </Stack>

      <Stack gap={3}>
        <SlideSubTitle text={t("help.game.pileTitle")} />
        <SlideParagraph text={t("help.game.pileDesc")} />
        <SlideList
          items={
            t("help.game.pileCriteria", {
              returnObjects: true,
            }) as string[]
          }
        />
      </Stack>

      <Stack gap={3}>
        <SlideSubTitle text={t("help.game.playTitle")} />
        <SlideParagraph text={t("help.game.playDesc")} />
        <SlideParagraph text={t("help.game.borderDesc")} />
      </Stack>
    </>
  );
};
