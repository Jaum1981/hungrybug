const { REQ_MESSAGES_TYPES, RES_MESSAGES_TYPES, REQUEST } = require("./constants");

const messageValidator = (origin, message) => {
  const { type, room, data } = message;

  if (!type) {
    throw new Error('Request type is required');
  }

  const MESSAGE_TYPES = origin === REQUEST
    ? REQ_MESSAGES_TYPES
    : RES_MESSAGES_TYPES;

  if (!Object.keys(MESSAGE_TYPES).includes(type)) {
    throw new Error('Invalid request type');
  }

  if (!room && origin === REQUEST) {
    throw new Error('Room is required');
  }

  if (!data) {
    throw new Error('Data is required');
  }

  return true;
};

module.exports = {
  messageValidator
};
