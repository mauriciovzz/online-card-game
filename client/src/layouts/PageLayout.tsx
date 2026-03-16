import { Flex, Stack } from "@mantine/core";

import { useIsMobile } from "@/hooks/useIsMobile";

export const PageLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isMobile = useIsMobile();

  return (
    <Flex
      w="100%"
      h="100vh"
      justify="center"
      align="center"
      p="lg"
    >
      <Stack
        h={isMobile ? "100%" : "550px"}
        w={isMobile ? "100%" : "335px"}
        // bd="1px solid #ced4da"
        // bdrs="md"
        gap="md"
      >
        {children}
      </Stack>
    </Flex>
  );
};
