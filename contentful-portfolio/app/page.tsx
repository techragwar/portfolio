import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <header className="border-b border-slate-800">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="text-xl font-bold">
            Dan Otieno
          </a>

          <div className="hidden gap-8 md:flex">
            <a href="#about" className="text-slate-300 hover:text-white">
              About
            </a>
            <a href="#skills" className="text-slate-300 hover:text-white">
              Skills
            </a>
            <a href="#projects" className="text-slate-300 hover:text-white">
              Projects
            </a>
            <a href="#services" className="text-slate-300 hover:text-white">
              Services
            </a>
            <a href="#contact" className="text-slate-300 hover:text-white">
              Contact
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto flex min-h-[650px] max-w-6xl items-center px-6 py-24">
        <div className="max-w-4xl">
          <p className="mb-4 text-lg font-medium text-blue-400">
            Software Engineer & AI Consultant
          </p>

          <h1 className="text-5xl font-bold leading-tight md:text-7xl">
            I build modern web applications and AI-powered solutions.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            I combine software engineering, data analysis, business
            experience, and modern web technologies to build useful digital
            products.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
            >
              View My Work
            </a>

            <a
              href="#contact"
              className="rounded-lg border border-slate-700 px-6 py-3 font-semibold hover:bg-slate-900"
            >
              Let's Work Together
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t border-slate-800 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold md:text-4xl">About Me</h2>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            I am a software developer with experience spanning technology,
            business analysis, investment management, and data. My focus is
            building responsive applications with React and Next.js while
            exploring practical applications of AI.
          </p>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="bg-slate-900 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold md:text-4xl">Skills</h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[
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
            ].map((skill) => (
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

      {/* Projects */}
      <section id="projects" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold md:text-4xl">
            Featured Projects
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
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
            ].map((project) => (
              <article
                key={project.title}
                className="rounded-xl border border-slate-800 bg-slate-900 p-6"
              >
                <h3 className="text-xl font-bold">{project.title}</h3>

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

      {/* Services */}
      <section id="services" className="bg-slate-900 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold md:text-4xl">
            Services
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-slate-700 p-6">
              <h3 className="text-xl font-bold">Web Development</h3>
              <p className="mt-4 text-slate-300">
                Modern responsive websites and applications using Next.js,
                React, TypeScript, and Tailwind CSS.
              </p>
            </div>

            <div className="rounded-xl border border-slate-700 p-6">
              <h3 className="text-xl font-bold">AI Solutions</h3>
              <p className="mt-4 text-slate-300">
                Practical AI solutions that help organizations automate
                workflows and improve productivity.
              </p>
            </div>

            <div className="rounded-xl border border-slate-700 p-6">
              <h3 className="text-xl font-bold">Technology Consulting</h3>
              <p className="mt-4 text-slate-300">
                Technical guidance for businesses looking to modernize their
                digital presence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold">
            Let's Build Something Together
          </h2>

          <p className="mt-6 text-lg text-slate-300">
            Interested in working together? Let's talk about your next
            project.
          </p>

          <a
            href="mailto:reggy.otieno@gmail.com"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-8 py-4 font-semibold hover:bg-blue-500"
          >
            Contact Me
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-slate-400">
          © {new Date().getFullYear()} Dan Otieno. All rights reserved.
        </div>
      </footer>
    </main>
  );
}