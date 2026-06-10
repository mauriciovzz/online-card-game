import { Game } from "@shared/types";
import fs from "fs";
import path from "path";

const LOG_FILE = path.join(process.cwd(), "gameLog.txt");

const write = (message: string) => {
  fs.appendFileSync(LOG_FILE, `${message}\n`);
};

export default {
  turnStart(player: string, game: Game) {
    write(`
      TURN START: ${player}
      index=${game.currPlayerIndex.toString()}
      direction=${game.direction.toString()}
      effect=${game.currEffect ?? "n/e"}
      drawStack=${game.currDrawStack.toString()}
      topCard=${game.topCard.raw}
    `);
  },

  playCard(player: string, card: string, hand: string[]) {
    write(
      `[${player}] PLAYED ${card} | HAND [${hand.join(
        ", "
      )}]`
    );
  },

  drawCard(player: string, card: string, hand: string[]) {
    write(
      `[${player}] DRAW ${card} | HAND [${hand.join(", ")}]`
    );
  },

  info(msg: string) {
    write(msg);
  },
};
