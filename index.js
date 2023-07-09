const express = require("express");
const cors = require("cors");
const http = require("http");
// const https = require("https");
const fs = require("fs");
const { Server } = require("ws");

const {
  REQ_MESSAGES_TYPES,
  REQUEST,
  RESPONSE,
  RES_MESSAGES_TYPES,
} = require("./utils/constants");
const {
  leaveRoom,
  joinRoom,
  existsRoom,
  getClients,
  checkUserInRoom,
} = require("./utils/rooms");
const {
  unpackMessage,
  sendError,
  packMessage,
  sendTo,
  sendResponse,
} = require("./utils/proxy");
const generateUniqueUsername = require("./utils/usernames");

const app = express();
// const server = https.createServer(
//   {
//     key: fs.readFileSync("./cert/private_key.pem"),
//     cert: fs.readFileSync("./cert/cert.pem"),
//   },
//   app
// );

const server = http.createServer(
  app
);

const wss = new Server({ server });

app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.options("*", cors());

const PORT = 3001;

wss.on("connection", (ws) => {
  ws.username = generateUniqueUsername();

  ws.on("message", (message) => {
    try {
      if (!message) {
        throw new Error("Message is required");
      }

      // Modelo requisição resposta: JSON { type: 'JOIN', room: 'sala', data: 'mensagem' }
      // onde type é o tipo da ação, room é o endereço da sala e data é o dado enviado
      const { type, room, data } = unpackMessage(REQUEST, message);

      if (type === REQ_MESSAGES_TYPES.CHECK_USER_IN_ROOM) {
        const isInRoom = checkUserInRoom(room, ws);

        sendResponse(ws, RES_MESSAGES_TYPES.SUCCESS, { isInRoom });
      }

      // Evento de entrada na sala
      if (type === REQ_MESSAGES_TYPES.JOIN) {
        joinRoom(room, ws);

        const clients = getClients(room);

        const message = packMessage(RESPONSE, {
          type: RES_MESSAGES_TYPES.JOIN_SUCCESS,
          data: { username: ws.username, message: "Joined successfully" },
          room,
        });

        sendTo(ws, clients, message);
      }

      // Evento de envio de mensagem no chat
      if (type === REQ_MESSAGES_TYPES.SEND_CHAT_MESSAGE) {
        if (existsRoom(room)) {
          const clients = getClients(room);

          const message = packMessage(RESPONSE, {
            type: RES_MESSAGES_TYPES.RECEIVE_CHAT_MESSAGE,
            data: { username: ws.username, message: data },
            room,
          });

          sendTo(ws, clients, message);
          sendResponse(ws, RES_MESSAGES_TYPES.SUCCESS, {
            message: "Message sent successfully",
          });
        } else {
          sendError(ws, { message: "Room does not exist" });
        }
      }

      // Evento de saída da sala
      if (type === REQ_MESSAGES_TYPES.LEAVE) {
        leaveRoom(ws);

        sendResponse(ws, RES_MESSAGES_TYPES.SUCCESS, {
          message: "Left successfully",
        });
      }
    } catch (error) {
      sendError(ws, { message: error.message });
    }
  });

  ws.on("close", () => {
    leaveRoom(ws);

    sendResponse(ws, RES_MESSAGES_TYPES.SUCCESS, {
      message: "Left successfully",
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
