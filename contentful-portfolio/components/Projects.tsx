import Link from "next/link";
import { projects } from "@/data/projects";

export default function Projects() {
  return (
    <section id="projects" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
              Selected Work
            </p>

            <h2 className="mt-4 text-4xl font-bold">
              Featured Projects
            </h2>
          </div>

          <Link
            href="/projects"
            className="hidden text-sm font-semibold text-blue-400 hover:text-blue-300 md:block"
          >
            View All Projects →
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.slug}
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

              <Link
                href={`/projects/${project.slug}`}
                className="mt-8 inline-block font-semibold text-blue-400 transition group-hover:text-blue-300"
              >
                View Project →
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-8 md:hidden">
          <Link
            href="/projects"
            className="font-semibold text-blue-400"
          >
            View All Projects →
          </Link>
        </div>
      </div>
    </section>
  );
}