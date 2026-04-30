const message = (message: string) => {
  console.log(message);
};

const error = (message: string) => {
  console.log("ERROR: ", message);
};

const socketLog = (id: string, message: string) => {
  console.log(`[s: ${id}]: ${message}`);
};

const roomLog = (id: string, message: string) => {
  console.log(`[r: ${id}]: ${message}`);
};

export default {
  message,
  socketLog,
  roomLog,
  error,
};
