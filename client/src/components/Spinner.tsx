import { Flex, Loader } from "@mantine/core";
import { PageLayout } from "../layouts/PageLayout";

export const Spinner = () => {
  return (
    <PageLayout>
      <Flex h="100%" w="100%" align="center" justify="center">
        <Loader color="blue" size="xl" />
      </Flex>
    </PageLayout>
  );
};
