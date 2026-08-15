const skills = [
  "Next.js",
  "React",
  "TypeScript",
  "JavaScript",
  "Angular",
  "Tailwind CSS",
  "Python",
  "Django",
  "PostgreSQL",
  "Node.js",
  "Git & GitHub",
  "AI Solutions",
];

export default function Skills() {
  return (
    <section id="skills" className="bg-slate-900 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold md:text-4xl">
          Skills
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {skills.map((skill) => (
            <div
              key={skill}
              className="rounded-lg border border-slate-700 bg-slate-950 p-5"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}