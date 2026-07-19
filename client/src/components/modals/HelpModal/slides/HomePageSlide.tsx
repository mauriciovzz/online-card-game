import { Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";

import {
  SlideTitle,
  SlideParagraph,
  SlideSubTitle,
  SlideList,
} from "../components";

export const HomePageSlide = () => {
  const { t } = useTranslation();

  return (
    <>
      <SlideTitle text={t("help.home.heading")} />

      <SlideParagraph text={t("help.home.description")} />

      <Stack gap={3}>
        <SlideSubTitle text={t("help.home.nameTitle")} />
        <SlideParagraph text={t("help.home.nameDesc")} />
      </Stack>

      <Stack gap={3}>
        <SlideSubTitle text={t("help.home.roomsTitle")} />
        <SlideParagraph text={t("help.home.roomsDesc")} />
        <SlideList
          items={
            t("help.home.roomsCriteria", { returnObjects: true }) as string[]
          }
        />
        <SlideParagraph text={t("help.home.roomsAction")} />
      </Stack>

      <Stack gap={3}>
        <SlideSubTitle text={t("help.home.seatsTitle")} />
        <SlideParagraph text={t("help.home.seatsDesc")} />
        <SlideList
          items={
            t("help.home.seatsCriteria", { returnObjects: true }) as string[]
          }
        />
      </Stack>
    </>
  );
};
