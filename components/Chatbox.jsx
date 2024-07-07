import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";

export default function Chatbox({ chatLog, sessionId }) {
  const [chatInput, setChatInput] = useState("");
  const [chatLogg, setChatLogg] = useState([]);

  useEffect(() => {
    setChatLogg(chatLog);
  }, [chatLog]);

  const submitChat = () => {
    if(chatInput.trim()=='') return;
    const newChatLogg = [...chatLogg, chatInput];
    setChatLogg(newChatLogg);
    setChatInput("");
    if (sessionId != 0)
      fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chat-sessions/${sessionId}`,
    {
          method: "PUT",
          body: JSON.stringify({
            data: { chat_log: newChatLogg },
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: "Bearer " + getCookie("jwt"),
          },
        }
      )
      .then((response) => response.json())
      .then((data) => {
          // console.log(data);
        })
        .catch((err) => console.log(err));
  };

  return (
    <div className="flex flex-col bg-slate-300 h-full m-auto">
      {/* CHAT LOG DISPLAY */}
      <div className="basis-11/12 flex flex-col ">
        {chatLogg.map((chatItem, id) => (
          <div key={id} className="flex flex-col-reverse">
            <span className="bg-gray-500 text-white m-2 p-2 rounded-full max-w-max">
              {chatItem}
            </span>
            <span className="bg-cyan-400 m-2 p-2 rounded-full max-w-max ml-auto">
              {chatItem}
            </span>
          </div>
        ))}
      </div>
      {/* CHAT TEXT INPUT */}
      <div className="basis-1/12 flex sticky bottom-0">
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
