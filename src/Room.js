import React from "react";
import { roomsAPI } from "./apis";
import { useDispatch, useSelector } from "react-redux";
import { exitCurrentRoom } from "./redux/actions";

function Room(props) {
  const dispatch = useDispatch();
  const rooms = useSelector(state => state.rooms);
  const currentRoomId = useSelector(state => state.currentRoomId);
  const currentRoom = rooms[currentRoomId];

  const onClickExit = e => {
    e.preventDefault();
    roomsAPI.exitCurrent().then(() => dispatch(exitCurrentRoom()));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "400px"
      }}
    >
      Current room
      <p>Current room: {currentRoomId}</p>
      <button onClick={onClickExit}>Exit</button>
    </div>
  );
}

export default Room;
