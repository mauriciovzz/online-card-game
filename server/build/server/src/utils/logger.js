"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const LOG_FILE = path_1.default.join(process.cwd(), "gameLog.txt");
const write = (message) => {
    fs_1.default.appendFileSync(LOG_FILE, `${message}\n`);
};
exports.default = {
    turnStart(player, game) {
        var _a;
        write(`
      TURN START: ${player}
      index=${game.currPlayerIndex.toString()}
      direction=${game.direction.toString()}
      effect=${(_a = game.currEffect) !== null && _a !== void 0 ? _a : "n/e"}
      drawStack=${game.currDrawStack.toString()}
      topCard=${game.topCard.raw}
    `);
    },
    playCard(player, card, hand) {
        write(`[${player}] PLAYED ${card} | HAND [${hand.join(", ")}]`);
    },
    drawCard(player, card, hand) {
        write(`[${player}] DRAW ${card} | HAND [${hand.join(", ")}]`);
    },
    info(msg) {
        write(msg);
    },
};
