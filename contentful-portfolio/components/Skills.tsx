const skills = [
  "Next.js",
  "React",
  "TypeScript",
  "JavaScript",
  "Angular",
  "Tailwind CSS",
  "Python",
  "Django",
  "Node.js",
  "PostgreSQL",
  "REST APIs",
  "Git & GitHub",
  "Contentful",
  "Sanity",
  "AI Integration",
  "Responsive Design",
];

export default function Skills() {
  return (
    <section
      id="skills"
      className="border-y border-slate-800 bg-slate-900/50 py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
          Technology
        </p>

        <h2 className="mt-4 text-4xl font-bold">
          My Technical Stack
        </h2>

        <div className="mt-10 flex flex-wrap gap-3">
          {skills.map((skill) => (
            <div
              key={skill}
              className="rounded-lg border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-blue-500 hover:text-blue-400"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}