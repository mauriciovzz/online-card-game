import { Flex, Stack } from "@mantine/core";

import { useIsMobile } from "@/hooks";

export const MainLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isMobile = useIsMobile();

  return (
    <Flex
      w="100%"
      h="100dvh"
      justify="center"
      align="center"
      p="md"
      style={{
        touchAction: "none",
      }}
    >
      <Stack
        h="100%"
        w={isMobile ? "100%" : "335px"}
        gap="sm"
        pos="relative"
      >
        {children}
      </Stack>
    </Flex>
  );
};
