export default function Navbar() {
  return (
    <header className="border-b border-slate-800">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a href="/" className="text-xl font-bold">
          Dan Otieno
        </a>

        <div className="hidden gap-8 md:flex">
          <a href="#about" className="text-slate-300 hover:text-white">
            About
          </a>

          <a href="#skills" className="text-slate-300 hover:text-white">
            Skills
          </a>

          <a href="#projects" className="text-slate-300 hover:text-white">
            Projects
          </a>

          <a href="#services" className="text-slate-300 hover:text-white">
            Services
          </a>

          <a href="#contact" className="text-slate-300 hover:text-white">
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}