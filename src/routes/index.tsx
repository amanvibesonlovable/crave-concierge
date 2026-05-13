import { createFileRoute } from "@tanstack/react-router";
import { SwiggyAIApp } from "@/components/SwiggyAIApp";

export const Route = createFileRoute("/")({
  component: SwiggyAIApp,
  head: () => ({
    meta: [
      { title: "SwiggyAI — AI Food Concierge" },
      { name: "description", content: "Describe your craving and SwiggyAI finds the perfect meal nearby. Reorder your usuals in one tap." },
    ],
  }),
});
