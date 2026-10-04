import { PageHero } from "@/components/site/page-hero";

export const MentorsHero = () => (
  <PageHero
    breadcrumb={[{ label: "Home", to: "/" }, { label: "Mentors" }]}
    id="mentors"
    kicker="MENTORS & EXPERTS"
    lead="Mentors support teams through all three phases — from shaping ideas to refining prototypes and preparing for the Grand Final."
    title="Guided by people who build."
  />
);
