import { forwardRef } from "react";
import { Flex, type FlexProps } from "@mantine/core";

type Props = FlexProps & {
  borderColor: string;
};

export const AppBox = forwardRef<HTMLDivElement, Props>(
  ({ children, borderColor, ...props }, ref) => {
    return (
      <Flex
        ref={ref}
        w="100%"
        h="100%"
        justify="center"
        align="center"
        bd={`1px solid ${borderColor}`}
        bdrs="md"
        {...props}
      >
        {children}
      </Flex>
    );
  }
);
