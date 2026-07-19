import { Stack, Group, UnstyledButton, Flex } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import clsx from "clsx";

import { GAME_RULES } from "@/constants";
import { useIsMobile } from "@/hooks";
import { LabelWithPopover } from "@/components";

import classes from "./FormRuleSelector.module.css";
import type { RoomRules } from "@shared/types";

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
  const isMobile = useIsMobile();

  const toggleRule = (rule: keyof RoomRules) => {
    form.setFieldValue("rules", (prev) => ({ ...prev, [rule]: !prev[rule] }));
  };

  return (
    <Stack gap={0}>
      <LabelWithPopover text="rules.title" data={GAME_RULES} />

      <Group
        w="100%"
        h={isMobile ? 40.8 : 35.69}
        p={4}
        bdrs="md"
        gap={0}
        className={classes.base}
      >
        {GAME_RULES.map(({ key, borderRadius, icon: Icon }) => (
          <UnstyledButton
            key={key}
            flex={1}
            w="100%"
            h="100%"
            bdrs={borderRadius}
            className={clsx(
              readOnly ? classes.readOnly : classes.inner,
              form.values.rules[key] && classes.selected,
            )}
            onClick={() => {
              toggleRule(key);
            }}
          >
            <Flex flex={1} align="center" justify="center">
              <Icon size={20} stroke={1.5} />
            </Flex>
          </UnstyledButton>
        ))}
      </Group>
    </Stack>
  );
};
