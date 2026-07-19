import { Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

import { AppActionIcon } from "./AppActionIcon";

interface Props {
  expand?: boolean;
}

export const LangToggler = ({ expand }: Props) => {
  const { t, i18n } = useTranslation();

  const toggleLenguage = () =>
    void (async () => {
      const currentLanguage = i18n.language;

      await i18n.changeLanguage(currentLanguage === "en" ? "es" : "en");
    })();

  return (
    <AppActionIcon expand={expand} onClick={toggleLenguage}>
      <Text size="sm" fw={700}>
        {t("common.lang")}
      </Text>
    </AppActionIcon>
  );
};
