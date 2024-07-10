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

  const submitChat = (e) => {
    e.preventDefault();
    if (chatInput.trim() == "") return;
    socket.emit("message", sessionId, chatInput, chatLog);
    setChatInput("");
  };

  return (
    <div className="flex flex-col bg-slate-300 flex-grow h-full">
      {/* CHAT LOG DISPLAY */}
      <div ref={scrollRef} className="basis-full flex flex-col overflow-y-auto flex-grow-1">
        {sessionId == 0 ? <span className="text-center">select a SESSION to chat</span> : null}
        {chatLog.length == 0 && sessionId>0 ? <span className="text-center">so Empty... Start chatting</span> : null}

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
      <form onSubmit={submitChat} className="flex bg-slate-300 sticky p-3 gap-2 bottom-0">
        <input
          type="text"
          className="basis-5/6 rounded-full outline outline-2 outline-cyan-300 p-2 text-lg text-ellipsis"
          placeholder="Enter a message..."
          onChange={(e) => setChatInput(e.target.value)}
          value={chatInput}
          disabled={sessionId == 0 ? true : false}
        />
        <input
          type="submit"
          value=">>>"
          title="send"
          className="basis-1/6 font-mono rounded-full outline-2 p-2 outline-dotted active:scale-90 bg-green-500"
          disabled={sessionId == 0 ? true : false}
        />
      </form>
    </div>
  );
}
