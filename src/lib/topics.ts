// Dedicated topic pages that live at /{lang}/{slug}. Kept here so the sitemap
// and the page's generateStaticParams share one source of truth.
export const topicSlugs = [
  "protein-for-weight-loss",
  "protein-for-muscle-gain",
  "protein-for-women",
  "protein-on-ozempic-wegovy",
  "high-protein-foods",
  "protein-by-body-weight",
  "vegetarian-vegan-protein",
] as const;

export type TopicSlug = (typeof topicSlugs)[number];
