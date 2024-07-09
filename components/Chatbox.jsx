import { useRef, useEffect, useState } from "react";
import { socket } from "../socket";

export default function Chatbox({ chatLog, sessionId }) {
  const [chatInput, setChatInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatLog]);

  const submitChat = () => {
    if (chatInput.trim() == "") return;
    socket.emit("message", sessionId, chatInput, chatLog);
    setChatInput("");
  };

  return (
    <div className="flex flex-col bg-slate-300 h-full">
      {/* CHAT LOG DISPLAY */}
      <div ref={scrollRef} className="basis-11/12 flex flex-col overflow-y-auto">
        {sessionId == 0 ? <span className="text-center">select a SESSION to start</span> : null}
        {/* After receiving msg acknowledgement from server, log is updated */}
        {chatLog.map((chatItem, id) => (
          <span key={id} className="flex flex-col-reverse">
            <span className="bg-gray-500 text-white m-2 p-2 rounded-full max-w-max">
              {chatItem}
            </span>
            <span className="bg-cyan-400 m-2 p-2 rounded-full max-w-max ml-auto">
              {chatItem}
            </span>
          </span>
        ))}
      </div>
      {/* CHAT TEXT INPUT */}
      <div className="basis-1/12 flex sticky bottom-0 bg-slate-300">
        <input
          type="text"
          className="basis-5/6 rounded-full outline outline-2 outline-cyan-300 m-1 p-5 text-lg text-ellipsis"
          placeholder="Enter a message..."
          onChange={(e) => setChatInput(e.target.value)}
          value={chatInput}
          disabled={sessionId == 0 ? true : false}
        />
        <button
          onClick={submitChat}
          className="basis-1/6 font-mono rounded-full outline-2 outline-dotted m-2 p-2 active:scale-90 bg-green-500"
          disabled={sessionId == 0 ? true : false}
        >
          SEND
        </button>
      </div>
    </div>
  );
}
