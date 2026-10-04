import { Badge } from "@byte-quest/ui/components/badge";
import { Callout } from "@byte-quest/ui/components/callout";
import { Card } from "@byte-quest/ui/components/card";
import { Kicker } from "@byte-quest/ui/components/kicker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TableWrapper,
} from "@byte-quest/ui/components/table";
import {
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogPopup,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogViewport,
} from "@byte-quest/ui/primitives/alert-dialog";
import { Button } from "@byte-quest/ui/primitives/button";
import { Skeleton } from "@byte-quest/ui/primitives/skeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { orpc } from "@/utils/orpc";

import type { DashboardMe, DashboardTeam } from "./data";
import {
  divisionBadgeTones,
  divisionLabels,
  SPECIALTIES,
  specialtyBadgeTones,
  specialtyLabels,
  teamPanelCopy,
  teamRoleBadgeTones,
  teamRoleLabels,
  TEAM_MAX_MEMBERS,
  TEAM_MIN_MEMBERS,
} from "./data";
import { JoinRequests } from "./join-requests";

export interface TeamPanelProps {
  me: DashboardMe;
  onChanged: () => Promise<void>;
  team: DashboardTeam;
}

export const TeamPanel = ({ me, onChanged, team }: TeamPanelProps) => {
  const [open, setOpen] = useState(false);

  const schoolsQuery = useQuery(orpc.schools.list.queryOptions());
  const membersQuery = useQuery(
    orpc.teams.listMembers.queryOptions({ input: { teamId: team.id } })
  );

  const leaveMutation = useMutation(
    orpc.teams.leave.mutationOptions({
      onError: (error: unknown) => {
        toast.error(
          error instanceof Error ? error.message : teamPanelCopy.leaveFailure
        );
      },
      onSuccess: async () => {
        toast.success(teamPanelCopy.leaveSuccess);
        setOpen(false);
        await onChanged();
      },
    })
  );

  const members = membersQuery.data ?? [];
  const myMembership = members.find((member) => member.userId === me.userId);
  const isLeader = myMembership?.teamRole === "leader";
  const school =
    schoolsQuery.data?.find((entry) => entry.id === team.schoolId)?.name ??
    teamPanelCopy.schoolFallback;
  const missingSpecialties = SPECIALTIES.filter(
    (specialty) => !members.some((member) => member.specialty === specialty)
  );
  const stillForming = team.memberCount < TEAM_MIN_MEMBERS;

  return (
    <Card className="grid gap-6 p-[clamp(22px,3.5vw,36px)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <Kicker tone="teal">{teamPanelCopy.membersTitle}</Kicker>
          <h2 className="font-display mt-4 text-[clamp(24px,3vw,34px)] font-bold tracking-[-0.02em]">
            {team.name}
          </h2>
          <p className="text-muted mt-2 text-[14px] leading-[1.6]">
            {`${teamPanelCopy.teamMetaSuffix}: ${school} · Grade ${me.grade}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge tone={divisionBadgeTones[team.division]}>
            {divisionLabels[team.division]}
          </Badge>
          <Badge tone="neutral">
            {`${team.memberCount}/${TEAM_MAX_MEMBERS}`}
          </Badge>
        </div>
      </div>

      {membersQuery.isPending ? (
        <Skeleton className="h-[220px] w-full" />
      ) : (
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>{teamPanelCopy.memberColumn}</TableHeadCell>
                <TableHeadCell>{teamPanelCopy.gradeColumn}</TableHeadCell>
                <TableHeadCell>{teamPanelCopy.roleColumn}</TableHeadCell>
                <TableHeadCell>{teamPanelCopy.specialtyColumn}</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.userId}>
                  <TableCell className="text-fg font-medium">
                    {member.fullName}
                  </TableCell>
                  <TableCell>{member.grade}</TableCell>
                  <TableCell>
                    <Badge tone={teamRoleBadgeTones[member.teamRole]}>
                      {teamRoleLabels[member.teamRole]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {member.specialty === null ? (
                      <span className="text-faint-2">
                        {teamPanelCopy.noSpecialtyLabel}
                      </span>
                    ) : (
                      <Badge tone={specialtyBadgeTones[member.specialty]}>
                        {specialtyLabels[member.specialty]}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      )}

      {missingSpecialties.length === 0 ? (
        <Callout title={teamPanelCopy.coverageCompleteTitle} tone="success">
          {teamPanelCopy.coverageCompleteBody}
        </Callout>
      ) : (
        <Callout title={teamPanelCopy.coverageMissingTitle} tone="warning">
          {`${teamPanelCopy.coverageMissingPrefix} ${missingSpecialties
            .map((specialty) => specialtyLabels[specialty])
            .join(", ")}. ${teamPanelCopy.coverageMissingSuffix}`}
        </Callout>
      )}

      {stillForming ? (
        <Callout title={teamPanelCopy.sizeWarningTitle} tone="info">
          {teamPanelCopy.sizeWarningBody}
        </Callout>
      ) : null}

      {isLeader ? (
        <>
          <JoinRequests onChanged={onChanged} />
          <Callout title={teamPanelCopy.leaderLeaveTitle} tone="info">
            {teamPanelCopy.leaderLeaveBody}
          </Callout>
        </>
      ) : (
        <div className="border-line-soft flex flex-wrap items-center justify-between gap-3 border-t pt-5">
          <p className="text-muted-2 max-w-[460px] text-[13px] leading-[1.6]">
            {teamPanelCopy.inviteBody}
          </p>
          <AlertDialogRoot onOpenChange={setOpen} open={open}>
            <AlertDialogTrigger render={<Button variant="outline" />}>
              {teamPanelCopy.leaveLabel}
            </AlertDialogTrigger>
            <AlertDialogPortal>
              <AlertDialogBackdrop />
              <AlertDialogViewport>
                <AlertDialogPopup>
                  <AlertDialogTitle>
                    {teamPanelCopy.leaveDialogTitle}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {teamPanelCopy.leaveDialogDescription}
                  </AlertDialogDescription>
                  <div className="mt-7 flex flex-wrap items-center gap-2.5">
                    <Button
                      aria-busy={leaveMutation.isPending}
                      disabled={leaveMutation.isPending}
                      onClick={() => {
                        leaveMutation.mutate({ teamId: team.id });
                      }}
                    >
                      {leaveMutation.isPending
                        ? teamPanelCopy.leavePendingLabel
                        : teamPanelCopy.leaveConfirmLabel}
                    </Button>
                    <AlertDialogClose variant="outline">
                      {teamPanelCopy.leaveCancelLabel}
                    </AlertDialogClose>
                  </div>
                </AlertDialogPopup>
              </AlertDialogViewport>
            </AlertDialogPortal>
          </AlertDialogRoot>
        </div>
      )}
    </Card>
  );
};
