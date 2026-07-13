import { forwardRef } from "react";
import { Flex, type FlexProps } from "@mantine/core";

import { useThemeColor } from "@/hooks";

type Props = FlexProps & {
  borderColor?: string;
};

export const AppBox = forwardRef<HTMLDivElement, Props>(
  ({ children, borderColor, ...props }, ref) => {
    const themeColor = useThemeColor();
    const border = borderColor ?? themeColor;

    return (
      <Flex
        ref={ref}
        w="100%"
        h="100%"
        justify="center"
        align="center"
        bdrs="md"
        gap={0}
        style={{
          overflow: "hidden",
          border: `1px solid ${border}`,
        }}
        {...props}
      >
        {children}
      </Flex>
    );
  }
);
