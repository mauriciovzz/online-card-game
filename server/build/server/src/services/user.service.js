"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stores_1 = require("../stores");
const createName = () => {
    const id = Math.floor(Math.random() * 900 + 100);
    return "UNO_" + id.toString();
};
const generateName = (userId) => {
    let name = createName();
    while ([...stores_1.users.values()].includes(name)) {
        name = createName();
    }
    stores_1.users.set(userId, name);
    return name;
};
const updateName = (userId, newName) => {
    stores_1.users.set(userId, newName);
};
exports.default = {
    generateName,
    updateName,
};
