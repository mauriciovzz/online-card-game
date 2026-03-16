import { ActionIcon, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

export const LanguageButton = () => {
  const { t, i18n } = useTranslation();

  const toggleLenguage = () =>
    void (async () => {
      const currentLanguage = i18n.language;

      await i18n.changeLanguage(
        currentLanguage === "en" ? "es" : "en"
      );
    })();

  return (
    <ActionIcon
      size={36}
      variant="default"
      onClick={toggleLenguage}
      bdrs="md"
      type={"button"}
    >
      <Text size="sm" fw={700}>
        {t("lenguage")}
      </Text>
    </ActionIcon>
  );
};
