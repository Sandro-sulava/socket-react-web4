import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

export default function Rooms() {
  const [room, setRoom] = useState("");
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("recive_message", (data) => {
      setMessages((prev) => [...prev, { message: data.message, self: false }]);

      return () => {
        socket.off("recive_message");
      };
    });
  }, []);

  const joinRoom = () => {
    if (room.trim()) {
      socket.emit("join_room", room);
    }
  };

  const sendMessage = () => {
    if (msg.trim()) {
      const messageData = { room, message: msg };

      socket.emit("sent_message", messageData);

      setMessages((prev) => [...prev, { message: msg, self: true }]);
      setMsg("");
    }
  };

  return (
    <div className="bg-white mx-auto shadow p-4 rounded-lg w-80">
      <h2 className="font-semibold mb-2">Room Chat</h2>

      <input
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        placeholder="Room number"
        className="border p-2 w-full mb-2 rounded"
      />
      <button
        onClick={joinRoom}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-3 w-full"
      >
        Join Room
      </button>

      <div className="h-40 overflow-y-auto border mb-2 p-2 rounded">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-sm">No messages yet</p>
        ) : (
          messages.map((m, i) => (
            <p
              key={i}
              className={m.self ? "text-right text-blue-600" : "text-left"}
            >
              {m.message}
            </p>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Message..."
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
