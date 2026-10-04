import { Badge } from "@byte-quest/ui/components/badge";
import { Card } from "@byte-quest/ui/components/card";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { orpc } from "@/utils/orpc";

import {
  joinRequestPanelCopy,
  joinRequestStatusBadgeTones,
  joinRequestStatusLabels,
  specialtyBadgeTones,
  specialtyLabels,
} from "./data";

export interface JoinRequestsProps {
  onChanged: () => Promise<void>;
}

export const JoinRequests = ({ onChanged }: JoinRequestsProps) => {
  const requestsQuery = useQuery(orpc.teams.listJoinRequests.queryOptions());

  const decideMutation = useMutation(
    orpc.teams.decideJoinRequest.mutationOptions({
      onError: (error: unknown) => {
        toast.error(
          error instanceof Error ? error.message : joinRequestPanelCopy.failure
        );
      },
      onSuccess: async (decided) => {
        toast.success(
          decided.status === "approved"
            ? joinRequestPanelCopy.approveSuccess
            : joinRequestPanelCopy.rejectSuccess
        );
        await onChanged();
      },
    })
  );

  if (requestsQuery.isPending) {
    return <Skeleton className="h-[180px] w-full" />;
  }

  if (requestsQuery.isError || !requestsQuery.data) {
    return null;
  }

  const requests = requestsQuery.data;
  const pending = requests.filter((request) => request.status === "pending");
  const decided = requests.filter((request) => request.status !== "pending");

  if (requests.length === 0) {
    return null;
  }

  return (
    <div className="border-line-soft grid gap-5 border-t pt-6">
      <div className="grid gap-3">
        <h3 className="font-display text-fg text-[18px] font-semibold tracking-[-0.02em]">
          {joinRequestPanelCopy.pendingTitle}
        </h3>
        {pending.length === 0 ? (
          <p className="text-muted-2 text-[13.5px] leading-[1.6]">
            {joinRequestPanelCopy.emptyPending}
          </p>
        ) : (
          pending.map((request) => (
            <Card
              className="flex flex-wrap items-center justify-between gap-4 p-5"
              key={request.id}
            >
              <div className="min-w-0">
                <div className="font-display text-fg text-[16px] font-semibold">
                  {`${joinRequestPanelCopy.gradePrefix}${request.grade}`}
                </div>
                <div className="text-muted-2 mt-1 text-[13.5px] leading-[1.5]">
                  {request.specialty === null
                    ? joinRequestPanelCopy.noSpecialty
                    : specialtyLabels[request.specialty]}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  aria-busy={decideMutation.isPending}
                  disabled={decideMutation.isPending}
                  onClick={() => {
                    decideMutation.mutate({
                      approve: true,
                      requestId: request.id,
                    });
                  }}
                  size="sm"
                >
                  {joinRequestPanelCopy.approveLabel}
                </Button>
                <Button
                  disabled={decideMutation.isPending}
                  onClick={() => {
                    decideMutation.mutate({
                      approve: false,
                      requestId: request.id,
                    });
                  }}
                  size="sm"
                  variant="outline"
                >
                  {joinRequestPanelCopy.rejectLabel}
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {decided.length === 0 ? null : (
        <div className="grid gap-3">
          <h3 className="font-display text-fg text-[18px] font-semibold tracking-[-0.02em]">
            {joinRequestPanelCopy.decidedTitle}
          </h3>
          <TableWrapper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadCell>
                    {joinRequestPanelCopy.gradeColumn}
                  </TableHeadCell>
                  <TableHeadCell>
                    {joinRequestPanelCopy.specialtyColumn}
                  </TableHeadCell>
                  <TableHeadCell>
                    {joinRequestPanelCopy.statusColumn}
                  </TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {decided.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="text-fg font-medium">
                      {`${joinRequestPanelCopy.gradePrefix}${request.grade}`}
                    </TableCell>
                    <TableCell>
                      {request.specialty === null ? (
                        <span className="text-faint-2">
                          {joinRequestPanelCopy.noSpecialty}
                        </span>
                      ) : (
                        <Badge tone={specialtyBadgeTones[request.specialty]}>
                          {specialtyLabels[request.specialty]}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge tone={joinRequestStatusBadgeTones[request.status]}>
                        {joinRequestStatusLabels[request.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        </div>
      )}
    </div>
  );
};
