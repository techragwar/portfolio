import type { Metadata } from "next";
import { getArticles } from "@/lib/articles";
import { ArticleSearch } from "@/components/article-search";
import "./articles.css";

export const metadata: Metadata = {
  title: "Articles | Ragwartech",
  description: "Engineering, AI governance and technology perspectives.",
};

export default function ArticlesPage() {
  return <main className="articles-container">
    <header className="articles-heading">
      <p>RAGWARTECH / INSIGHTS</p>
      <h1>Articles &amp; Perspectives</h1>
      <p>Engineering, governance, and technology with purpose.</p>
    </header>
    <ArticleSearch articles={getArticles()} />
  </main>;
}
