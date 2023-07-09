const { RES_MESSAGES_TYPES, RESPONSE } = require("./constants");
const { messageValidator } = require("./validators");

const packMessage = (origin, { type, room, data }) => {
  try {
    messageValidator(origin, { type, room, data });

    const message = {
      type,
      data
    };

    if (room) {
      message.room = room;
    }

    return JSON.stringify(message);
  } catch (error) {
    throw new Error(error.message);
  }
};

const unpackMessage = (origin, message) => {
  try {
    const { type, room, data } = JSON.parse(message);

    messageValidator(origin, { type, room, data });

    return { type, room, data };
  } catch (error) {
    throw new Error(error.message);
  }
};

const send = (client, message) => {
  // Checa se o socket do cliente está conectado
  if (client.readyState === 1) {
    client.send(message);

    return true;
  }

  return false;
};

const sendTo = (client, clients, message) => {
  clients.forEach((c) => {
    // if (c !== client) {
      send(c, message);
    // }
  });
};

const sendResponse = (client, type, data) => {
  const message = packMessage(RESPONSE, { type, data });

  send(client, message);
};

const sendError = (client, error) => {
  const message = packMessage(
    RESPONSE,
    { type: RES_MESSAGES_TYPES.ERROR, data: error }
  );

  send(client, message);
};

module.exports = {
  packMessage,
  unpackMessage,
  sendTo,
  sendResponse,
  sendError
};
