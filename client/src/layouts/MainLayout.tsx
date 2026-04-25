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
      h="100vh"
      justify="center"
      align="center"
      p="md"
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
