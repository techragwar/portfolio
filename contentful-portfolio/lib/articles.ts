import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const directory = path.join(process.cwd(), "content/articles");

export type Article = {
  slug: string; title: string; description: string; date: string;
  tags: string[]; draft: boolean; body: string;
};
export type ArticleSummary = Omit<Article, "body" | "draft">;

export function getArticle(slug: string): Article | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const filename = path.join(directory, `${slug}.mdx`);
  if (!fs.existsSync(filename)) return null;
  const { data, content } = matter(fs.readFileSync(filename, "utf8"));
  return {
    slug, title: String(data.title ?? slug), description: String(data.description ?? ""),
    date: String(data.date ?? ""), tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: data.draft !== false, body: content,
  };
}

export function getArticles(): ArticleSummary[] {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory).filter(f => f.endsWith(".mdx"))
    .map(f => getArticle(f.slice(0, -4)))
    .filter((article): article is Article => !!article && !article.draft)
    .map(({ slug, title, description, date, tags }) => ({ slug, title, description, date, tags }))
    .sort((a, b) => b.date.localeCompare(a.date));
}
