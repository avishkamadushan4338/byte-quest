import { createFileRoute } from "@tanstack/react-router";

import { Awards } from "@/components/home/awards";
import { CallToAction } from "@/components/home/call-to-action";
import { Divisions } from "@/components/home/divisions";
import { Hero } from "@/components/home/hero";
import { Impact } from "@/components/home/impact";
import { Journey } from "@/components/home/journey";
import { Moments } from "@/components/home/moments";
import { Timeline } from "@/components/home/timeline";
import { WhatIs } from "@/components/home/what-is";
import { Reveal } from "@/components/site/motion";
import { buildCanonicalLink, buildSeoMeta } from "@/utils/seo";

const HomeComponent = () => (
  <main className="bg-ink">
    <Hero />
    <Reveal>
      <WhatIs />
    </Reveal>
    <Reveal>
      <Journey />
    </Reveal>
    <Reveal>
      <Moments />
    </Reveal>
    <Reveal>
      <Divisions />
    </Reveal>
    <Reveal>
      <Impact />
    </Reveal>
    <Reveal>
      <Awards />
    </Reveal>
    <Reveal>
      <Timeline />
    </Reveal>
    <Reveal>
      <CallToAction />
    </Reveal>
  </main>
);

export const Route = createFileRoute("/")({
  head: () => ({
    links: [buildCanonicalLink("/")],
    meta: buildSeoMeta({
      path: "/",
      title: "Home",
    }),
  }),
  component: HomeComponent,
});
