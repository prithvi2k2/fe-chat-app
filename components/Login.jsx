import { useState } from "react";
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMsg("Logging in...");
    await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/local/`,
      {
        method: "POST",
        body: JSON.stringify({
          identifier: email,
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
      <form onSubmit={handleSubmit} className="flex flex-col p-2 gap-4">
          <input
            type="email"
            id="email"
            value={email}
            required
            placeholder="Email"
            className="p-2 rounded-full outline outline-1"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            id="password"
            value={password}
            required
            placeholder="Password"
            className="p-2 rounded-full outline outline-1"
            onChange={(e) => setPassword(e.target.value)}
          />
        <input
          type="submit"
          className="text-white rounded-full bg-green-500 p-3"
        />
      </form>
      {statusMsg != null ? <span className="flex justify-center">{statusMsg}</span> : null}
    </div>
  );
}
