const projects = [
  {
    title: "AI Consultant Platform",
    description:
      "A modern platform for showcasing AI consulting services and solutions.",
  },
  {
    title: "Nonprofit Platform",
    description:
      "A full-stack nonprofit website with content management and donation capabilities.",
  },
  {
    title: "News Aggregator",
    description:
      "A web application that collects and presents news through external APIs.",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold md:text-4xl">
          Featured Projects
        </h2>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.title}
              className="rounded-xl border border-slate-800 bg-slate-900 p-6"
            >
              <h3 className="text-xl font-bold">
                {project.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-300">
                {project.description}
              </p>

              <a
                href="#contact"
                className="mt-6 inline-block font-semibold text-blue-400 hover:text-blue-300"
              >
                View Project →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}