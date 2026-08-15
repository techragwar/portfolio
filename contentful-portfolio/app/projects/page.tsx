import Link from "next/link";
import { projects } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Link
          href="/"
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          ← Back to Home
        </Link>

        <div className="mt-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
            Portfolio
          </p>

          <h1 className="mt-4 text-5xl font-bold">
            Featured Projects
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            A selection of applications and digital solutions I've
            designed and developed.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.slug}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-8 transition hover:border-blue-500/50"
            >
              <span className="text-sm text-blue-500">
                {project.number}
              </span>

              <h2 className="mt-4 text-2xl font-bold">
                {project.title}
              </h2>

              <p className="mt-4 leading-7 text-slate-300">
                {project.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
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
                className="mt-8 inline-block font-semibold text-blue-400 hover:text-blue-300"
              >
                View Project →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}