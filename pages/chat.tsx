import Chatbox from "@/components/Chatbox";

export default function Chat() {
  return (
    <div className="flex flex-col w-screen h-screen">
      <nav className="h-8 flex flex-grow-0 justify-between basis-16">
        <button className="font-mono rounded-full outline-2 m-2 p-2 active:scale-90 bg-blue-500">
          {true ? "Hide" : "Show"} Sessions
        </button>
        <div>
          {/* Username */}
          <button className="font-mono rounded-full outline-2 m-2 p-2 active:scale-90 bg-orange-400">
            LOGOUT?
          </button>
        </div>
      </nav>
      <div className="flex basis-full">
        {/* Chat Session History */}
        <div className="basis-1/4 outline outline-1 outline-gray-500 flex flex-col-reverse justify-end overflow-auto">
          <span className="basis-1/6 outline outline-1 flex-shrink-0">1</span>
          <span className="basis-1/6 outline outline-1 flex-shrink-0">2</span>
          
        </div>
        {/* Chatbox */}
        <div className="basis-full outline outline-1 outline-gray-500">
          <Chatbox />
        </div>
      </div>
    </div>
  );
}
