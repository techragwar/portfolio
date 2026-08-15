import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { slug } = await params;

  const project = projects.find(
    (project) => project.slug === slug
  );

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <Link
          href="/projects"
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          ← All Projects
        </Link>

        <div className="mt-12">
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-500">
            {project.category}
          </span>

          <h1 className="mt-5 text-5xl font-bold">
            {project.title}
          </h1>

          <p className="mt-8 text-xl leading-9 text-slate-300">
            {project.description}
          </p>
        </div>

        <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-2xl font-bold">
            About the Project
          </h2>

          <p className="mt-5 leading-8 text-slate-300">
            {project.longDescription}
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-2xl font-bold">
            Technologies
          </h2>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.technologies.map((technology) => (
              <span
                key={technology}
                className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300"
              >
                {technology}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <Link
            href="/#contact"
            className="inline-flex rounded-lg bg-blue-600 px-7 py-3.5 font-semibold hover:bg-blue-500"
          >
            Discuss a Similar Project
          </Link>
        </div>
      </div>
    </main>
  );
}