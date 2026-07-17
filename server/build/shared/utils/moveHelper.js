"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkMove = (top, played) => {
    const { type: tType, color: tColor } = top;
    const { type: pType, color: pColor } = played;
    if (pType === "WILD_CARD" || pType === "DRAW_FOUR") {
        return true;
    }
    if (tType === "NUMBER" && pType === "NUMBER") {
        return top.number === played.number || tColor === pColor;
    }
    return tType === pType || tColor === pColor;
};
const checkChainMove = (top, played, rules) => {
    const { type: tType } = top;
    const { type: pType } = played;
    if (tType !== "NUMBER" || pType !== "NUMBER")
        return false;
    if (rules.stair && played.number === top.number + 1)
        return true;
    if (rules.mirror && top.raw === played.raw)
        return true;
    return false;
};
exports.default = {
    checkMove,
    checkChainMove,
};
