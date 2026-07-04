import { Stack } from "@mantine/core";

import {
  SlideTitle,
  SlideParagraph,
  SlideSubTitle,
} from "../components";
import { useTranslation } from "react-i18next";

const CARDS_INFO = [
  {
    key: "number",
    name: "help.cards.numberTitle",
    description: "help.cards.numberDescription",
  },
  {
    key: "skip",
    name: "help.cards.skipTitle",
    description: "help.cards.skipDescription",
  },
  {
    key: "reverse",
    name: "help.cards.reverseTitle",
    description: "help.cards.reverseDescription",
  },
  {
    key: "drawTwo",
    name: "help.cards.drawTwoTitle",
    description: "help.cards.drawTwoDescription",
  },
  {
    key: "wild",
    name: "help.cards.wildTitle",
    description: "help.cards.wildDescription",
  },
  {
    key: "wildDrawFour",
    name: "help.cards.wildDrawFourTitle",
    description: "help.cards.wildDrawFourDescription",
  },
];

export const CardsSlide = () => {
  const { t } = useTranslation();

  return (
    <>
      <SlideTitle text={t("help.cards.heading")} />

      {CARDS_INFO.map(({ key, name, description }) => (
        <Stack key={key} gap={3}>
          <SlideSubTitle text={t(name)} />
          <SlideParagraph text={t(description)} />
        </Stack>
      ))}
    </>
  );
};
