import { users } from "@/stores";

const createName = () => {
  const id = Math.floor(Math.random() * 900 + 100);
  return "UNO_" + id.toString();
};

const generateName = (userId: string) => {
  let name = createName();

  while ([...users.values()].includes(name)) {
    name = createName();
  }

  users.set(userId, name);
  return name;
};

const updateName = (userId: string, newName: string) => {
  users.set(userId, newName);
};

export default {
  generateName,
  updateName,
};
