export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="/"
          className="text-xl font-bold tracking-tight"
        >
          Dan Otieno<span className="text-blue-500">.</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#about"
            className="text-sm text-slate-300 transition hover:text-white"
          >
            About
          </a>

          <a
            href="#skills"
            className="text-sm text-slate-300 transition hover:text-white"
          >
            Skills
          </a>

          <a
            href="#projects"
            className="text-sm text-slate-300 transition hover:text-white"
          >
            Projects
          </a>

          <a
            href="#services"
            className="text-sm text-slate-300 transition hover:text-white"
          >
            Services
          </a>

          <a
            href="#contact"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium transition hover:border-blue-500 hover:text-blue-400"
          >
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}