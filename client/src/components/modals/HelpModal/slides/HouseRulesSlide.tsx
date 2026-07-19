import { Stack } from "@mantine/core";
import { SlideTitle, SlideParagraph, SlideSubTitle } from "../components";

import { GAME_RULES } from "@/constants";
import { useTranslation } from "react-i18next";

export const HouseRulesSlide = () => {
  const { t } = useTranslation();

  return (
    <>
      <SlideTitle text={t("help.rules.heading")} />

      <SlideParagraph text={t("help.rules.description")} />

      {GAME_RULES.map(({ key, name, longDescription }) => (
        <Stack key={key} gap={3}>
          <SlideSubTitle text={t(name)} />
          <SlideParagraph text={t(longDescription)} />
        </Stack>
      ))}
    </>
  );
};
