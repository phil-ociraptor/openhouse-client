function rooms(state = {}, action) {
  switch (action.type) {
    case "CREATE_ROOM":
      var newState = { ...state };
      newState[action.room.id] = action.room;
      return newState;

    case "LIST_ROOMS":
      return { ...action.rooms };

    default:
      return { ...state };
  }
}

export default rooms;
