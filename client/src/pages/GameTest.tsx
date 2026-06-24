import { Box, Title } from "@mantine/core";
import { MainLayout } from "@/layouts";
import { AppBox } from "@/components";

import { CARD } from "@/constants";
import { CardItem } from "./Game/components";
import { useCardsMap } from "@/contexts/CardsContext";

const CardExample = ({
  svg,
  styles,
}: {
  svg: string;
  styles: React.CSSProperties;
}) => {
  return (
    <Box
      h={CARD.height}
      w={CARD.width}
      pos="absolute"
      style={{
        ...styles,
      }}
    >
      <CardItem svg={svg} />
    </Box>
  );
};

export const GameTest = () => {
  const { cardsMap } = useCardsMap();

  return (
    <MainLayout>
      <Title w="100%">Besties</Title>
      <AppBox>
        <CardExample
          svg={cardsMap["3G"]}
          styles={{
            transform: "rotate(0deg)",
          }}
        />
        <CardExample
          svg={cardsMap["4G"]}
          styles={{
            transform:
              "rotate(45deg) translateX(25px) translateY(-10px)",
          }}
        />
        <CardExample
          svg={cardsMap["7G"]}
          styles={{
            transform:
              "rotate(-45deg) translateY(-10px) translateX(-25px)",
          }}
        />
      </AppBox>
    </MainLayout>
  );
};
