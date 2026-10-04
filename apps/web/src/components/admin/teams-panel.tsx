import { Badge } from "@byte-quest/ui/components/badge";
import { EmptyState } from "@byte-quest/ui/components/callout";
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
import { Skeleton } from "@byte-quest/ui/primitives/skeleton";
import { useQuery } from "@tanstack/react-query";

import { orpc } from "@/utils/orpc";

import {
  divisionBadgeTones,
  divisionLabels,
  teamsCopy,
  teamsEmpty,
} from "./data";

const SKELETON_KEYS = ["skeleton-1", "skeleton-2", "skeleton-3"];

export const TeamsPanel = () => {
  const teams = useQuery(orpc.teams.adminList.queryOptions());
  const rows = teams.data ?? [];

  return (
    <div className="grid gap-5">
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      ) : null}
    </div>
  );
};
