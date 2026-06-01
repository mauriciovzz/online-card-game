import { Box } from "@mantine/core";

import { CARD } from "@/constants";

interface Props {
  svg: string;
}

export const CardItem = ({ svg }: Props) => {
  if (!svg) return null;

  return (
    <Box
      w={CARD.width}
      h={CARD.height}
      bd={`${CARD.border.toString()}px solid black`}
      bdrs="md"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={CARD.innerWidth}
        height={CARD.innerHeight}
        dangerouslySetInnerHTML={{
          __html: svg,
        }}
      />
    </Box>
  );
};
