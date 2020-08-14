import React, { useLayoutEffect } from "react";
import { AuthenticationForm, useCurrentUser } from "feather-client-react";
import Rooms from "./Rooms";
import { roomsAPI } from "./apis";
import "./App.css";

function App() {
  const { currentUser, loading } = useCurrentUser();

  useLayoutEffect(() => {
    if (currentUser) roomsAPI.connect();
  });

  if (loading) return null;
  if (!currentUser) return <AuthenticationForm />;

  return (
    <div className="App">
      <audio id="gum-local"></audio>
      <h1>PeerJS Demo</h1>
      <Rooms />
    </div>
  );
}

export default App;
