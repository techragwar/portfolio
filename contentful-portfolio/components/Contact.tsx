export default function Contact() {
  return (
    <section id="contact" className="py-28">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
          Get In Touch
        </p>

        <h2 className="mt-5 text-4xl font-bold md:text-5xl">
          Have a project in mind?
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Whether you need a modern website, an AI solution, or
          technical guidance, let's discuss how I can help.
        </p>

        <a
          href="mailto:reggy.otieno@gmail.com"
          className="mt-10 inline-flex rounded-lg bg-blue-600 px-8 py-4 font-semibold transition hover:bg-blue-500"
        >
          Start a Conversation
        </a>
      </div>
    </section>
  );
}