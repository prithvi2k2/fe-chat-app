import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function App({ Component, pageProps }: AppProps) {
  const [parent, enableAnimations] = useAutoAnimate();
  return (
    <div ref={parent}>
      <Component {...pageProps} />
    </div>
  );
}
