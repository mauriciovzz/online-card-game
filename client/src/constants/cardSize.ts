const SCALE = 0.8;
const BORDER = 1;

const WIDTH = 60 * SCALE;
const HEIGHT = 90 * SCALE;

export const CARD: {
  scale: number;

  innerWidth: number;
  innerHeight: number;

  width: number;
  height: number;

  border: number;
} = {
  scale: SCALE,

  // actual svg area
  innerWidth: WIDTH,
  innerHeight: HEIGHT,

  // including border
  width: WIDTH + BORDER * 2,
  height: HEIGHT + BORDER * 2,

  border: BORDER,
};
