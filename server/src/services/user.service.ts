import { users } from "@/stores";
import { SocketRes, UserName } from "@shared/types";

const isNameTaken = (name: string) => {
  return [...users.values()].includes(name);
};

const getNewName = () => {
  const id = Math.floor(
    Math.random() * 900 + 100
  ).toString();

  return "UNO_" + id;
};

const generateName = (userId: string) => {
  let name = getNewName();

  while (isNameTaken(name)) {
    name = getNewName();
  }

  users.set(userId, name);
  return name;
};

const updateName = (
  userId: string,
  newName: string
): SocketRes<UserName> => {
  const trimmedName = newName.trim();

  if (trimmedName.length < 1)
    return { success: false, error: "NAME_EMPTY" };

  if (trimmedName.length > 10)
    return { success: false, error: "NAME_MAX_LENGTH" };

  if (isNameTaken(trimmedName))
    return { success: false, error: "NAME_TAKEN" };

  users.set(userId, trimmedName);
  return { success: true, data: { name: trimmedName } };
};

export default {
  generateName,
  updateName,
};
