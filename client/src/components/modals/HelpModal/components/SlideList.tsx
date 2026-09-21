import { List } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";

interface Props {
  ordered?: boolean;
  text: string;
}

export const SlideList = ({ ordered, text }: Props) => {
  const { t } = useTranslation();
  const items = t(text, { returnObjects: true }) as string[];

  return (
    <List size="sm" type={ordered ? "ordered" : undefined}>
      {items.map((item) => (
        <List.Item key={item}>
          <Trans i18nKey={item} />
        </List.Item>
      ))}
    </List>
  );
};
