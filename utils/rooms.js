const rooms = new Map();

const getRooms = () => {
  return rooms;
}

const getClients = (room) => {
  return rooms.get(room) || [];
}

const existsRoom = (room) => {
  return rooms.has(room);
}

const checkUserInRoom = (room, ws) => {
  const clients = getClients(room);

  return clients.includes(ws);
}

const joinRoom = (room, ws) => {
  // Cria uma nova sala se ela não existir
  if (!existsRoom(room)) {
    rooms.set(room, []);
  }

  if (checkUserInRoom(room, ws)) {
    throw new Error('Client already joined');
  }

  // Adiciona o cliente na sala
  rooms.get(room).push(ws);
  ws.room = room;
}

const deleteRoom = (room) => {
  rooms.delete(room);
}

const leaveRoom = (ws) => {
  const { room } = ws;

  if (room) {
    // Remove o cliente da sala
    const clients = getClients(room);
    clients.splice(clients.indexOf(ws), 1);

    // Remove a sala se não houver mais clientes
    if (clients.length === 0) {
      deleteRoom(room);
    }
  }
}

module.exports = {
  getRooms,
  existsRoom,
  getClients,
  joinRoom,
  leaveRoom,
  checkUserInRoom
};
