import { Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";

import { SlideTitle, SlideParagraph, SlideSubTitle } from "../components";

export const LobbyPageSlide = () => {
  const { t } = useTranslation();

  return (
    <>
      <SlideTitle text={t("help.lobby.heading")} />

      <SlideParagraph text={t("help.lobby.description")} />

      <Stack gap={3}>
        <SlideSubTitle text={t("help.lobby.InfoTitle")} />
        <SlideParagraph text={t("help.lobby.infoDesc")} />
      </Stack>

      <Stack gap={3}>
        <SlideSubTitle text={t("help.lobby.seatsTitle")} />
        <SlideParagraph text={t("help.lobby.seatsDesc")} />
      </Stack>

      <Stack gap={3}>
        <SlideSubTitle text={t("help.lobby.scoreTitle")} />
        <SlideParagraph text={t("help.lobby.scoreDesc")} />
      </Stack>
    </>
  );
};
