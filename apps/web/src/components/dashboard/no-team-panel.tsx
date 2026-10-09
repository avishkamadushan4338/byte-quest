import { EmptyState } from "@byte-quest/ui/components/callout";
import {
  ComboboxField,
  RadioCardField,
  TextField,
} from "@byte-quest/ui/components/fields";
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

import type { CreateTeamErrors, CreateTeamForm, Division } from "./data";
import {
  createTeamCopy,
  divisionLabels,
  divisionPlatforms,
  divisionRanges,
  initialCreateTeamForm,
  noTeamCopy,
  validationCopy,
} from "./data";

export interface NoTeamPanelProps {
  division: Division;
  onChanged: () => Promise<void>;
  onFindTeam: () => void;
}

const validate = (form: CreateTeamForm): CreateTeamErrors => {
  const errors: CreateTeamErrors = {};

  if (form.name.trim().length === 0) {
    errors.name = validationCopy.nameRequired;
  }
  if (form.schoolId === null) {
    errors.schoolId = validationCopy.schoolRequired;
  }

  return errors;
};

export const NoTeamPanel = ({
  division,
  onChanged,
  onFindTeam,
}: NoTeamPanelProps) => {
  const [open, setOpen] = useState(false);
  const [lockedDivision, setLockedDivision] = useState(division);
  const [form, setForm] = useState<CreateTeamForm>(initialCreateTeamForm);
  const [errors, setErrors] = useState<CreateTeamErrors>({});

  const schoolsQuery = useQuery(orpc.schools.list.queryOptions());

  const createMutation = useMutation(
    orpc.teams.create.mutationOptions({
      onError: (error: unknown) => {
        toast.error(
          error instanceof Error ? error.message : createTeamCopy.failure
        );
      },
      onSuccess: async () => {
        toast.success(createTeamCopy.success);
        setForm(initialCreateTeamForm);
        setOpen(false);
        await onChanged();
      },
    })
  );

  const schoolOptions = (schoolsQuery.data ?? []).map((school) => ({
    label: `${school.name} - ${school.city}`,
    value: school.id,
  }));

  const divisionOptions = [
    {
      description: divisionRanges[division],
      meta: (
        <span className="flex flex-wrap gap-1.5">
          {divisionPlatforms[division].map((platform) => (
            <span
              className="border-line-strong text-muted-2 rounded-full border px-2.5 py-1 font-mono text-[12.5px] tracking-[0.1em] uppercase"
              key={platform}
            >
              {platform}
            </span>
          ))}
        </span>
      ),
      title: divisionLabels[lockedDivision],
      value: lockedDivision,
    },
  ];

  const submit = () => {
    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || form.schoolId === null) {
      toast.error(validationCopy.incomplete);
      return;
    }

    createMutation.mutate({
      division: lockedDivision,
      name: form.name.trim(),
      schoolId: form.schoolId,
    });
  };

  return (
    <EmptyState
      action={
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <AlertDialogRoot onOpenChange={setOpen} open={open}>
            <AlertDialogTrigger render={<Button />}>
              {noTeamCopy.createLabel}
            </AlertDialogTrigger>
            <AlertDialogPortal>
              <AlertDialogBackdrop />
              <AlertDialogViewport>
                <AlertDialogPopup className="max-w-[560px]">
                  <AlertDialogTitle>
                    {createTeamCopy.dialogTitle}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {createTeamCopy.dialogDescription}
                  </AlertDialogDescription>

                  <div className="mt-7 grid gap-5">
                    {schoolsQuery.isPending ? (
                      <Skeleton className="h-[62px] w-full" />
                    ) : (
                      <ComboboxField
                        description={createTeamCopy.schoolDescription}
                        error={errors.schoolId}
                        id="create-team-school"
                        label={createTeamCopy.schoolLabel}
                        onValueChange={(value) => {
                          setErrors((current) => ({
                            ...current,
                            schoolId: undefined,
                          }));
                          setForm((current) => ({
                            ...current,
                            schoolId: value,
                          }));
                        }}
                        options={schoolOptions}
                        placeholder={createTeamCopy.schoolPlaceholder}
                        required
                        value={form.schoolId}
                      />
                    )}

                    <TextField
                      error={errors.name}
                      id="create-team-name"
                      label={createTeamCopy.nameLabel}
                      onValueChange={(value) => {
                        setErrors((current) => ({
                          ...current,
                          name: undefined,
                        }));
                        setForm((current) => ({ ...current, name: value }));
                      }}
                      placeholder={createTeamCopy.namePlaceholder}
                      required
                      value={form.name}
                    />

                    <RadioCardField
                      legend={createTeamCopy.divisionLegend}
                      name="create-team-division"
                      onValueChange={() => {
                        setLockedDivision(division);
                      }}
                      options={divisionOptions}
                      value={lockedDivision}
                    />
                  </div>

                  <div className="mt-7 flex flex-wrap items-center gap-2.5">
                    <Button
                      aria-busy={createMutation.isPending}
                      disabled={createMutation.isPending}
                      onClick={submit}
                    >
                      {createMutation.isPending
                        ? createTeamCopy.submittingLabel
                        : createTeamCopy.submitLabel}
                    </Button>
                    <AlertDialogClose variant="outline">
                      {createTeamCopy.cancelLabel}
                    </AlertDialogClose>
                  </div>
                </AlertDialogPopup>
              </AlertDialogViewport>
            </AlertDialogPortal>
          </AlertDialogRoot>

          <Button onClick={onFindTeam} variant="outline">
            {noTeamCopy.findLabel}
          </Button>
        </div>
      }
      description={noTeamCopy.emptyDescription}
      title={noTeamCopy.emptyTitle}
    />
  );
};
