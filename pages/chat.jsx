import Chatbox from "@/components/Chatbox";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function Chat() {
  const router = useRouter();
  const [sessions, setSessions] = useState([]); // Chat Sessions
  const [chatLog, setChatLog] = useState([]); // Chat Log
  const [activeSession, setActiveSession] = useState(0); // Highlight Session
  const [toggleSessions, setToggleSessions] = useState(false); // Show/Hide Session 

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
        console.log(data);
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
    <div className="flex flex-col w-screen h-screen max-h-screen">
      <nav className="h-8 flex flex-shrink-0 justify-between basis-16 bg-gray-300">
        <button
          className="font-mono rounded-full outline-2 m-2 p-2 active:scale-90 bg-blue-500"
          onClick={toggle}
        >
          {toggleSessions ? ">>Show" : "<<Hide"} Sessions
        </button>
        <div>
          {/* Username */}
          <button
            className="font-mono rounded-full outline-2 m-2 p-2 active:scale-90 bg-orange-400"
            onClick={handleLogout}
          >
            LOGOUT?
          </button>
        </div>
      </nav>
      <div className="flex basis-full flex-col sm:flex-row">
        {/* Chat Session History */}
        <div
          className={
            "basis-1/4 outline outline-1 outline-gray-500 flex flex-col justify-end flex-grow-0 bg-gray-300 " +
            (toggleSessions ? "hidden" : "")
          }
        >
          <ul className="flex flex-col h-auto">
            <li
              key={0}
              id={0}
              className={
                "sticky top-0 p-3 underline outline outline-1  text-center content-center cursor-pointer bg-slate-800 text-white text-xl outline-white active:bg-black"
              }
              onClick={createChatSession}
            >
              New Session?
            </li>
            {sessions.map((session) => (
              <li
                key={session.id}
                id={session.id}
                className={
                  "p-3 outline outline-1 flex-shrink-0 flex-grow-0 text-center content-center cursor-pointer " +
                  (activeSession == session.id ? "text-green-400 bg-black" : "")
                }
                onClick={openChatSession}
              >
                Session-{session.id}
                {/* {session.updatedAt} */}
              </li>
            ))}
          </ul>
        </div>
        {/* Chatbox */}
        <div className="basis-full outline outline-1 outline-gray-500 max-h-100% flex-grow-0">
          <Chatbox chatLog={chatLog} sessionId={activeSession} />
        </div>
      </div>
    </div>
  );
}
