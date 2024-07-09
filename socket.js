import { io } from "socket.io-client";
import { getCookie } from "cookies-next";

const isBrowser = typeof window !== "undefined";

export const socket = isBrowser
  ? io(process.env.NEXT_PUBLIC_SERVER_URL, {
      auth: {
        strategy: "jwt",
        token: getCookie("jwt"),
      },
    })
  : {};
