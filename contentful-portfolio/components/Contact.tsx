export default function Contact() {
  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-4xl font-bold">
          Let's Build Something Together
        </h2>

        <p className="mt-6 text-lg text-slate-300">
          Interested in working together? Let's talk about your next project.
        </p>

        <a
          href="mailto:reggy.otieno@gmail.com"
          className="mt-8 inline-block rounded-lg bg-blue-600 px-8 py-4 font-semibold hover:bg-blue-500"
        >
          Contact Me
        </a>
      </div>
    </section>
  );
}