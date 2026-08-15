const services = [
  {
    title: "Web Development",
    description:
      "Modern responsive websites and applications using Next.js, React, TypeScript, and Tailwind CSS.",
  },
  {
    title: "AI Solutions",
    description:
      "Practical AI solutions that help organizations automate workflows and improve productivity.",
  },
  {
    title: "Technology Consulting",
    description:
      "Technical guidance for businesses looking to modernize their digital presence.",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-slate-900 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold md:text-4xl">
          Services
        </h2>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-xl border border-slate-700 p-6"
            >
              <h3 className="text-xl font-bold">
                {service.title}
              </h3>

              <p className="mt-4 text-slate-300">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}