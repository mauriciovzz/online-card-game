import { useTranslation } from "react-i18next";

import { AppActionIcon } from "./AppActionIcon";

export const LangToggler = () => {
  const { t, i18n } = useTranslation();

  const toggleLenguage = () =>
    void (async () => {
      const currentLanguage = i18n.language;

      await i18n.changeLanguage(
        currentLanguage === "en" ? "es" : "en"
      );
    })();

  return (
    <AppActionIcon
      icon={t("common.lang")}
      onClick={toggleLenguage}
    />
  );
};
