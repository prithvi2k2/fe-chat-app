import { useState } from "react";
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/router'

export default function Register() {
  const router = useRouter()
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setStatusMsg("Registering...");
    await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/local/register`,
      {
        method: "POST",
        body: JSON.stringify({
          email: email,
          username: username,
          password: password,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + process.env.NEXT_PUBLIC_API_TOKEN,
        },
      }
    )
    .then((response) => response.json())
    .then((data) => {
      if (data.error){
        console.log(data.error.message);
        setStatusMsg(
          `${data.error.status} ${data.error.name} : ${data.error.message}`
        );
        }
        else{
          const config = {
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
          };
          setCookie('jwt', data.jwt, config);
          router.push('/chat');
          console.log("SUCCESS");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <input
            type="email"
            id="email"
            value={email}
            required
            placeholder="Email"
            className="p-2 rounded-xl text-black"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            id="username"
            value={username}
            required
            placeholder="Username"
            className="p-2 rounded-xl text-black"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            id="password"
            value={password}
            required
            placeholder="Password"
            className="p-2 rounded-xl text-black"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <input
          type="submit"
          className="text-white border-green-400 rounded-xl bg-green-500 p-3"
        />
      </form>
      {statusMsg != null ? <span>{statusMsg}</span> : null}
    </div>
  );
}
