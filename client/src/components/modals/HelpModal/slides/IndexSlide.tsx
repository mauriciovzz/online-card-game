import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBriefcase,
  type TablerIcon,
} from "@tabler/icons-react";
import type { EmblaCarouselType } from "embla-carousel";
import { useTranslation } from "react-i18next";

const IndexButton = ({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) => (
  <Button
    flex={1}
    variant="subtle"
    size="compact-sm"
    onClick={onClick}
  >
    {text}
  </Button>
);

const SLIDES = [
  {
    key: "unoBasics",
    text: "help.basics.title",
    page: 1,
  },
  {
    key: "cards",
    text: "help.cards.heading",
    page: 2,
  },
  {
    key: "points",
    text: "help.points.heading",
    page: 3,
  },
  {
    key: "houseRules",
    text: "help.rules.heading",
    page: 4,
  },
  {
    key: "homePage",
    text: "help.home.heading",
    page: 5,
  },
  {
    key: "lobbyPage",
    text: "help.lobby.heading",
    page: 6,
  },
  {
    key: "gamePage",
    text: "help.game.heading",
    page: 7,
  },
  {
    key: "gameBar",
    text: "help.buttons.heading",
    page: 8,
  },
  {
    key: "settings",
    text: "help.settings.heading",
    page: 9,
  },
];

const IconButton = ({
  icon: Icon,
  url,
}: {
  icon: TablerIcon;
  url: string;
}) => (
  <ActionIcon
    variant="transparent"
    component="a"
    href={url}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Icon />
  </ActionIcon>
);

const LINKS = [
  {
    key: "linkedin",
    icon: IconBrandLinkedin,
    url: "https://www.linkedin.com/",
  },
  {
    key: "github",
    icon: IconBrandGithub,
    url: "http://github.com/",
  },
  {
    key: "briefcase",
    icon: IconBriefcase,
    url: "http://google.com/",
  },
];

interface Props {
  embla: EmblaCarouselType | null;
}

export const IndexSlide = ({ embla }: Props) => {
  const { t } = useTranslation();

  return (
    <Stack flex={1}>
      <Stack gap={6} flex={1}>
        {SLIDES.map(({ key, text, page }) => (
          <IndexButton
            key={key}
            text={t(text)}
            onClick={() => embla?.scrollTo(page)}
          />
        ))}
      </Stack>

      <Divider />

      <Stack gap={12}>
        <Stack gap={0}>
          <Text ta="center" size="sm">
            {t("help.index.devBy")}
          </Text>
          <Text ta="center" size="xs">
            {t("help.index.tools")}
          </Text>
        </Stack>

        <Group justify="center">
          {LINKS.map(({ key, icon, url }) => (
            <IconButton key={key} icon={icon} url={url} />
          ))}
        </Group>
      </Stack>
    </Stack>
  );
};
