import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-white"
        >
          Rosa Ragwar Tech
        </Link>

        <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link
            href="/"
            className="transition hover:text-white"
          >
            Home
          </Link>

          <Link
            href="/#projects"
            className="transition hover:text-white"
          >
            Projects
          </Link>

          <Link
            href="/#about"
            className="transition hover:text-white"
          >
            About
          </Link>

          <Link
            href="/blog"
            className="transition hover:text-white"
          >
            Blog
          </Link>

          <Link
            href="/stacks"
            className="transition hover:text-white"
          >
            Stacks
          </Link>

          <Link
            href="/#contact"
            className="rounded-full bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-500"
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}