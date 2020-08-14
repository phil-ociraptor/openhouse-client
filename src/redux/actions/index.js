export function createRoom(room) {
  return { type: "CREATE_ROOM", room };
}

export function enterRoom(roomId) {
  return { type: "ENTER_ROOM", roomId };
}

export function exitCurrentRoom() {
  return { type: "EXIT_CURRENT_ROOM" };
}

export function listRooms(rooms) {
  return { type: "LIST_ROOMS", rooms };
}
