import { Container } from "@byte-quest/ui/components/container";
import { Section } from "@byte-quest/ui/components/section";
import {
  TabsList,
  TabsPanel,
  TabsRoot,
  TabsTab,
} from "@byte-quest/ui/primitives/tabs";
import { useState } from "react";

import { PageHero } from "@/components/site/page-hero";

import type { AdminTab } from "./data";
import { adminCopy, adminHero, adminTabs } from "./data";
import { SchoolsPanel } from "./schools-panel";
import { SubmissionsPanel } from "./submissions-panel";
import { TeamsPanel } from "./teams-panel";
import { UsersPanel } from "./users-panel";

export const Admin = () => {
  const [tab, setTab] = useState<AdminTab>("users");

  return (
    <main className="bg-ink overflow-x-hidden">
      <PageHero
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Admin" }]}
        glow="gold"
        id="admin"
        kicker={adminHero.kicker}
        kickerTone="volt"
        lead={adminHero.lead}
        title={adminHero.title}
      />

      <Section tone="alt">
        <Container>
          <TabsRoot
            onValueChange={(value) => setTab(value as AdminTab)}
            value={tab}
          >
            <TabsList aria-label={adminCopy.tabsLabel}>
              {adminTabs.map((entry) => (
                <TabsTab key={entry.value} value={entry.value}>
                  {entry.label}
                </TabsTab>
              ))}
            </TabsList>

            <TabsPanel value="users">
              <UsersPanel />
            </TabsPanel>

            <TabsPanel value="schools">
              <SchoolsPanel />
            </TabsPanel>

            <TabsPanel value="teams">
              <TeamsPanel />
            </TabsPanel>

            <TabsPanel value="submissions">
              <SubmissionsPanel />
            </TabsPanel>
          </TabsRoot>
        </Container>
      </Section>
    </main>
  );
};
