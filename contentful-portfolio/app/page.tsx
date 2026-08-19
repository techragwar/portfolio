export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-24">
        <div className="max-w-4xl">
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
            Software Engineer • AI Solutions Developer
          </p>

          <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Building modern digital products with{" "}
            <span className="text-blue-400">
              technology, data & AI.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
            I build modern web applications, AI-powered workflows, and
            data-driven solutions using React, Next.js, TypeScript, Python,
            Django, and PostgreSQL.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="rounded-full bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
            >
              View My Work
            </a>

            <a
              href="#contact"
              className="rounded-full border border-slate-700 px-6 py-3 font-semibold transition hover:bg-slate-900"
            >
              Contact Me
            </a>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="border-y border-slate-800 bg-slate-900 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Technology
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            My Technology Stack
          </h2>

          <div className="mt-8 flex flex-wrap gap-3">
            {[
              "React",
              "Next.js",
              "TypeScript",
              "JavaScript",
              "Tailwind CSS",
              "Python",
              "Django",
              "PostgreSQL",
              "Contentful",
              "AI",
            ].map((technology) => (
              <span
                key={technology}
                className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-300"
              >
                {technology}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section
        id="projects"
        className="bg-white py-24 text-slate-900"
      >
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Portfolio
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            Featured Projects
          </h2>

          <p className="mt-4 max-w-2xl text-slate-600">
            A selection of applications and digital solutions demonstrating
            my software engineering, data, and AI capabilities.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <ProjectCard
              title="AI Business Assistant"
              description="An AI-powered business workflow application designed to automate repetitive tasks and generate useful insights."
              technologies={["Next.js", "TypeScript", "AI"]}
            />

            <ProjectCard
              title="Investment Performance Dashboard"
              description="A data-driven dashboard for analyzing investment performance, portfolio information, and business metrics."
              technologies={["React", "Python", "PostgreSQL"]}
            />

            <ProjectCard
              title="Nonprofit Digital Platform"
              description="A modern nonprofit platform supporting content management, community engagement, and online donations."
              technologies={["Next.js", "Contentful", "Stripe"]}
            />
          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="bg-slate-100 py-24 text-slate-900"
      >
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              About
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              Technology with business context.
            </h2>
          </div>

          <div className="space-y-5 text-lg leading-8 text-slate-600">
            <p>
              My background combines software development, data analysis,
              investment management, banking, and business operations.
            </p>

            <p>
              I use that combination of technical and business experience to
              build applications that solve real problems and create measurable
              value.
            </p>

            <p>
              My current focus is modern web development, AI solutions,
              automation, and data-driven applications.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="bg-slate-950 py-24 text-white"
      >
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Contact
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            Let&apos;s build something useful.
          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Looking for a software engineer, web developer, or AI solutions
            developer? Let&apos;s talk about your project.
          </p>

          <a
            href="mailto:reggy.otieno@gmail.com"
            className="mt-8 inline-block rounded-full bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
          >
            Email Me
          </a>
        </div>
      </section>
    </main>
  );
}

function ProjectCard({
  title,
  description,
  technologies,
}: {
  title: string;
  description: string;
  technologies: string[];
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-600">
        &lt;/&gt;
      </div>

      <h3 className="text-xl font-bold">{title}</h3>

      <p className="mt-4 leading-7 text-slate-600">
        {description}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {technologies.map((technology) => (
          <span
            key={technology}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium"
          >
            {technology}
          </span>
        ))}
      </div>
    </article>
  );
}