import Peer from "peerjs";
import { feather } from "./feather";

const PROTOCOL = process.env.NODE_ENV === "production" ? "https" : "http";
const HOST =
  process.env.NODE_ENV === "production"
    ? "openhouse-server.herokuapp.com"
    : "localhost";
const PORT = process.env.NODE_ENV === "production" ? 443 : 9000;
const POST_OPTIONS = {
  method: "POST",
  headers: { "Content-Type": "application/json" }
};

var peerConnections = {};
var self = null;

const getUserMedia =
  navigator.mediaDevices.getUserMedia ||
  navigator.mediaDevices.webkitGetUserMedia ||
  navigator.mediaDevices.mozGetUserMedia;

const create = () => {
  if (!self || !self.id) return;
  return _sendRequest(`/rooms`, POST_OPTIONS);
};

const enter = roomId => {
  if (!self || !self.id) return;
  return _sendRequest(`/rooms/${roomId}/enter`, POST_OPTIONS)
    .then(room => callPeersInRoom(room))
    .catch(Promise.reject);
};

const exitCurrent = () => {
  if (!self || !self.id) return;
  return _sendRequest(`/rooms/current/exit`, POST_OPTIONS);
};

const list = () => {
  return _sendRequest(`/rooms`);
};

const connect = () => {
  if (self) return;
  feather
    .currentUser()
    .then(u => {
      if (!u) return;
      self = new Peer(u.id, {
        host: HOST,
        port: PORT,
        path: "/peerjs",
        secure: PROTOCOL === "https",
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
      self.on("open", id => console.log("Connected as " + id));
      self.on("error", err => console.log("Failed to connect ", err)); // TODO handle ID-TAKEN error ("already connected elsewhere")
      self.on("call", onCall);
    })
    .catch(Promise.reject);
};

const callPeersInRoom = room => {
  return getUserMedia({ video: false, audio: true })
    .then(stream => {
      for (const peerId in room.peers) {
        if (peerId !== self.id) {
          var call = self.call(peerId, stream);
          call.on("stream", remoteStream => playStream(remoteStream));
          // peerConnections[peerId] =
        }
      }
      return room;
    })
    .catch(Promise.reject);
};

const onCall = call => {
  // TODO check if you want to accept this call
  getUserMedia({ video: false, audio: true })
    .then(stream => {
      call.answer(stream); // Answer the call with an A/V stream.
      call.on("stream", remoteStream => playStream(remoteStream));
    })
    .catch(Promise.reject);
};

const playStream = stream => {
  var audio = document.querySelector("audio");
  // window.stream = stream; // make variable available to browser console
  audio.srcObject = stream;
  audio.play();
};

const _getURL = path => {
  return `${PROTOCOL}://${HOST}:${PORT}${path}`;
};

const _sendRequest = (path, options) => {
  options = options ? options : {};
  options.headers = options.headers ? options.headers : {};
  return feather
    .currentUser()
    .then(currentUser => {
      options.headers.Authorization = `Bearer ` + currentUser.tokens.idToken;
      return fetch(_getURL(path), options);
    })
    .then(resp => resp.json())
    .catch(e => Promise.reject(e));
};

export const roomsAPI = {
  connect,
  create,
  enter,
  exitCurrent,
  list
};
