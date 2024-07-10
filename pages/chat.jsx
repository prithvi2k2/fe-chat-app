import Chatbox from "@/components/Chatbox";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { socket } from "../socket";

export default function Chat() {
  const router = useRouter();
  const [sessions, setSessions] = useState([]); // Chat Sessions
  const [chatLog, setChatLog] = useState([]); // Chat Log
  const [activeSession, setActiveSession] = useState(0); // Highlight Session
  const [toggleSessions, setToggleSessions] = useState(false); // Show/Hide Session
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    function updateChatLog(sessionId, chatLog) {
      const updatedSessions = sessions.map((session) => {
        if (session.id == sessionId) {
          return { ...session, chat_log: chatLog };
        }
        return session;
      });
      setSessions(updatedSessions);
      console.log(updatedSessions);
      setChatLog(chatLog);
    }

    socket.on("message", updateChatLog);

    return () => {
      socket.off("message", updateChatLog);
    };
  }, [sessions]);

  const toggle = () => setToggleSessions(!toggleSessions);

  const createChatSession = async () => {
    // Create a new session
    const userId = jwtDecode(getCookie("jwt")).id;
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/chat-sessions/`, {
      method: "POST",
      body: JSON.stringify({
        data: { chat_log: [], users_permissions_user: userId },
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + getCookie("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        getChatSessions();
      })
      .catch((err) => console.log(err));
  };

  const openChatSession = (event) => {
    const id = event.target.id;
    setActiveSession(id);
    setChatLog(sessions.find((session) => session.id == id).chat_log);
  };

  // Retrieve chat sessions of the user
  async function getChatSessions() {
    await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me?populate[0]=chat_sessions`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + getCookie("jwt"),
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setSessions(Array.from(data.chat_sessions));
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    getChatSessions();
  }, []);

  const handleLogout = () => {
    deleteCookie("jwt");
    router.push("/");
  };

  return (
    <div className="flex flex-col w-screen h-dvh max-h-dvh">
      <nav className="p-1 flex flex-shrink-0 justify-between basis-16 bg-gray-200">
        <button
          className={"font-mono rounded-full outline-2 m-2 p-2 active:scale-90 bg-blue-500 " +
            (toggleSessions ? "" : "underline")}
          onClick={toggle}
        >
          {toggleSessions ? ">>" : "<<"} Sessions
        </button>
        {isConnected ? (
          <button
            title="Live WebSocket Connection"
            className="font-mono rounded-full outline-2 m-2 p-2 bg-green-500 cursor-default"
          >
            online
          </button>
        ) : (
          <button
            title="No WebSocket Connection"
            className="m-2 p-2 rounded-full bg-red-500 font-mono"
          >
            offline
          </button>
        )}
        <div>
          <button
            className="font-mono rounded-full m-2 p-2 active:scale-90 bg-orange-400"
            onClick={handleLogout}
          >
            LogOut
          </button>
        </div>
      </nav>
      <div className="flex basis-full flex-col sm:flex-row h-full overflow-auto">
        {/* Chat Session History */}
        <div
          className={
            "basis-1/4 outline outline-1 outline-gray-500 flex flex-col justify-end flex-grow-0 bg-gray-300 " +
            (toggleSessions ? "hidden" : "")
          }
        >
          <ul className="flex flex-col-reverse overflow-y-auto">
            {sessions.map((session) => (
              <li
                key={session.id}
                id={session.id}
                className={
                  "p-3 outline outline-1 flex-shrink-0 flex-grow-0 text-center content-center cursor-pointer " +
                  (activeSession == session.id ? "text-green-400 bg-black sticky justify-self-end" : "")
                }
                onClick={openChatSession}
              >
                Session-{session.id}
                {/* {session.updatedAt} */}
              </li>
            ))}
            <span></span>
            <span></span>
          </ul>
          <span
            className={
              "sticky bottom-0 p-3 underline outline outline-1  text-center content-center cursor-pointer bg-slate-800 text-white text-xl outline-white active:bg-black"
            }
            onClick={createChatSession}
          >
            New Session?
          </span>
          {!toggleSessions ? <span className="text-center sm:hidden">HIDE SESSIONS to chat</span> : null}
        </div>
        {/* Chatbox */}
        <div
          className={
            "basis-full outline outline-1 outline-gray-500 sm:block " +
            (toggleSessions ? "block" : "hidden")
          }
        >
          <Chatbox chatLog={chatLog} sessionId={activeSession} />
        </div>
      </div>
    </div>
  );
}
