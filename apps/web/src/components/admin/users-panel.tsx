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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { orpc } from "@/utils/orpc";

import type { UserRole } from "./data";
import { roleBadgeTones, roleLabels, usersCopy, usersEmpty } from "./data";

const SKELETON_KEYS = ["skeleton-1", "skeleton-2", "skeleton-3", "skeleton-4"];

export const UsersPanel = () => {
  const queryClient = useQueryClient();
  const users = useQuery(orpc.access.listUsers.queryOptions());
  const me = useQuery(orpc.access.me.queryOptions());

  const setRole = useMutation(
    orpc.access.setRole.mutationOptions({
      onError: (error) => {
        toast.error(error.message || usersCopy.failureMessage);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: orpc.access.listUsers.key(),
        });
        toast.success(usersCopy.roleUpdatedMessage);
      },
    })
  );

  const handleRoleChange = (userId: string, role: UserRole) => {
    setRole.mutate({ userId, role });
  };

  const rows = users.data ?? [];

  return (
    <div className="grid gap-5">
      {users.isPending ? (
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>User ID</TableHeadCell>
                <TableHeadCell>Role</TableHeadCell>
                <TableHeadCell>Actions</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {SKELETON_KEYS.map((key) => (
                <TableRow key={key}>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-9 w-44" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      ) : null}

      {users.isSuccess && rows.length === 0 ? (
        <EmptyState
          description={usersEmpty.description}
          title={usersEmpty.title}
        />
      ) : null}

      {rows.length > 0 ? (
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>User ID</TableHeadCell>
                <TableHeadCell>Role</TableHeadCell>
                <TableHeadCell>Actions</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((user) => {
                const isSelf = user.userId === me.data?.userId;

                return (
                  <TableRow key={user.userId}>
                    <TableCell>
                      <span className="font-display text-fg font-semibold">
                        {user.fullName}
                      </span>
                      {isSelf ? (
                        <Badge className="ml-3 align-middle" tone="gold">
                          {usersCopy.youBadge}
                        </Badge>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-2 inline-block max-w-[180px] truncate align-bottom font-mono text-[12.5px]">
                        {user.userId}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge tone={roleBadgeTones[user.role]}>
                        {roleLabels[user.role]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          disabled={
                            isSelf || setRole.isPending || user.role === "admin"
                          }
                          onClick={() => handleRoleChange(user.userId, "admin")}
                          size="sm"
                          variant="outline"
                        >
                          {usersCopy.makeAdmin}
                        </Button>
                        <Button
                          disabled={
                            isSelf ||
                            setRole.isPending ||
                            user.role === "student"
                          }
                          onClick={() =>
                            handleRoleChange(user.userId, "student")
                          }
                          size="sm"
                          variant="outline"
                        >
                          {usersCopy.makeStudent}
                        </Button>
                      </div>
                      {isSelf ? (
                        <span className="text-faint-2 mt-2 block text-[12px]">
                          {usersCopy.ownRowHint}
                        </span>
                      ) : null}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableWrapper>
      ) : null}
    </div>
  );
};
