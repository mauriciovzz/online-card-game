import { Flex, Stack } from "@mantine/core";

export const PageLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Flex
      w="100%"
      h="100vh"
      justify="center"
      align="center"
    >
      <Stack
        w={320}
        h={520}
        bd="1px solid #ced4da"
        bdrs="lg"
        p="20px"
      >
        {children}
      </Stack>
    </Flex>
  );
};
