import React, { useLayoutEffect } from "react";
import { roomsAPI } from "./apis";
import { useDispatch, useSelector } from "react-redux";
import { createRoom, enterRoom, listRooms } from "./redux/actions";
import Room from "./Room";

function Rooms() {
  const dispatch = useDispatch();
  const rooms = useSelector(state => state.rooms);
  const currentRoomId = useSelector(state => state.currentRoomId);

  useLayoutEffect(() => {
    roomsAPI
      .list()
      .then(r => dispatch(listRooms(r)))
      .catch(console.log);
  }, [dispatch]);

  const onClickCreateRoom = e => {
    e.preventDefault();
    roomsAPI
      .create()
      .then(r => dispatch(createRoom(r)))
      .catch(console.log);
  };

  const onClickEnterRoom = e => {
    e.preventDefault();
    roomsAPI
      .enter(e.target.name)
      .then(r => dispatch(enterRoom(r.id)))
      .catch(console.log);
  };

  if (currentRoomId) return <Room />;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "400px"
      }}
    >
      <button onClick={onClickCreateRoom}>Create room</button>
      {Object.values(rooms).length === 0 ? (
        <p>No rooms</p>
      ) : (
        Object.values(rooms).map(room => (
          <button key={room.id} name={room.id} onClick={onClickEnterRoom}>
            {room.id}
          </button>
        ))
      )}
    </div>
  );
}

export default Rooms;
