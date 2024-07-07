export default function Chatbox() {
  return (
    <div className="flex flex-col h-full bg-slate-300">
      {/* CHAT LOG DISPLAY */}
      <div className="basis-full flex flex-col-reverse">
        <span className="bg-gray-500 text-white m-2 p-2 rounded-full max-w-max">
          Server Msg
        </span>
        <span className="bg-cyan-400 m-2 p-2 rounded-full max-w-max ml-auto">
          User Msg
        </span>
      </div>
      {/* CHAT TEXT INPUT */}
      <div className="basis-1/12 flex">
        <input
          type="text"
          className="basis-5/6 rounded-full outline outline-2 outline-cyan-300 m-1 p-5 text-lg text-ellipsis"
          placeholder="Enter a message..."
        />
        <button className="basis-1/6 font-mono rounded-full outline-2 outline-dotted m-2 p-2 active:scale-90 bg-green-500">
          SEND
        </button>
      </div>
    </div>
  );
}
