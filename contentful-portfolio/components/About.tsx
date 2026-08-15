export default function About() {
  return (
    <section
      id="about"
      className="border-t border-slate-800 py-24"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
            About Me
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight">
            Technology meets business.
          </h2>
        </div>

        <div className="space-y-6 text-lg leading-8 text-slate-300">
          <p>
            I bring together software engineering, business analysis,
            data, and financial industry experience to build practical
            technology solutions.
          </p>

          <p>
            My current focus is modern web development with Next.js,
            React, TypeScript, Python, and AI technologies.
          </p>

          <p>
            I enjoy turning complex business requirements into
            simple, useful digital products.
          </p>
        </div>
      </div>
    </section>
  );
}