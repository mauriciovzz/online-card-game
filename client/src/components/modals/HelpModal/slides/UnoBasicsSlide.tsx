import { Stack } from "@mantine/core";
import {
  SlideTitle,
  SlideParagraph,
  SlideSubTitle,
  SlideList,
} from "../components";
import { useTranslation } from "react-i18next";

export const UnoBasicsSlide = () => {
  const { t } = useTranslation();

  return (
    <>
      <SlideTitle text={t("help.basics.title")} />

      <SlideParagraph text={t("help.basics.goal")} />

      <Stack gap={3}>
        <SlideSubTitle text={t("help.basics.turnHead")} />
        <SlideParagraph text={t("help.basics.turnInst")} />
        <SlideList
          items={
            t("help.basics.matchCriteria", { returnObjects: true }) as string[]
          }
        />
        <SlideParagraph text={t("help.basics.wildCards")} />
        <SlideParagraph text={t("help.basics.drawInst")} />
      </Stack>

      <Stack gap={3}>
        <SlideSubTitle text={t("help.basics.unoHeading")} />
        <SlideParagraph text={t("help.basics.unoInst")} />
      </Stack>
    </>
  );
};
