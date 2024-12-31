
import Image from "next/image";
import Link from "next/link";
import logo from "../public/logo.svg";
import GithubIcon from "./github-icon";

export default function Header() {
  return (
    <header className="relative z-10 mx-auto mt-5 flex w-full max-w-7xl items-center justify-between px-6 pb-7">
      <Link href="/" className="flex items-center gap-3">
        <Image alt="logo" src={logo} className="h-8 w-8" priority />
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-blue-400">Gemini</span>Coder
        </h1>
      </Link>
      <div className="flex items-center gap-4">
        <a
          href="https://github.com/osanseviero/geminicoder"
          target="_blank"
          className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm text-gray-300 transition hover:bg-gray-700"
        >
          <GithubIcon className="h-5 w-5" />
          <span>GitHub</span>
        </a>
      </div>
    </header>
  );
}
