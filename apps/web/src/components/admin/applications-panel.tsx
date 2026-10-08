import { Badge } from "@byte-quest/ui/components/badge";
import { Callout } from "@byte-quest/ui/components/callout";
import { DataTable } from "@byte-quest/ui/components/data-table";
import type {
  DataTableColumn,
  SortDirection,
} from "@byte-quest/ui/components/data-table";
import { TextareaField } from "@byte-quest/ui/components/fields";
import { Check } from "@byte-quest/ui/components/icons";
import { Button } from "@byte-quest/ui/primitives/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { orpc } from "@/utils/orpc";

import { applicationCopy } from "./application-data";
import type {
  ApplicationRow,
  ApplicationStatus,
  ApplicationStatusFilter,
} from "./application-data";

const PAGE_SIZE = 25;

const formatDate = (value: string | null) => {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const statusTone: Record<ApplicationStatus, "volt" | "gold" | "neutral"> = {
  approved: "volt",
  pending: "gold",
  rejected: "neutral",
};

const columns: DataTableColumn<ApplicationRow>[] = [
  {
    id: "fullName",
    cell: (row) => (
      <div>
        <div className="text-fg text-[14px] font-semibold">{row.fullName}</div>
        <div className="text-faint mt-0.5 text-[12.5px]">{row.role}</div>
      </div>
    ),
    header: "Applicant",
    sortKey: "fullName",
  },
  {
    id: "organization",
    cell: (row) => row.organization,
    header: "Organisation",
    sortKey: "organization",
  },
  {
    id: "username",
    cell: (row) => (
      <span className="text-muted-2 font-mono text-[12.5px]">
        @{row.username}
      </span>
    ),
    header: "Username",
    sortKey: "username",
  },
  {
    id: "email",
    cell: (row) => (
      <span className="text-muted-2 text-[12.5px] break-all">{row.email}</span>
    ),
    header: "Email",
  },
  {
    id: "status",
    cell: (row) => (
      <Badge tone={statusTone[row.status]}>
        {applicationCopy.statusLabels[row.status]}
      </Badge>
    ),
    header: "Status",
    sortKey: "status",
  },
  {
    id: "createdAt",
    cell: (row) => (
      <span className="text-muted-2 text-[13px]">
        {formatDate(row.createdAt)}
      </span>
    ),
    header: "Applied",
    sortKey: "createdAt",
  },
];

const statusFilters: ApplicationStatus[] = ["pending", "approved", "rejected"];

export const ApplicationsPanel = () => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<ApplicationStatusFilter>("pending");
  const [pageIndex, setPageIndex] = useState(0);
  const [sort, setSort] = useState<{
    key: string;
    direction: SortDirection;
  } | null>(null);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [issued, setIssued] = useState<{
    username: string;
    password: string;
  } | null>(null);

  const query = useQuery(
    orpc.access.listAdminApplications.queryOptions({
      input: status === "all" ? {} : { status },
      placeholderData: (previous) => previous,
    })
  );

  const decide = useMutation(
    orpc.access.decideAdminApplication.mutationOptions({
      onSuccess: (result) => {
        queryClient.invalidateQueries({
          queryKey: orpc.access.listAdminApplications.key(),
        });
        if (result.password) {
          const application = query.data?.find(
            (entry) => entry.id === result.id
          );
          setIssued({
            username: application?.username ?? "",
            password: result.password,
          });
          toast.success(applicationCopy.approved);
        } else {
          toast.success(applicationCopy.rejected);
        }
        setReviewId(null);
        setNote("");
      },
      onError: (error: unknown) => {
        toast.error(
          error instanceof Error && error.message
            ? error.message
            : applicationCopy.failed
        );
      },
    })
  );

  const rows = (query.data ?? []) as ApplicationRow[];
  const sorted = sort
    ? rows.toSorted((left, right) => {
        const leftValue = String(left[sort.key as keyof ApplicationRow] ?? "");
        const rightValue = String(
          right[sort.key as keyof ApplicationRow] ?? ""
        );
        const order = leftValue.localeCompare(rightValue);
        return sort.direction === "asc" ? order : -order;
      })
    : rows;
  const paged = sorted.slice(
    pageIndex * PAGE_SIZE,
    pageIndex * PAGE_SIZE + PAGE_SIZE
  );

  const active = rows.find((row) => row.id === reviewId);

  return (
    <div className="grid gap-5">
      {issued ? (
        <Callout
          title={`Account created for ${issued.username}`}
          tone="success"
        >
          <p>
            Share this one-time password with the applicant. It is shown only
            once.
          </p>
          <p className="text-volt mt-3 font-mono text-[15px] tracking-[0.06em]">
            {issued.username} / {issued.password}
          </p>
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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-faint font-mono text-[10.5px] tracking-[0.14em] uppercase">
          Filter by status
        </span>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((option) => (
            <button
              aria-pressed={status === option}
              className={
                status === option
                  ? "border-volt/45 bg-volt/10 text-volt cursor-pointer rounded-full border px-3 py-1.5 text-[12.5px] transition-colors"
                  : "text-muted border-line-soft hover:border-volt/40 cursor-pointer rounded-full border bg-transparent px-3 py-1.5 text-[12.5px] transition-colors"
              }
              key={option}
              onClick={() => {
                setStatus(option);
                setPageIndex(0);
              }}
              type="button"
            >
              {applicationCopy.statusLabels[option]}
            </button>
          ))}
        </div>
      </div>

      <DataTable<ApplicationRow>
        caption="Admin access applications"
        columns={columns}
        emptyContent={applicationCopy.empty}
        errorContent={applicationCopy.failed}
        getRowId={(row) => row.id}
        isError={query.isError}
        isFetching={query.isFetching}
        isLoading={query.isPending}
        onPaginationChange={(next) => setPageIndex(next.pageIndex)}
        onSortChange={setSort}
        pagination={{ pageIndex, pageSize: PAGE_SIZE }}
        renderRowActions={(row) =>
          row.status === "pending" ? (
            <Button
              onClick={() => {
                setReviewId(row.id);
                setNote("");
              }}
              size="sm"
              variant="outline"
            >
              Review
            </Button>
          ) : (
            <span className="text-faint text-[13px]">
              {row.reviewedAt ? formatDate(row.reviewedAt) : "-"}
            </span>
          )
        }
        rows={paged}
        sort={sort}
        total={sorted.length}
      />

      {active ? (
        <div className="border-volt/25 bg-surface rounded-[24px] border p-[clamp(20px,3vw,28px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="font-display text-fg text-[20px] font-semibold tracking-[-0.02em]">
                {active.fullName}
              </div>
              <div className="text-muted-2 mt-1 text-[13.5px]">
                {active.role} · {active.organization}
              </div>
            </div>
            <button
              aria-label="Close"
              className="text-muted-2 hover:text-volt cursor-pointer border-none bg-transparent text-xl leading-none"
              onClick={() => setReviewId(null)}
              type="button"
            >
              ×
            </button>
          </div>

          <p className="text-muted mt-4 text-[14px] leading-[1.65]">
            {active.experience}
          </p>

          <div className="mt-5">
            <TextareaField
              id="review-note"
              label="Note"
              onValueChange={setNote}
              placeholder="Optional note recorded with the decision"
              rows={3}
              value={note}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <Button
              aria-busy={decide.isPending}
              disabled={decide.isPending}
              onClick={() =>
                decide.mutate({
                  applicationId: active.id,
                  approve: true,
                  note: note.trim() || undefined,
                })
              }
            >
              <Check className="size-4" />
              {applicationCopy.approve}
            </Button>
            <Button
              aria-busy={decide.isPending}
              className="border-destructive/40 text-destructive hover:border-destructive"
              disabled={decide.isPending}
              onClick={() =>
                decide.mutate({
                  applicationId: active.id,
                  approve: false,
                  note: note.trim() || undefined,
                })
              }
              variant="outline"
            >
              {applicationCopy.reject}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
