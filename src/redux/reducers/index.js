import { combineReducers } from "redux";
import currentRoomId from "./currentRoomId.js";
import rooms from "./rooms.js";

export default combineReducers({
  currentRoomId,
  rooms
});
