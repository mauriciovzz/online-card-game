const SIZES = {
  header: 44.19,
  gap: 12,
  buttonMobile: 42,
  buttonDesktop: 36,
  outerPadding: 32,
  innerPadding: 24,
};

interface Params {
  layoutHeight: number;
  isMobile: boolean;
}

export const useScrollHeight = ({
  layoutHeight,
  isMobile,
}: Params) => {
  const gap = SIZES.gap;
  const top = SIZES.header + gap;

  const buttonSize = isMobile
    ? SIZES.buttonMobile
    : SIZES.buttonDesktop;

  const bottom = gap + buttonSize;

  const outerHeight = layoutHeight - top - bottom;

  const innerHeight =
    outerHeight - buttonSize - 5 - SIZES.innerPadding;

  return { top, outerHeight, innerHeight };
};
