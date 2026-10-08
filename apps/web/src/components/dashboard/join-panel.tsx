import { Callout } from "@byte-quest/ui/components/callout";
import { Card } from "@byte-quest/ui/components/card";
import { DataItem, DataList } from "@byte-quest/ui/components/data-list";
import {
  ComboboxField,
  SelectField,
  TextField,
} from "@byte-quest/ui/components/fields";
import { Kicker } from "@byte-quest/ui/components/kicker";
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

import type { Division, Specialty } from "./data";
import {
  divisionLabels,
  divisionRanges,
  joinPanelCopy,
  joinRequestCopy,
  SPECIALTIES,
  specialtyOptions,
  validationCopy,
} from "./data";

export interface JoinPanelProps {
  division: Division;
  onBack: () => void;
}

interface JoinRequestErrors {
  teamId?: string;
  specialty?: string;
}

const toSpecialty = (value: string | null): Specialty | null => {
  if (value === null) {
    return null;
  }
  return SPECIALTIES.find((entry) => entry === value) ?? null;
};

export const JoinPanel = ({ division, onBack }: JoinPanelProps) => {
  const [open, setOpen] = useState(false);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [teamId, setTeamId] = useState("");
  const [specialty, setSpecialty] = useState<Specialty | null>(null);
  const [errors, setErrors] = useState<JoinRequestErrors>({});

  const schoolsQuery = useQuery(orpc.schools.list.queryOptions());

  const slotsMutation = useMutation(
    orpc.schools.get.mutationOptions({
      onError: (error: unknown) => {
        toast.error(
          error instanceof Error ? error.message : joinPanelCopy.failure
        );
      },
    })
  );

  const requestMutation = useMutation(
    orpc.teams.requestToJoin.mutationOptions({
      onError: (error: unknown) => {
        toast.error(
          error instanceof Error ? error.message : joinRequestCopy.failure
        );
      },
      onSuccess: () => {
        toast.success(joinRequestCopy.success);
        setOpen(false);
      },
    })
  );

  const schoolOptions = (schoolsQuery.data ?? []).map((school) => ({
    label: `${school.name} - ${school.city}`,
    value: school.id,
  }));

  const slots =
    slotsMutation.data?.id === schoolId ? slotsMutation.data : undefined;

  const primaryTaken = slots ? slots.primarySlotsUsed > 0 : false;
  const secondaryTaken = slots ? slots.secondarySlotsUsed > 0 : false;
  const divisionSlotTaken =
    division === "primary" ? primaryTaken : secondaryTaken;

  const submit = () => {
    const nextErrors: JoinRequestErrors = {};
    const trimmed = teamId.trim();

    if (trimmed.length === 0) {
      nextErrors.teamId = validationCopy.teamIdRequired;
    }
    if (specialty === null) {
      nextErrors.specialty = validationCopy.specialtyRequired;
    }
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || specialty === null) {
      toast.error(validationCopy.incomplete);
      return;
    }

    requestMutation.mutate({ specialty, teamId: trimmed });
  };

  return (
    <Card className="grid gap-6 p-[clamp(22px,3.5vw,36px)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-[560px]">
          <Kicker tone="teal">{joinPanelCopy.rulesTitle}</Kicker>
          <h2 className="font-display mt-4 text-[clamp(24px,3vw,34px)] font-bold tracking-[-0.02em]">
            {joinPanelCopy.title}
          </h2>
          <p className="text-muted mt-3 text-[15px] leading-[1.6]">
            {joinPanelCopy.description}
          </p>
        </div>
        <Button aria-label={joinPanelCopy.backAriaLabel} onClick={onBack}>
          {joinPanelCopy.backLabel}
        </Button>
      </div>

      <Callout title={joinPanelCopy.rulesTitle} tone="info">
        {joinPanelCopy.rulesBody}
      </Callout>

      {schoolsQuery.isPending ? (
        <Skeleton className="h-[62px] w-full" />
      ) : (
        <ComboboxField
          description={divisionRanges[division]}
          id="join-school"
          label={joinPanelCopy.schoolLabel}
          onValueChange={(value) => {
            setSchoolId(value);
            slotsMutation.reset();
          }}
          options={schoolOptions}
          placeholder={joinPanelCopy.schoolPlaceholder}
          value={schoolId}
        />
      )}

      <div className="flex flex-wrap items-center gap-2.5">
        <Button
          aria-busy={slotsMutation.isPending}
          disabled={schoolId === null || slotsMutation.isPending}
          onClick={() => {
            if (schoolId === null) {
              return;
            }
            slotsMutation.mutate({ id: schoolId });
          }}
          variant="outline"
        >
          {slotsMutation.isPending
            ? joinPanelCopy.checkingLabel
            : joinPanelCopy.checkLabel}
        </Button>

        {slots ? (
          <AlertDialogRoot onOpenChange={setOpen} open={open}>
            <AlertDialogTrigger render={<Button />}>
              {joinRequestCopy.triggerLabel}
            </AlertDialogTrigger>
            <AlertDialogPortal>
              <AlertDialogBackdrop />
              <AlertDialogViewport>
                <AlertDialogPopup>
                  <AlertDialogTitle>
                    {joinRequestCopy.dialogTitle}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {joinRequestCopy.dialogDescription}
                  </AlertDialogDescription>

                  <div className="mt-7 grid gap-5">
                    <TextField
                      description={joinRequestCopy.teamIdDescription}
                      error={errors.teamId}
                      id="join-team-id"
                      label={joinRequestCopy.teamIdLabel}
                      onValueChange={(value) => {
                        setErrors((current) => ({
                          ...current,
                          teamId: undefined,
                        }));
                        setTeamId(value);
                      }}
                      placeholder={joinRequestCopy.teamIdPlaceholder}
                      required
                      value={teamId}
                    />
                    <SelectField
                      error={errors.specialty}
                      id="join-specialty"
                      label={joinRequestCopy.specialtyLabel}
                      onValueChange={(value) => {
                        setErrors((current) => ({
                          ...current,
                          specialty: undefined,
                        }));
                        setSpecialty(toSpecialty(value));
                      }}
                      options={specialtyOptions}
                      required
                      value={specialty}
                    />
                  </div>

                  <div className="mt-7 flex flex-wrap items-center gap-2.5">
                    <Button
                      aria-busy={requestMutation.isPending}
                      disabled={requestMutation.isPending}
                      onClick={submit}
                    >
                      {requestMutation.isPending
                        ? joinRequestCopy.submittingLabel
                        : joinRequestCopy.submitLabel}
                    </Button>
                    <AlertDialogClose variant="outline">
                      {joinRequestCopy.cancelLabel}
                    </AlertDialogClose>
                  </div>
                </AlertDialogPopup>
              </AlertDialogViewport>
            </AlertDialogPortal>
          </AlertDialogRoot>
        ) : null}
      </div>

      {slots ? (
        <>
          <DataList
            className="border-line-soft rounded-[14px] border p-5"
            columns="minmax(min(100%,140px),1fr)"
          >
            <DataItem
              label={`${divisionLabels.primary} · ${divisionRanges.primary}`}
              value={
                primaryTaken
                  ? joinPanelCopy.slotsTaken
                  : joinPanelCopy.slotsFree
              }
            />
            <DataItem
              label={`${divisionLabels.secondary} · ${divisionRanges.secondary}`}
              value={
                secondaryTaken
                  ? joinPanelCopy.slotsTaken
                  : joinPanelCopy.slotsFree
              }
            />
          </DataList>
          <p className="text-muted-2 text-[13px] leading-[1.6]">
            {joinPanelCopy.slotsHint}
          </p>
          <Callout
            title={joinPanelCopy.slotsTitle}
            tone={divisionSlotTaken ? "success" : "warning"}
          >
            {divisionSlotTaken
              ? joinPanelCopy.slotAvailable
              : joinPanelCopy.slotUnavailable}
          </Callout>
        </>
      ) : null}
    </Card>
  );
};
