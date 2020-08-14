function currentRoomId(state = null, action) {
  switch (action.type) {
    case "CREATE_ROOM":
      return `${action.room.id}`;

    case "ENTER_ROOM":
      return `${action.roomId}`;

    case "EXIT_CURRENT_ROOM":
      return null;

    default:
      return state;
  }
}

export default currentRoomId;
