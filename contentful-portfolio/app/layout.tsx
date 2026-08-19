import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Dan R. Otieno | Software Engineer & AI Solutions Developer",
  description:
    "Portfolio of Dan R. Otieno — software engineering, AI solutions, web development, data, and modern digital products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        <main className="pt-16">
          {children}
        </main>

        <footer className="border-t border-slate-800 bg-slate-950 py-8 text-slate-400">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 text-sm md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} Dan R. Otieno
            </p>

            <p>
              Built with Next.js, TypeScript, Tailwind CSS & Contentful.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}