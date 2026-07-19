import "react-i18next";
import { en } from "../locales/en/translation";

declare module "react-i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: { translation: typeof en };
  }
}
