export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-[720px] max-w-6xl items-center px-6 py-24">
        <div className="max-w-4xl">
          <div className="mb-6 inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            Available for software & consulting opportunities
          </div>

          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Software Engineer
            <span className="block text-blue-500">
              & AI Consultant
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
            I build modern web applications, AI-powered solutions, and
            digital experiences that help organizations solve real
            business problems.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="rounded-lg bg-blue-600 px-7 py-3.5 font-semibold transition hover:bg-blue-500"
            >
              View My Work
            </a>

            <a
              href="#contact"
              className="rounded-lg border border-slate-700 px-7 py-3.5 font-semibold transition hover:border-slate-500 hover:bg-slate-900"
            >
              Let's Work Together
            </a>
          </div>

          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-400">
            <span>Next.js</span>
            <span>React</span>
            <span>TypeScript</span>
            <span>Python</span>
            <span>AI</span>
          </div>
        </div>
      </div>
    </section>
  );
}