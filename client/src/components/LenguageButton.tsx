import { ActionIcon } from "@mantine/core";
import { useColorScheme } from "../hooks/useColorScheme";
import { useTranslation } from "react-i18next";

export const LenguageButton = () => {
  const { colorScheme } = useColorScheme();
  const { t, i18n } = useTranslation();

  const toggleLenguage = async () => {
    const currentLanguage = i18n.language;

    await i18n.changeLanguage(
      currentLanguage === "en" ? "es" : "en"
    );
  };

  return (
    <ActionIcon
      size={36}
      variant="default"
      aria-label="ChangeHabitStyle"
      onClick={() => {
        void toggleLenguage();
      }}
      color={colorScheme === "dark" ? "white" : "black"}
    >
      {t("lenguage")}
    </ActionIcon>
  );
};
