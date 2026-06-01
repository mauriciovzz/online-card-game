function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing env variable: ${name}`);
  }

  return value;
}

export const env = {
  HOST: required("HOST"),
  SERVER_PORT: required("SERVER_PORT"),
  CLIENT_PORT: required("CLIENT_PORT"),
};
