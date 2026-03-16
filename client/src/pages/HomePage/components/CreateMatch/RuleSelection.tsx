import { Stack, Group } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { useTranslation } from "react-i18next";
import {
  IconFlipVertical,
  IconStairs,
  IconStack2,
  type IconProps,
} from "@tabler/icons-react";

import { InputLabel } from "@/components";
import { RuleButton } from "./RuleButton";
import { RulesPopover } from "./RulesPopover";

import type { CreateRoom, RoomRules } from "@/types";

const ruleIcons: {
  icon: React.ComponentType<IconProps>;
  key: keyof RoomRules;
}[] = [
  { icon: IconFlipVertical, key: "mirror" },
  { icon: IconStairs, key: "stair" },
  { icon: IconStack2, key: "stack" },
];

interface Props {
  form: UseFormReturnType<CreateRoom>;
}

export const RuleSelection = ({ form }: Props) => {
  const { t } = useTranslation();

  const toggleRule = (rule: keyof RoomRules) => {
    form.setFieldValue(
      `rules.${rule}`,
      !form.values.rules[rule]
    );
  };

  return (
    <Stack gap={0}>
      <Group gap={0}>
        <InputLabel text={t("rules")} size="sm" />
        <RulesPopover />
      </Group>

      <Group gap={10}>
        {ruleIcons.map(({ key, icon }) => (
          <RuleButton
            key={key}
            icon={icon}
            selected={form.values.rules[key]}
            onClick={() => {
              toggleRule(key);
            }}
          />
        ))}
      </Group>
    </Stack>
  );
};
