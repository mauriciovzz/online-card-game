import { users } from "@/stores";

const isUserNameTaken = (name: string) => {
  return [...users.values()].includes(name);
};

const generateUserName = () => {
  return `UNO_${Math.floor((Math.random() * 900) + 100)}`;
};

const errorResponse = (error: string) => ({
  success: false,
  error,
  data: null,
});

// main functions ---

const generateName = (userId: string) => {
  let name = generateUserName();

  while (isUserNameTaken(name)) {
    name = generateUserName();
  };

  users.set(userId, name);

  return name;
};

const updateName = (userId: string, newName: string) => {
  const trimmedName = newName?.trim();

  if (trimmedName.length < 2) 
    return errorResponse("NAME_MIN_LENGTH");

  if (trimmedName.length > 15) 
    return errorResponse("NAME_MAX_LENGTH");

  if (isUserNameTaken(trimmedName)) 
    return errorResponse("NAME_TAKEN");

  users.set(userId, trimmedName);

  return {
    success: true,
    error: null,
    data: { name: trimmedName },
  };
};

export default {
  generateName,
  updateName,
};
