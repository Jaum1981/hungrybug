const REQ_MESSAGES_TYPES = {
  JOIN: "JOIN",
  CHECK_USER_IN_ROOM: "CHECK_USER_IN_ROOM",
  SEND_CHAT_MESSAGE: "SEND_CHAT_MESSAGE",
  LEAVE: "LEAVE"
};

const RES_MESSAGES_TYPES = {
  ERROR: "ERROR",
  JOIN_SUCCESS: "JOIN_SUCCESS",
  SUCCESS: "SUCCESS",
  RECEIVE_CHAT_MESSAGE: "RECEIVE_CHAT_MESSAGE"
};

const REQUEST = "req";
const RESPONSE = "res";

module.exports = {
  REQ_MESSAGES_TYPES,
  RES_MESSAGES_TYPES,
  REQUEST,
  RESPONSE
};