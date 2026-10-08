import { Container } from "@byte-quest/ui/components/container";
import { Section } from "@byte-quest/ui/components/section";
import type { StatItem } from "@byte-quest/ui/components/stat-strip";
import { StatStrip } from "@byte-quest/ui/components/stat-strip";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";

import { PageHero } from "@/components/site/page-hero";
import { orpc } from "@/utils/orpc";

import type {
  DashboardMe,
  DashboardSubmission,
  DashboardTeam,
  NoTeamView,
} from "./data";
import {
  dashboardHero,
  dashboardStatCopy,
  divisionLabels,
  divisionRanges,
  inferDivision,
  submissionStatusLabels,
  TEAM_MAX_MEMBERS,
} from "./data";
import { JoinPanel } from "./join-panel";
import { NoTeamPanel } from "./no-team-panel";
import { SubmissionPanel } from "./submission-panel";
import { TeamPanel } from "./team-panel";

export interface DashboardProps {
  me: DashboardMe;
  team: DashboardTeam | null;
  submission: DashboardSubmission | null;
}

export const Dashboard = ({ me, submission, team }: DashboardProps) => {
  const [view, setView] = useState<NoTeamView>("choose");
  const queryClient = useQueryClient();
  const router = useRouter();

  const division = inferDivision(me.grade);

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: orpc.teams.listMembers.key(),
      }),
      queryClient.invalidateQueries({
        queryKey: orpc.teams.listJoinRequests.key(),
      }),
      queryClient.invalidateQueries({ queryKey: orpc.teams.myTeam.key() }),
      queryClient.invalidateQueries({
        queryKey: orpc.submissions.mine.key(),
      }),
    ]);
    await router.invalidate();
  };

  const stats: StatItem[] = [
    {
      hint: divisionRanges[division],
      label: dashboardStatCopy.divisionLabel,
      tone: "teal",
      value: divisionLabels[division],
    },
    {
      label: dashboardStatCopy.gradeLabel,
      value: me.grade,
    },
    {
      hint: dashboardStatCopy.teamSizeHint,
      label: dashboardStatCopy.teamSizeLabel,
      value: team
        ? `${team.memberCount}/${TEAM_MAX_MEMBERS}`
        : dashboardStatCopy.noTeam,
    },
    {
      label: dashboardStatCopy.submissionLabel,
      value: submission
        ? submissionStatusLabels[submission.status]
        : dashboardStatCopy.notStarted,
    },
  ];

  const renderTeam = () => {
    if (team) {
      return <TeamPanel me={me} onChanged={refresh} team={team} />;
    }
    if (view === "join") {
      return (
        <JoinPanel
          division={division}
          onBack={() => {
            setView("choose");
          }}
        />
      );
    }
    return (
      <NoTeamPanel
        division={division}
        onChanged={refresh}
        onFindTeam={() => {
          setView("join");
        }}
      />
    );
  };

  return (
    <main className="bg-ink">
      <PageHero
        aside={<StatStrip items={stats} />}
        id="dashboard"
        kicker={dashboardHero.kicker}
        kickerTone="volt"
        lead={`${dashboardHero.leadPrefix} ${me.fullName} - ${dashboardHero.leadSuffix}`}
        title={dashboardHero.title}
      />

      <Section tone="base">
        <Container>
          <div className="grid gap-6">
            {renderTeam()}
            <SubmissionPanel
              me={me}
              onChanged={refresh}
              submission={submission}
              team={team}
            />
          </div>
        </Container>
      </Section>
    </main>
  );
};
