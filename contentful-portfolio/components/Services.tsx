const services = [
  {
    title: "Web Development",
    description:
      "Modern, responsive websites and applications built with Next.js, React, TypeScript, and Tailwind CSS.",
  },
  {
    title: "AI Solutions",
    description:
      "AI-powered tools and workflows designed to automate repetitive tasks and improve business productivity.",
  },
  {
    title: "Technology Consulting",
    description:
      "Practical technology guidance for businesses looking to modernize their digital operations.",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="border-t border-slate-800 bg-slate-900/50 py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
          What I Do
        </p>

        <h2 className="mt-4 text-4xl font-bold">
          Services
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-2xl border border-slate-800 bg-slate-950 p-7"
            >
              <h3 className="text-xl font-bold">
                {service.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-300">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}