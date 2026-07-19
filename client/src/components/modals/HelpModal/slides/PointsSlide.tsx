import { useTranslation } from "react-i18next";

import { SlideTitle, SlideParagraph, SlideList } from "../components";

export const PointsSlide = () => {
  const { t } = useTranslation();

  return (
    <>
      <SlideTitle text={t("help.points.heading")} />

      <SlideParagraph text={t("help.points.roundEnd")} />

      <SlideParagraph text={t("help.points.pointsInst")} />

      <SlideList
        items={
          t("help.points.pointValues", { returnObjects: true }) as string[]
        }
      />

      <SlideParagraph text={t("help.points.scoreboard")} />
    </>
  );
};
