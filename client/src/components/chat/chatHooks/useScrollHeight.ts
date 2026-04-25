import { useEffect, useState } from "react";

const SIZES = {
  header: 44.19,
  gap: 10,
  inputMobile: 42,
  inputDesktop: 36.8,
  outerPadding: 32,
  innerPadding: 24,
};

interface Params {
  isMobile: boolean;
}

export const useScrollHeight = ({ isMobile }: Params) => {
  const [vh, setVh] = useState(window.innerHeight);

  useEffect(() => {
    const onResize = () => {
      setVh(window.innerHeight);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const gap = SIZES.gap;
  const top = SIZES.header + gap + 2;

  const bottom =
    gap +
    (isMobile ? SIZES.inputMobile : SIZES.inputDesktop);

  const outerHeight =
    vh - top - bottom - SIZES.outerPadding - 1;

  const innerHeight =
    outerHeight -
    (isMobile ? SIZES.inputMobile : SIZES.inputDesktop) -
    5 -
    SIZES.innerPadding;

  return { top, outerHeight, innerHeight };
};
