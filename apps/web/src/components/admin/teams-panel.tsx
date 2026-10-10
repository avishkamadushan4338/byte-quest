import { Badge } from "@byte-quest/ui/components/badge";
import { Callout, EmptyState } from "@byte-quest/ui/components/callout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TableWrapper,
} from "@byte-quest/ui/components/table";
import { cn } from "@byte-quest/ui/lib/utils";
import { Button } from "@byte-quest/ui/primitives/button";
import { Skeleton } from "@byte-quest/ui/primitives/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { orpc } from "@/utils/orpc";

import { Credentials } from "./credentials";
import {
  divisionBadgeTones,
  divisionLabels,
  teamsCopy,
  teamsEmpty,
} from "./data";

const SKELETON_KEYS = ["skeleton-1", "skeleton-2", "skeleton-3"];

export const TeamsPanel = () => {
  const queryClient = useQueryClient();
  const teams = useQuery(orpc.teams.adminList.queryOptions());
  const rows = teams.data ?? [];
  const [issued, setIssued] = useState<{
    username: string;
    password: string;
  } | null>(null);

  const issueCredentials = useMutation(
    orpc.teams.issueCaptainCredentials.mutationOptions({
      onSuccess: (result) => {
        queryClient.invalidateQueries({
          queryKey: orpc.teams.adminList.key(),
        });
        setIssued(result);
        toast.success("Captain login created");
      },
      onError: (error: unknown) => {
        toast.error(
          error instanceof Error && error.message
            ? error.message
            : "We could not issue that login"
        );
      },
    })
  );

  return (
    <div className="grid gap-5">
      {issued ? (
        <Callout
          title={`Captain login created for ${issued.username}`}
          tone="success"
        >
          <p>
            Share these one-time login details with the team&apos;s captain.
            They are shown only once and nobody is signed in automatically.
          </p>
          <Credentials
            className="mt-3"
            password={issued.password}
            username={issued.username}
          />
          <Button
            className="mt-3"
            onClick={() => setIssued(null)}
            size="sm"
            variant="outline"
          >
            Done
          </Button>
        </Callout>
      ) : null}

      {teams.isPending ? (
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Team</TableHeadCell>
                <TableHeadCell>School</TableHeadCell>
                <TableHeadCell>Division</TableHeadCell>
                <TableHeadCell>{teamsCopy.membersHeader}</TableHeadCell>
                <TableHeadCell>{teamsCopy.rangeHeader}</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {SKELETON_KEYS.map((key) => (
                <TableRow key={key}>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-32 rounded-full" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      ) : null}

      {teams.isSuccess && rows.length === 0 ? (
        <EmptyState
          description={teamsEmpty.description}
          title={teamsEmpty.title}
        />
      ) : null}

      {rows.length > 0 ? (
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Team</TableHeadCell>
                <TableHeadCell>School</TableHeadCell>
                <TableHeadCell>Division</TableHeadCell>
                <TableHeadCell>{teamsCopy.membersHeader}</TableHeadCell>
                <TableHeadCell>{teamsCopy.rangeHeader}</TableHeadCell>
                <TableHeadCell>Teacher contact</TableHeadCell>
                <TableHeadCell>Captain</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((team) => (
                <TableRow key={team.id}>
                  <TableCell>
                    <span className="font-display text-fg font-semibold">
                      {team.name}
                    </span>
                  </TableCell>
                  <TableCell>{team.schoolName}</TableCell>
                  <TableCell>
                    <Badge tone={divisionBadgeTones[team.division]}>
                      {divisionLabels[team.division]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "font-mono text-[13px]",
                        team.memberCount >= team.minMembers
                          ? "text-volt"
                          : "text-gold-bright"
                      )}
                    >
                      {team.memberCount}/{team.maxMembers}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-faint-2 font-mono text-[12px]">
                      {team.minMembers}–{team.maxMembers}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-fg-dim text-[13px]">
                      {team.teacherName ?? "-"}
                    </div>
                    <div className="text-faint-2 text-[12px]">
                      {team.teacherPhone ?? team.teacherEmail ?? "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {team.captainIssued ? (
                      <Badge tone="neutral">Login issued</Badge>
                    ) : (
                      <Button
                        disabled={issueCredentials.isPending}
                        onClick={() =>
                          issueCredentials.mutate({ teamId: team.id })
                        }
                        size="sm"
                        variant="outline"
                      >
                        Issue captain login
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      ) : null}
    </div>
  );
};
