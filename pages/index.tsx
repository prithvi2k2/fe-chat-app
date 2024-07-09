import { Inter } from "next/font/google";
import Auth from "@/components/Auth";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-around`}
    >
      <main className="text-2xl mt-16">_/ Server Chat \_</main>
      <Auth />
      <footer className="text-xs mb-16">Built for Ayna assignment</footer>
    </div>
  );
}
