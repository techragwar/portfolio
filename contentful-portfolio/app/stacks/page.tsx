import type { Metadata } from "next";
import Stacks from "@/app/components/Stacks";

export const metadata: Metadata = {
  title: "Stacks | Dan R. Otieno",
  description: "Chat and search across your own PDFs, with every answer tied to the page it came from.",
};

export default function StacksPage() {
  return <Stacks />;
}
