import {
  Flex,
  Loader,
  useMantineTheme,
} from "@mantine/core";

import { useIsDark } from "@/hooks";

export const Spinner = () => {
  const isDark = useIsDark();
  const theme = useMantineTheme();

  const color = isDark ? theme.colors.dark[0] : theme.black;

  return (
    <Flex h="100%" w="100%" align="center" justify="center">
      <Loader size="sm" color={color} />
    </Flex>
  );
};
