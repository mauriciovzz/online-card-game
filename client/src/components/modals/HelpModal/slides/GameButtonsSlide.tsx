import { Stack } from "@mantine/core";
import { SlideTitle, SlideParagraph, SlideSubTitle } from "../components";
import { useTranslation } from "react-i18next";

export const GameButtonsSlide = () => {
  const { t } = useTranslation();

  return (
    <>
      <SlideTitle text={t("help.buttons.heading")} />

      <Stack gap={3}>
        <SlideSubTitle text={t("help.buttons.drawTitle")} />
        <SlideParagraph text={t("help.buttons.drawDesc")} />
      </Stack>

      <Stack gap={3}>
        <SlideSubTitle text={t("help.buttons.contTitle")} />
        <SlideParagraph text={t("help.buttons.contDesc")} />
      </Stack>

      <Stack gap={3}>
        <SlideSubTitle text={t("help.buttons.unoTitle")} />
        <SlideParagraph text={t("help.buttons.unoDesc")} />
      </Stack>

      <Stack gap={3}>
        <SlideSubTitle text={t("help.buttons.dontTitle")} />
        <SlideParagraph text={t("help.buttons.dontDesc")} />
      </Stack>
    </>
  );
};
