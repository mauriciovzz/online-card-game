import React from "react";
import {
  Stack,
  Group,
  UnstyledButton,
  Flex,
} from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { useTranslation } from "react-i18next";
import type { IconProps } from "@tabler/icons-react";
import clsx from "clsx";

import { useIsMobile } from "@/hooks/useIsMobile";
import { GAME_RULES } from "@/constants";
import { Label } from "@/components";
import { RulesPopover } from "./RulesPopover";
import classes from "./FormRuleSelector.module.css";

import type { RoomRules } from "@/types";

interface RulebuttonProps {
  icon: React.ComponentType<IconProps>;
  borderRadius: string;
  selected: boolean;
  readOnly?: boolean;
  onClick: () => void;
}

const RuleButton = ({
  icon: Icon,
  borderRadius,
  selected,
  readOnly,
  onClick,
}: RulebuttonProps) => {
  return (
    <UnstyledButton
      flex={1}
      w="100%"
      h="100%"
      bdrs={borderRadius}
      className={clsx(
        readOnly ? classes.readOnly : classes.inner,
        selected && classes.selected
      )}
      onClick={onClick}
    >
      <Flex flex={1} align="center" justify="center">
        <Icon size={20} stroke={1.5} />
      </Flex>
    </UnstyledButton>
  );
};

interface WithRules {
  rules: RoomRules;
}

interface Props<T extends WithRules> {
  form: UseFormReturnType<T>;
  readOnly?: boolean;
}

export const FormRuleSelector = <T extends WithRules>({
  form,
  readOnly,
}: Props<T>) => {
  const { t } = useTranslation();

  const isMobile = useIsMobile();

  const toggleRule = (rule: keyof RoomRules) => {
    form.setFieldValue("rules", (prev) => ({
      ...prev,
      [rule]: !prev[rule],
    }));
  };

  return (
    <Stack gap={0} flex={1}>
      <Group gap={3}>
        <Label text={t("rules")} />
        <RulesPopover />
      </Group>

      <Group
        w="100%"
        h={isMobile ? 40.8 : 35.69}
        p={4}
        bdrs="md"
        gap={0}
        className={classes.base}
      >
        {GAME_RULES.map(({ name, borderRadius, icon }) => (
          <RuleButton
            key={name}
            icon={icon}
            borderRadius={borderRadius}
            selected={form.values.rules[name]}
            readOnly={readOnly}
            onClick={() => {
              toggleRule(name);
            }}
          />
        ))}
      </Group>
    </Stack>
  );
};
