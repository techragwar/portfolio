const projects = [
  {
    number: "01",
    title: "AI Consultant Platform",
    description:
      "A professional platform for presenting AI consulting services, solutions, and business automation strategies.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "AI"],
  },
  {
    number: "02",
    title: "Nonprofit Digital Platform",
    description:
      "A modern nonprofit platform designed to manage content, communicate impact, and support online donations.",
    technologies: ["Next.js", "Contentful", "Stripe", "PostgreSQL"],
  },
  {
    number: "03",
    title: "News Aggregator",
    description:
      "A full-stack application that retrieves news from external APIs and presents it through a responsive interface.",
    technologies: ["React", "Python", "Django", "PostgreSQL"],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
          Selected Work
        </p>

        <h2 className="mt-4 text-4xl font-bold">
          Featured Projects
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.number}
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-500/50"
            >
              <div className="text-sm font-medium text-blue-500">
                {project.number}
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                {project.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-300">
                {project.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {project.technologies.map((technology) => (
                  <span
                    key={technology}
                    className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300"
                  >
                    {technology}
                  </span>
                ))}
              </div>

              <a
                href="#contact"
                className="mt-8 inline-block font-semibold text-blue-400 transition group-hover:text-blue-300"
              >
                Learn More →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}