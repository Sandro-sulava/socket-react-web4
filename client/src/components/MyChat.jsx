import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function MyChat() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [input, setInput] = useState("");
  const [usernameSet, setUsernameSet] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("main message", (data) => {
      setMessages((prev) => [...prev, data]);
      console.log(data);
    });

    return () => socket.off("main message");
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!usernameSet) return alert("Please set username first!");
    if (!input.trim()) return;

    console.log(e);
    console.log("this is message:", input);

    console.log("this is username:", username);

    socket.emit("chat message", { msg: input, username });

    setInput("");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-xl shadow-lg bg-white">
      {/* Username input */}
      {!usernameSet && (
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Enter username..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => {
              if (username.trim()) setUsernameSet(true);
            }}
          >
            Set Username
          </button>
        </div>
      )}

      {/* Messages container */}
      <div className="min-h-75 max-h-75 overflow-y-auto mb-4 flex flex-col gap-2">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet</p>
        ) : (
          messages.map((m, idx) => {
            const isOwn = m.id === socket.id;
            return (
              <div
                key={idx}
                className={`flex flex-col ${
                  isOwn ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[70%] wrap-break-word ${
                    isOwn
                      ? "bg-blue-200 text-gray-900"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  <strong>{m.username}</strong>: {m.msg}
                  <span className="text-xs text-gray-500 ml-2">
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      {usernameSet && (
        <form className="flex gap-2" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
}
