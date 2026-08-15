export default function Hero() {
  return (
    <section className="mx-auto flex min-h-[650px] max-w-6xl items-center px-6 py-24">
      <div className="max-w-4xl">
        <p className="mb-4 text-lg font-medium text-blue-400">
          Software Engineer & AI Consultant
        </p>

        <h1 className="text-5xl font-bold leading-tight md:text-7xl">
          I build modern web applications and AI-powered solutions.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          I combine software engineering, data analysis, business experience,
          and modern web technologies to build useful digital products.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
          >
            View My Work
          </a>

          <a
            href="#contact"
            className="rounded-lg border border-slate-700 px-6 py-3 font-semibold hover:bg-slate-900"
          >
            Let's Work Together
          </a>
        </div>
      </div>
    </section>
  );
}