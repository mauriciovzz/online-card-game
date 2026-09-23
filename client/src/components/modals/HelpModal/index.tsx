import { useState, type ReactNode } from "react";
import {
  ActionIcon,
  Button,
  Divider,
  Flex,
  Group,
  SegmentedControl,
  Stack,
  Text,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import type { EmblaCarouselType } from "embla-carousel";
import { useTranslation } from "react-i18next";

import { useIsDark, useIsMobile } from "@/hooks";

import { GAME_RULES } from "@/constants";
import {
  SlideTitle,
  SlideParagraph,
  SlideSubTitle,
  SlideList,
} from "./components";
import {
  IconBrandLinkedin,
  IconBrandGithub,
  IconBriefcase,
} from "@tabler/icons-react";
import { AppModal } from "../AppModal";

const Slide = ({ children }: { children: ReactNode }) => (
  <Carousel.Slide>
    <Stack gap={0} h="100%" flex={1}>
      <Stack flex={1} gap="sm" px="sm">
        {children}
      </Stack>

      <Flex h={12} />

      <Divider />

      <Flex h={5 + 12} />
    </Stack>
  </Carousel.Slide>
);

const SLIDES = [
  { key: "unoBasics", text: "help.basics.title", page: 1 },
  { key: "cards", text: "help.cards.heading", page: 2 },
  { key: "points", text: "help.points.heading", page: 3 },
  { key: "houseRules", text: "help.rules.heading", page: 4 },
  { key: "homePage", text: "help.home.heading", page: 5 },
  { key: "lobbyPage", text: "help.lobby.heading", page: 6 },
  { key: "gamePage", text: "help.game.heading", page: 7 },
  { key: "gameBar", text: "help.buttons.heading", page: 8 },
  { key: "settings", text: "help.settings.heading", page: 9 },
  { key: "installation", text: "help.installation.heading", page: 11 },
];

const LINKS = [
  {
    key: "linkedin",
    icon: IconBrandLinkedin,
    url: "https://www.linkedin.com/",
  },
  { key: "github", icon: IconBrandGithub, url: "http://github.com/" },
  { key: "briefcase", icon: IconBriefcase, url: "http://google.com/" },
];

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

interface Props {
  opened: boolean;
  onClose: () => void;
}

export const HelpModal = ({ opened, onClose }: Props) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const isDark = useIsDark();

  const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);
  const [value, setValue] = useState("ios");

  return (
    <AppModal
      opened={opened}
      close={onClose}
      title="help.title"
      width={isMobile ? "100%" : 435}
      index={900}
    >
      <Carousel
        height="100%"
        w="100%"
        slideGap="sm"
        withControls={false}
        withIndicators
        getEmblaApi={setEmbla}
        styles={{
          indicators: { bottom: 0 },
          indicator: {
            backgroundColor: isDark ? undefined : "black",
          },
        }}
      >
        <Slide>
          <Stack flex={1}>
            <Stack gap={6} flex={1}>
              {SLIDES.map(({ key, text, page }) => (
                <Button
                  key={key}
                  flex={1}
                  variant="subtle"
                  size="compact-sm"
                  onClick={() => embla?.scrollTo(page)}
                >
                  {t(text)}
                </Button>
              ))}
            </Stack>

            <Divider />

            <Stack gap={12} style={{ userSelect: "none" }}>
              <Stack gap={0}>
                <Text ta="center" size="sm">
                  {t("help.index.devBy")}
                </Text>
                <Text ta="center" size="xs">
                  {t("help.index.tools")}
                </Text>
              </Stack>

              <Group justify="center" style={{ userSelect: "none" }}>
                {LINKS.map(({ key, icon: Icon, url }) => (
                  <ActionIcon
                    key={key}
                    variant="transparent"
                    component="a"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon />
                  </ActionIcon>
                ))}
              </Group>
            </Stack>
          </Stack>
        </Slide>

        <Slide>
          <SlideTitle text={t("help.basics.title")} />
          <SlideParagraph text="help.basics.goal" />
          <Stack gap={3}>
            <SlideSubTitle text={t("help.basics.turnHead")} />
            <SlideParagraph text="help.basics.turnInst" />
            <SlideList text="help.basics.matchCriteria" />
            <SlideParagraph text="help.basics.wildCards" />
            <SlideParagraph text="help.basics.drawInst" />
          </Stack>
          <Stack gap={3}>
            <SlideSubTitle text={t("help.basics.unoHeading")} />
            <SlideParagraph text="help.basics.unoInst" />
          </Stack>
        </Slide>

        <Slide>
          <SlideTitle text={t("help.cards.heading")} />
          {CARDS_INFO.map(({ key, name, description }) => (
            <Stack key={key} gap={3}>
              <SlideSubTitle text={t(name)} />
              <SlideParagraph text={description} />
            </Stack>
          ))}
        </Slide>

        <Slide>
          <SlideTitle text={t("help.points.heading")} />
          <SlideParagraph text="help.points.roundEnd" />
          <SlideParagraph text="help.points.pointsInst" />
          <SlideList text="help.points.pointValues" />
          <SlideParagraph text="help.points.scoreboard" />
        </Slide>

        <Slide>
          <SlideTitle text={t("help.rules.heading")} />
          <SlideParagraph text="help.rules.description" />
          {GAME_RULES.map(({ key, name, longDescription }) => (
            <Stack key={key} gap={3}>
              <SlideSubTitle text={t(name)} />
              <SlideParagraph text={longDescription} />
            </Stack>
          ))}
        </Slide>

        <Slide>
          <SlideTitle text={t("help.home.heading")} />
          <SlideParagraph text="help.home.description" />
          <Stack gap={3}>
            <SlideSubTitle text={t("help.home.nameTitle")} />
            <SlideParagraph text="help.home.nameDesc" />
          </Stack>
          <Stack gap={3}>
            <SlideSubTitle text={t("help.home.roomsTitle")} />
            <SlideParagraph text="help.home.roomsDesc" />
            <SlideList text="help.home.roomsCriteria" />
            <SlideParagraph text="help.home.roomsAction" />
          </Stack>
          <Stack gap={3}>
            <SlideSubTitle text={t("help.home.seatsTitle")} />
            <SlideParagraph text="help.home.seatsDesc" />
            <SlideList text="help.home.seatsCriteria" />
          </Stack>
        </Slide>

        <Slide>
          <SlideTitle text={t("help.lobby.heading")} />
          <SlideParagraph text="help.lobby.description" />
          <Stack gap={3}>
            <SlideSubTitle text={t("help.lobby.InfoTitle")} />
            <SlideParagraph text="help.lobby.infoDesc" />
          </Stack>
          <Stack gap={3}>
            <SlideSubTitle text={t("help.lobby.seatsTitle")} />
            <SlideParagraph text="help.lobby.seatsDesc" />
          </Stack>
          <Stack gap={3}>
            <SlideSubTitle text={t("help.lobby.scoreTitle")} />
            <SlideParagraph text="help.lobby.scoreDesc" />
          </Stack>
        </Slide>

        <Slide>
          <SlideTitle text={t("help.game.heading")} />
          <Stack gap={3}>
            <SlideSubTitle text={t("help.game.seatsTitle")} />
            <SlideParagraph text="help.game.seatsDesc" />
            <SlideList text="help.game.seatsCriteria" />
            <SlideParagraph text="help.game.turn" />
          </Stack>
          <Stack gap={3}>
            <SlideSubTitle text={t("help.game.pileTitle")} />
            <SlideParagraph text="help.game.pileDesc" />
            <SlideList text="help.game.pileCriteria" />
          </Stack>
          <Stack gap={3}>
            <SlideSubTitle text={t("help.game.playTitle")} />
            <SlideParagraph text="help.game.playDesc" />
            <SlideParagraph text="help.game.borderDesc" />
          </Stack>
        </Slide>

        <Slide>
          <SlideTitle text={t("help.buttons.heading")} />
          <Stack gap={3}>
            <SlideSubTitle text={t("help.buttons.drawTitle")} />
            <SlideParagraph text="help.buttons.drawDesc" />
          </Stack>
          <Stack gap={3}>
            <SlideSubTitle text={t("help.buttons.contTitle")} />
            <SlideParagraph text="help.buttons.contDesc" />
          </Stack>
          <Stack gap={3}>
            <SlideSubTitle text={t("help.buttons.unoTitle")} />
            <SlideParagraph text="help.buttons.unoDesc" />
          </Stack>
          <Stack gap={3}>
            <SlideSubTitle text={t("help.buttons.dontTitle")} />
            <SlideParagraph text="help.buttons.dontDesc" />
          </Stack>
        </Slide>

        <Slide>
          <SlideTitle text={t("help.settings.heading")} />
          <SlideParagraph text="help.settings.desc" />
          <SlideList text="help.settings.actions" />
          <SlideParagraph text="help.settings.host" />
        </Slide>

        <Slide>
          <SlideTitle text={t("help.installation.heading")} />
          <SegmentedControl
            size="sm"
            fullWidth
            transitionDuration={0}
            value={value}
            onChange={setValue}
            data={[
              { label: "iOS", value: "ios" },
              { label: "Android", value: "android" },
              {
                label: t("help.installation.desktop.heading"),
                value: "desktop",
              },
            ]}
          />
          <SlideSubTitle text={t(`help.installation.${value}.heading`)} />
          <SlideList ordered text={`help.installation.${value}.steps`} />
          <SlideParagraph text={`help.installation.${value}.tips`} />
        </Slide>
      </Carousel>
    </AppModal>
  );
};
