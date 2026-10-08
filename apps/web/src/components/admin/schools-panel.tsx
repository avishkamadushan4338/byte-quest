import { EmptyState } from "@byte-quest/ui/components/callout";
import { TextField } from "@byte-quest/ui/components/fields";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import {
  findSchoolByName,
  schoolNameOptions,
} from "@/components/register/school-catalog";
import { ComboboxField } from "@/components/site/design-fields";
import { orpc } from "@/utils/orpc";

import type { AdminSchool, SchoolDialogState, SchoolFormErrors } from "./data";
import {
  schoolsCopy,
  schoolsEmpty,
  schoolsEmptyFields,
  schoolValidation,
} from "./data";

const SKELETON_KEYS = ["skeleton-1", "skeleton-2", "skeleton-3"];

const validateSchool = (dialog: SchoolDialogState): SchoolFormErrors => {
  const errors: SchoolFormErrors = {};

  if (dialog.name.trim().length === 0) {
    errors.name = schoolValidation.required;
  }
  if (dialog.city.trim().length === 0) {
    errors.city = schoolValidation.required;
  }

  return errors;
};

export const SchoolsPanel = () => {
  const queryClient = useQueryClient();
  const schools = useQuery(orpc.schools.list.queryOptions());
  const [dialog, setDialog] = useState<SchoolDialogState>(schoolsEmptyFields);
  const [errors, setErrors] = useState<SchoolFormErrors>({});

  const closeDialog = () => {
    setDialog(schoolsEmptyFields);
    setErrors({});
  };

  const invalidateSchools = () =>
    queryClient.invalidateQueries({ queryKey: orpc.schools.list.key() });

  const createSchool = useMutation(
    orpc.schools.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message || schoolsCopy.failureMessage);
      },
      onSuccess: async () => {
        closeDialog();
        await invalidateSchools();
        toast.success(schoolsCopy.createdMessage);
      },
    })
  );

  const updateSchool = useMutation(
    orpc.schools.update.mutationOptions({
      onError: (error) => {
        toast.error(error.message || schoolsCopy.failureMessage);
      },
      onSuccess: async () => {
        closeDialog();
        await invalidateSchools();
        toast.success(schoolsCopy.updatedMessage);
      },
    })
  );

  const busy = createSchool.isPending || updateSchool.isPending;

  const openCreate = () => {
    setErrors({});
    setDialog({ city: "", id: null, name: "", open: true });
  };

  const openEdit = (school: AdminSchool) => {
    setErrors({});
    setDialog({
      city: school.city,
      id: school.id,
      name: school.name,
      open: true,
    });
  };

  const handleSave = () => {
    const nextErrors = validateSchool(dialog);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (dialog.id === null) {
      createSchool.mutate({
        city: dialog.city.trim(),
        name: dialog.name.trim(),
      });
      return;
    }

    updateSchool.mutate({
      city: dialog.city.trim(),
      id: dialog.id,
      name: dialog.name.trim(),
    });
  };

  const rows = schools.data ?? [];

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button disabled={busy} onClick={openCreate}>
          {schoolsCopy.addLabel}
        </Button>
      </div>

      {schools.isPending ? (
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>City</TableHeadCell>
                <TableHeadCell>ID</TableHeadCell>
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
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-9 w-20" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      ) : null}

      {schools.isSuccess && rows.length === 0 ? (
        <EmptyState
          action={
            <Button disabled={busy} onClick={openCreate} variant="outline">
              {schoolsCopy.addLabel}
            </Button>
          }
          description={schoolsEmpty.description}
          title={schoolsEmpty.title}
        />
      ) : null}

      {rows.length > 0 ? (
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>City</TableHeadCell>
                <TableHeadCell>ID</TableHeadCell>
                <TableHeadCell>Actions</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((school) => (
                <TableRow key={school.id}>
                  <TableCell>
                    <span className="font-display text-fg font-semibold">
                      {school.name}
                    </span>
                  </TableCell>
                  <TableCell>{school.city}</TableCell>
                  <TableCell>
                    <span className="text-muted-2 inline-block max-w-[180px] truncate align-bottom font-mono text-[12.5px]">
                      {school.id}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      disabled={busy}
                      onClick={() => openEdit(school)}
                      size="sm"
                      variant="outline"
                    >
                      {schoolsCopy.editLabel}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      ) : null}

      <AlertDialogRoot
        onOpenChange={(next) => {
          if (!next) {
            closeDialog();
          }
        }}
        open={dialog.open}
      >
        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogViewport>
            <AlertDialogPopup className="sm:max-w-[520px]">
              <AlertDialogTitle>
                {dialog.id === null
                  ? schoolsCopy.createTitle
                  : schoolsCopy.editTitle}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {schoolsCopy.formDescription}
              </AlertDialogDescription>

              <div className="mt-6 grid gap-4">
                <ComboboxField
                  allowFreeText
                  error={errors.name}
                  id="school-name"
                  label="Name"
                  onValueChange={(value) => {
                    const match = findSchoolByName(value);
                    if (match) {
                      setDialog((current) => ({
                        ...current,
                        name: match.name,
                        city: current.city || match.district,
                      }));
                      return;
                    }
                    setDialog((current) => ({ ...current, name: value }));
                  }}
                  options={schoolNameOptions}
                  placeholder="e.g. Richmond College"
                  requirement="required"
                  value={dialog.name}
                />
                <TextField
                  error={errors.city}
                  id="school-city"
                  label="City"
                  onValueChange={(value) =>
                    setDialog((current) => ({ ...current, city: value }))
                  }
                  placeholder="e.g. Galle"
                  required
                  value={dialog.city}
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-end gap-2.5">
                <AlertDialogClose variant="ghost">
                  {schoolsCopy.cancelLabel}
                </AlertDialogClose>
                <Button aria-busy={busy} disabled={busy} onClick={handleSave}>
                  {schoolsCopy.saveLabel}
                </Button>
              </div>
            </AlertDialogPopup>
          </AlertDialogViewport>
        </AlertDialogPortal>
      </AlertDialogRoot>
    </div>
  );
};
