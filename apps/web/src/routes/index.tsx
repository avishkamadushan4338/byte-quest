import { createFileRoute } from "@tanstack/react-router";

import { Awards } from "@/components/home/awards";
import { CallToAction } from "@/components/home/call-to-action";
import { Divisions } from "@/components/home/divisions";
import { Hero } from "@/components/home/hero";
import { Impact } from "@/components/home/impact";
import { Journey } from "@/components/home/journey";
import { Moments } from "@/components/home/moments";
import { Projects } from "@/components/home/projects";
import { Schools } from "@/components/home/schools";
import { Timeline } from "@/components/home/timeline";
import { WhatIs } from "@/components/home/what-is";

const HomeComponent = () => (
  <main className="bg-ink overflow-x-hidden">
    <Hero />
    <WhatIs />
    <Journey />
    <Moments />
    <Divisions />
    <Impact />
    <Projects />
    <Schools />
    <Awards />
    <Timeline />
    <CallToAction />
  </main>
);

export const Route = createFileRoute("/")({
  component: HomeComponent,
});
