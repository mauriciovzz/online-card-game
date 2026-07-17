import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SegmentedControl } from "@mantine/core";

import {
  SlideTitle,
  SlideParagraph,
  SlideSubTitle,
  SlideList,
} from "../components";

export const InstallSlide = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState("ios");
  return (
    <>
      <SlideTitle text={t("help.install.heading")} />

      <SegmentedControl
        size="sm"
        fullWidth
        transitionDuration={0}
        value={value}
        onChange={setValue}
        data={[
          { label: "iOS", value: "ios" },
          { label: "Android", value: "android" },
        ]}
      />

      <SlideSubTitle
        text={t(`help.install.${value}.heading`)}
      />

      <SlideList
        ordered
        items={
          t(`help.install.${value}.steps`, {
            returnObjects: true,
          }) as string[]
        }
      />

      <SlideParagraph
        text={t(`help.install.${value}.tips`)}
      />
    </>
  );
};
