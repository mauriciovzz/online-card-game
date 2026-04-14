import { users } from "@/stores";
import { SocketRes, UserName } from "@/types";

const isUserNameTaken = (name: string) => {
  return [...users.values()].includes(name);
};

const generateUserName = () => {
  return `UNO_${Math.floor((Math.random() * 900) + 100)}`;
};

// main functions ---

const generateName = (userId: string) => {
  let name = generateUserName();

  while (isUserNameTaken(name)) {
    name = generateUserName();
  };

  users.set(userId, name);

  return name;
};

const updateName = (userId: string, newName: string): SocketRes<UserName> => {
  const trimmedName = newName?.trim();

  if (trimmedName.length < 1) 
    return { success: false, error: "EMPTY" }

  if (trimmedName.length > 10) 
    return { success: false, error: "NAME_MAX_LENGTH" }

  if (isUserNameTaken(trimmedName)) 
    return { success: false, error: "NAME_TAKEN" }

  users.set(userId, trimmedName);

  return {
    success: true,
    data: { name: trimmedName },
  };
};

export default {
  generateName,
  updateName,
};
