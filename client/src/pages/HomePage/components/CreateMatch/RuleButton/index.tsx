import { Flex, UnstyledButton } from "@mantine/core";
import type { IconProps } from "@tabler/icons-react";
import clsx from "clsx";

import classes from "./RuleButton.module.css";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Props {
  icon: React.ComponentType<IconProps>;
  selected: boolean;
  onClick: () => void;
}

export const RuleButton = ({
  icon: Icon,
  selected,
  onClick,
}: Props) => {
  const isMobile = useIsMobile();

  return (
    <UnstyledButton
      type="button"
      flex={1}
      h={isMobile ? 35.69 : 30.59}
      p={4}
      bdrs="sm"
      className={classes.button}
      onClick={onClick}
    >
      <Flex
        w="100%"
        h="100%"
        p={isMobile ? 4 : 2}
        justify="center"
        align="center"
        bdrs="sm"
        className={clsx(
          classes.inner,
          selected && classes.selected
        )}
      >
        <Icon size={20} stroke={isMobile ? 1.6 : 1.2} />
      </Flex>
    </UnstyledButton>
  );
};
