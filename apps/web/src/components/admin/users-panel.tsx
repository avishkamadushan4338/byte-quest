import { Badge } from "@byte-quest/ui/components/badge";
import { EmptyState } from "@byte-quest/ui/components/callout";
import { SelectField, TextField } from "@byte-quest/ui/components/fields";
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
  AlertDialogViewport,
} from "@byte-quest/ui/primitives/alert-dialog";
import { Button } from "@byte-quest/ui/primitives/button";
import { Skeleton } from "@byte-quest/ui/primitives/skeleton";
import { KeyIcon, UserPlusIcon } from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { orpc } from "@/utils/orpc";

import { Credentials } from "./credentials";
import type { UserRole } from "./data";
import { roleBadgeTones, roleLabels, usersCopy, usersEmpty } from "./data";

const SKELETON_KEYS = ["skeleton-1", "skeleton-2", "skeleton-3", "skeleton-4"];

const PAGE_SIZE = 25;

interface PasswordDialogState {
  fullName: string;
  open: boolean;
  password: string;
  username?: string;
  isNewUser?: boolean;
}

interface NewUserForm {
  email: string;
  fullName: string;
  open: boolean;
  role: UserRole;
}

export const UsersPanel = () => {
  const queryClient = useQueryClient();
  const [pageIndex, setPageIndex] = useState(0);
  const users = useQuery(
    orpc.access.listUsers.queryOptions({
      input: { limit: PAGE_SIZE, offset: pageIndex * PAGE_SIZE },
    })
  );
  const me = useQuery(orpc.access.me.queryOptions());
  const [rotatedCreds, setRotatedCreds] = useState<PasswordDialogState>({
    fullName: "",
    open: false,
    password: "",
  });

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

  const rotatePassword = useMutation(
    orpc.access.rotateUserPassword.mutationOptions({
      onError: (error) => {
        toast.error(error.message || "Failed to rotate password");
      },
      onSuccess: (data) => {
        setRotatedCreds({
          fullName: data.fullName,
          open: true,
          password: data.password,
        });
        toast.success(usersCopy.rotatePasswordSuccess);
      },
    })
  );

  const [newUser, setNewUser] = useState<NewUserForm>({
    email: "",
    fullName: "",
    open: false,
    role: "student",
  });

  const createUser = useMutation(
    orpc.access.createUser.mutationOptions({
      onError: (error) => {
        toast.error(error.message || "Failed to create user");
      },
      onSuccess: async (data) => {
        setNewUser((prev) => ({ ...prev, open: false }));
        await queryClient.invalidateQueries({
          queryKey: orpc.access.listUsers.key(),
        });
        setRotatedCreds({
          fullName: data.fullName,
          isNewUser: true,
          open: true,
          password: data.password,
          username: data.username,
        });
        toast.success(usersCopy.addUserSuccess);
      },
    })
  );

  const handleRoleChange = (userId: string, role: UserRole) => {
    setRole.mutate({ userId, role });
  };

  const handleRotatePassword = (userId: string, role: UserRole) => {
    if (role === "admin") {
      toast.error(usersCopy.rotateAdminForbidden);
      return;
    }
    rotatePassword.mutate({ userId });
  };

  const rows = users.data?.items ?? [];
  const total = users.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          onClick={() =>
            setNewUser({
              email: "",
              fullName: "",
              open: true,
              role: "student",
            })
          }
        >
          <UserPlusIcon aria-hidden="true" className="mr-1.5 size-4" />
          {usersCopy.addUser}
        </Button>
      </div>

      {users.isPending ? (
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>Username / ID</TableHeadCell>
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
                <TableHeadCell>Username / ID</TableHeadCell>
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
                      <div className="flex flex-col">
                        {user.username ? (
                          <span className="text-volt font-mono text-[13px] font-semibold">
                            @{user.username}
                          </span>
                        ) : null}
                        <span className="text-muted-2 inline-block max-w-[180px] truncate align-bottom font-mono text-[11.5px]">
                          {user.userId}
                        </span>
                      </div>
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
                        {user.role === "admin" ? null : (
                          <Button
                            disabled={rotatePassword.isPending}
                            onClick={() =>
                              handleRotatePassword(user.userId, user.role)
                            }
                            size="sm"
                            variant="outline"
                          >
                            <KeyIcon
                              aria-hidden="true"
                              className="mr-1 size-3.5"
                            />
                            {usersCopy.rotatePassword}
                          </Button>
                        )}
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

      {total > PAGE_SIZE ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-muted font-mono text-[12.5px]">
            {pageIndex * PAGE_SIZE + 1}–
            {Math.min(total, pageIndex * PAGE_SIZE + rows.length)} of {total}
          </span>
          <div className="flex gap-2">
            <Button
              disabled={pageIndex === 0}
              onClick={() => setPageIndex((prev) => prev - 1)}
              size="sm"
              variant="outline"
            >
              Previous
            </Button>
            <Button
              disabled={pageIndex + 1 >= pageCount}
              onClick={() => setPageIndex((prev) => prev + 1)}
              size="sm"
              variant="outline"
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}

      <AlertDialogRoot
        onOpenChange={(open) => {
          if (!open) {
            setRotatedCreds((prev) => ({ ...prev, open: false }));
          }
        }}
        open={rotatedCreds.open}
      >
        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogViewport>
            <AlertDialogPopup className="max-w-[480px]">
              <div className="flex items-center gap-2.5">
                <div className="text-volt flex size-9 shrink-0 items-center justify-center rounded-full bg-[rgba(82,255,61,0.12)]">
                  <KeyIcon aria-hidden="true" className="size-5" />
                </div>
                <div>
                  <AlertDialogTitle>
                    {usersCopy.rotatePasswordTitle}
                  </AlertDialogTitle>
                  <p className="text-muted text-[13px] font-medium">
                    {rotatedCreds.fullName}
                  </p>
                </div>
              </div>

              <AlertDialogDescription className="mt-3">
                {usersCopy.rotatePasswordDescription}
              </AlertDialogDescription>

              <Credentials
                className="mt-5"
                password={rotatedCreds.password}
                passwordLabel={
                  rotatedCreds.isNewUser ? "Temporary Password" : "New Password"
                }
                showUsername={Boolean(rotatedCreds.username)}
                username={rotatedCreds.username ?? ""}
              />

              <div className="mt-6 flex justify-end">
                <AlertDialogClose
                  render={
                    <Button
                      onClick={() =>
                        setRotatedCreds((prev) => ({ ...prev, open: false }))
                      }
                      variant="primary"
                    >
                      {usersCopy.closeDialog}
                    </Button>
                  }
                />
              </div>
            </AlertDialogPopup>
          </AlertDialogViewport>
        </AlertDialogPortal>
      </AlertDialogRoot>

      {/* Add User Dialog */}
      <AlertDialogRoot
        onOpenChange={(open) => {
          if (!open) {
            setNewUser((prev) => ({ ...prev, open: false }));
          }
        }}
        open={newUser.open}
      >
        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogViewport>
            <AlertDialogPopup className="max-w-[480px]">
              <div className="flex items-center gap-2.5">
                <div className="text-volt flex size-9 shrink-0 items-center justify-center rounded-full bg-[rgba(82,255,61,0.12)]">
                  <UserPlusIcon aria-hidden="true" className="size-5" />
                </div>
                <div>
                  <AlertDialogTitle>{usersCopy.addUserTitle}</AlertDialogTitle>
                  <p className="text-muted text-[13px] font-medium">
                    {usersCopy.addUserDescription}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                <TextField
                  id="new-user-fullname"
                  label="Full Name"
                  onValueChange={(val) =>
                    setNewUser((prev) => ({ ...prev, fullName: val }))
                  }
                  placeholder="e.g. Kasun Perera"
                  required
                  value={newUser.fullName}
                />

                <TextField
                  id="new-user-email"
                  label="Email (Optional)"
                  onValueChange={(val) =>
                    setNewUser((prev) => ({ ...prev, email: val }))
                  }
                  placeholder="e.g. kasun@example.com"
                  type="email"
                  value={newUser.email}
                />

                <div className="flex flex-col gap-1.5">
                  <SelectField
                    id="new-user-role"
                    label="Role"
                    onValueChange={(val) =>
                      setNewUser((prev) => ({
                        ...prev,
                        role: (val ?? "student") as UserRole,
                      }))
                    }
                    options={[
                      { value: "student", label: "Student" },
                      { value: "leader", label: "Team Leader" },
                      { value: "volunteer", label: "Volunteer" },
                      { value: "mic", label: "MIC (Teacher)" },
                      { value: "admin", label: "Admin" },
                    ]}
                    value={newUser.role}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2.5">
                <Button
                  onClick={() =>
                    setNewUser((prev) => ({ ...prev, open: false }))
                  }
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  disabled={!newUser.fullName.trim() || createUser.isPending}
                  onClick={() => {
                    createUser.mutate({
                      fullName: newUser.fullName.trim(),
                      role: newUser.role,
                      email: newUser.email.trim() || undefined,
                    });
                  }}
                  variant="primary"
                >
                  Create user
                </Button>
              </div>
            </AlertDialogPopup>
          </AlertDialogViewport>
        </AlertDialogPortal>
      </AlertDialogRoot>
    </div>
  );
};
