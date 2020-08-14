import Peer from "peerjs";

const PROTOCOL = "https";
const HOST = "1c5edb1e7e21.ngrok.io";
const PORT = 443;

// var peers = {}; // keep track of our peer connections, indexed by peer_id (aka socket.io id)
var peer = null;

const getUserMedia =
  navigator.mediaDevices.getUserMedia ||
  navigator.mediaDevices.webkitGetUserMedia ||
  navigator.mediaDevices.mozGetUserMedia;

const getURL = path => {
  return `${PROTOCOL}://${HOST}:${PORT}${path}`;
};

const create = () => {
  if (!peer || !peer.id) return;
  return fetch(getURL("/rooms"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ peerId: peer.id })
  })
    .then(resp => resp.json())
    .catch(Promise.reject);
};

const enter = roomId => {
  if (!peer || !peer.id) return;
  return fetch(getURL(`/rooms/${roomId}/enter`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ peerId: peer.id })
  })
    .then(resp => resp.json())
    .then(room => callPeersInRoom(room))
    .catch(Promise.reject);
};

const exitCurrent = () => {
  if (!peer || !peer.id) return;
  return fetch(getURL(`/rooms/current/exit`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ peerId: peer.id })
  })
    .then(resp => resp.json())
    .catch(Promise.reject);
};

const list = () => {
  return fetch(getURL(`/rooms`))
    .then(resp => resp.json())
    .catch(Promise.reject);
};

const connect = () => {
  if (peer) return;

  peer = new Peer({
    host: HOST,
    port: PORT,
    path: "/peerjs",
    config: {
      iceServers: [
        { url: "stun:stun01.sipphone.com" },
        { url: "stun:stun.ekiga.net" },
        { url: "stun:stunserver.org" },
        { url: "stun:stun.softjoys.com" },
        { url: "stun:stun.voiparound.com" },
        { url: "stun:stun.voipbuster.com" },
        { url: "stun:stun.voipstunt.com" },
        { url: "stun:stun.voxgratia.org" },
        { url: "stun:stun.xten.com" },
        {
          url: "turn:192.158.29.39:3478?transport=udp",
          credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
          username: "28224511:1379330808"
        },
        {
          url: "turn:192.158.29.39:3478?transport=tcp",
          credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
          username: "28224511:1379330808"
        }
      ]
    },
    debug: 3
  });

  peer.on("open", id => {
    console.log("Connected as peer " + id);
  });

  peer.on("call", call => {
    // TODO check if you want to accept this call
    getUserMedia({ video: false, audio: true })
      .then(stream => {
        call.answer(stream); // Answer the call with an A/V stream.
        call.on("stream", remoteStream => {
          // TODO Show stream in some video/canvas element
          var audio = document.querySelector("audio");
          window.stream = remoteStream; // make variable available to browser console
          audio.srcObject = remoteStream;
          audio.play();
        });
      })
      .catch(Promise.reject);
  });
};

const callPeersInRoom = room => {
  return getUserMedia({ video: false, audio: true })
    .then(stream => {
      for (const peerId in room.peers) {
        if (peerId !== peer.id) {
          var call = peer.call(peerId, stream);
          call.on("stream", remoteStream => {
            // TODO show stream in some video/canvas element
            // Retrieve the audio element according to the desired
            var audio = document.querySelector("audio");
            window.stream = remoteStream; // make variable available to browser console
            audio.srcObject = remoteStream;
            audio.play();
          });
        }
      }
      return room;
    })
    .catch(Promise.reject);
};

export const roomsAPI = {
  connect,
  create,
  enter,
  exitCurrent,
  list
};
