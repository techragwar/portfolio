export type Project = {
  slug: string;
  number: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: string;
};

export const projects: Project[] = [
  {
    slug: "ai-consultant",
    number: "01",
    title: "AI Consultant Platform",
    description:
      "A professional platform for presenting AI consulting services and solutions.",
    longDescription:
      "This project is designed as a professional AI consulting platform that helps businesses understand how artificial intelligence can improve workflows, automate repetitive processes, and create new digital opportunities.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "AI",
    ],
    category: "AI & Consulting",
  },

  {
    slug: "nonprofit-platform",
    number: "02",
    title: "Nonprofit Digital Platform",
    description:
      "A modern nonprofit platform for content, community engagement, and donations.",
    longDescription:
      "This platform provides a modern digital presence for a nonprofit organization. It is designed to support content management, storytelling, community engagement, and online donations.",
    technologies: [
      "Next.js",
      "Contentful",
      "Stripe",
      "PostgreSQL",
    ],
    category: "Nonprofit",
  },

  {
    slug: "news-aggregator",
    number: "03",
    title: "News Aggregator",
    description:
      "A full-stack application that retrieves and presents news through external APIs.",
    longDescription:
      "The news aggregator demonstrates full-stack development by retrieving information from external APIs, processing the data, and presenting news through a responsive user interface.",
    technologies: [
      "React",
      "Python",
      "Django",
      "PostgreSQL",
    ],
    category: "Full Stack",
  },
];