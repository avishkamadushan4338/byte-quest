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
import { Button } from "@byte-quest/ui/primitives/button";
import { Skeleton } from "@byte-quest/ui/primitives/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { orpc } from "@/utils/orpc";

import type { StatusFilter } from "./data";
import {
  statusBadgeOverrides,
  statusBadgeTones,
  statusFilters,
  statusLabels,
  submissionsCopy,
  submissionsEmpty,
} from "./data";
import { ReviewDialog } from "./review-dialog";

const SKELETON_KEYS = ["skeleton-1", "skeleton-2", "skeleton-3", "skeleton-4"];

const formatDate = (value: string | null) => {
  if (value === null) {
    return submissionsCopy.noDate;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return submissionsCopy.noDate;
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const SubmissionsPanel = () => {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [reviewId, setReviewId] = useState<string | null>(null);

  const input = filter === "all" ? undefined : { status: filter };
  const submissions = useQuery(
    orpc.submissions.adminList.queryOptions({ input })
  );

  const rows = submissions.data ?? [];
  const selected = rows.find((row) => row.id === reviewId) ?? null;

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-faint mr-1 font-mono text-[10px] tracking-[0.14em] uppercase">
          {submissionsCopy.filtersLabel}
        </span>
        {statusFilters.map((entry) => (
          <Button
            aria-pressed={filter === entry.value}
            key={entry.value}
            onClick={() => setFilter(entry.value)}
            size="sm"
            variant={filter === entry.value ? "primary" : "outline"}
          >
            {entry.label}
          </Button>
        ))}
      </div>

      {submissions.isPending ? (
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Title</TableHeadCell>
                <TableHeadCell>Team ID</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Forwarded</TableHeadCell>
                <TableHeadCell>Reviewed</TableHeadCell>
                <TableHeadCell>Actions</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {SKELETON_KEYS.map((key) => (
                <TableRow key={key}>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-9 w-24" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      ) : null}

      {submissions.isSuccess && rows.length === 0 ? (
        <EmptyState
          description={submissionsEmpty.description}
          title={submissionsEmpty.title}
        />
      ) : null}

      {rows.length > 0 ? (
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Title</TableHeadCell>
                <TableHeadCell>Team ID</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Forwarded</TableHeadCell>
                <TableHeadCell>Reviewed</TableHeadCell>
                <TableHeadCell>Actions</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <span className="font-display text-fg font-semibold">
                      {row.title}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-2 inline-block max-w-[180px] truncate align-bottom font-mono text-[12.5px]">
                      {row.teamId}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={statusBadgeOverrides[row.status]}
                      tone={statusBadgeTones[row.status]}
                    >
                      {statusLabels[row.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(row.forwardedAt)}</TableCell>
                  <TableCell>{formatDate(row.reviewedAt)}</TableCell>
                  <TableCell>
                    {row.status === "submitted" ? (
                      <Button
                        onClick={() => setReviewId(row.id)}
                        size="sm"
                        variant="primary"
                      >
                        {submissionsCopy.reviewLabel}
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      ) : null}

      <ReviewDialog
        onOpenChange={(open) => {
          if (!open) {
            setReviewId(null);
          }
        }}
        open={selected !== null}
        submission={selected}
      />
    </div>
  );
};
