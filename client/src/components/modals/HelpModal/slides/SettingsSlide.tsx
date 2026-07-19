import { useTranslation } from "react-i18next";

import { SlideTitle, SlideParagraph, SlideList } from "../components";

export const SettingsSlide = () => {
  const { t } = useTranslation();

  return (
    <>
      <SlideTitle text={t("help.settings.heading")} />

      <SlideParagraph text={t("help.settings.desc")} />

      <SlideList
        items={t("help.settings.actions", { returnObjects: true }) as string[]}
      />

      <SlideParagraph text={t("help.settings.host")} />
    </>
  );
};
