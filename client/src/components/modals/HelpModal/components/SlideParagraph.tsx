import { Text } from "@mantine/core";
import { Trans } from "react-i18next";

interface Props {
  text: string;
}

export const SlideParagraph = ({ text }: Props) => (
  <Text size="sm" ta="justify" textWrap="pretty">
    <Trans i18nKey={text} />
  </Text>
);
