import { useState, type ReactNode } from "react";
import {
  Divider,
  Flex,
  Modal,
  Paper,
  Stack,
  useMantineColorScheme,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import type { EmblaCarouselType } from "embla-carousel";
import { useTranslation } from "react-i18next";

import { useIsMobile } from "@/hooks";

import {
  CardsSlide,
  IndexSlide,
  PointsSlide,
  UnoBasicsSlide,
  HouseRulesSlide,
  HomePageSlide,
  LobbyPageSlide,
  GamePageSlide,
  GameButtonsSlide,
} from "./slides";
import { SettingsSlide } from "./slides/SettingsSlide";

const Slide = ({ children }: { children: ReactNode }) => (
  <Carousel.Slide>
    <Stack gap={0} h="100%" flex={1}>
      <Stack flex={1} gap="sm">
        {children}
      </Stack>

      <Flex h={12} />

      <Divider />

      <Flex h={5 + 12} />
    </Stack>
  </Carousel.Slide>
);

interface Props {
  opened: boolean;
  onClose: () => void;
}

export const HelpModal = ({ opened, onClose }: Props) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { colorScheme } = useMantineColorScheme();

  const [embla, setEmbla] =
    useState<EmblaCarouselType | null>(null);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t("help.title")}
      size={isMobile ? "100%" : 340}
      centered
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Paper
        h="100%"
        w="100%"
        p="sm"
        withBorder
        style={{ display: "flex" }}
      >
        <Carousel
          height="100%"
          w="100%"
          slideGap="sm"
          withControls={false}
          withIndicators
          getEmblaApi={setEmbla}
          styles={{
            indicators: {
              bottom: 0,
            },
            indicator: {
              backgroundColor:
                colorScheme === "dark"
                  ? undefined
                  : "black",
            },
          }}
        >
          <Slide>
            <IndexSlide embla={embla} />
          </Slide>

          <Slide>
            <UnoBasicsSlide />
          </Slide>

          <Slide>
            <CardsSlide />
          </Slide>

          <Slide>
            <PointsSlide />
          </Slide>

          <Slide>
            <HouseRulesSlide />
          </Slide>

          <Slide>
            <HomePageSlide />
          </Slide>

          <Slide>
            <LobbyPageSlide />
          </Slide>

          <Slide>
            <GamePageSlide />
          </Slide>

          <Slide>
            <GameButtonsSlide />
          </Slide>

          <Slide>
            <SettingsSlide />
          </Slide>
        </Carousel>
      </Paper>
    </Modal>
  );
};
