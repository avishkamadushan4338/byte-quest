import { Badge } from "@byte-quest/ui/components/badge";
import { Callout, EmptyState } from "@byte-quest/ui/components/callout";
import { Card } from "@byte-quest/ui/components/card";
import { DataItem, DataList } from "@byte-quest/ui/components/data-list";
import {
  ComboboxField,
  TextareaField,
  TextField,
} from "@byte-quest/ui/components/fields";
import { Kicker } from "@byte-quest/ui/components/kicker";
import { DefinitionTable } from "@byte-quest/ui/components/table";
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

import type {
  DashboardMe,
  DashboardSubmission,
  DashboardTeam,
  School,
  SubmissionErrors,
  SubmissionForm,
} from "./data";
import {
  divisionLabels,
  divisionRanges,
  initialSubmissionForm,
  joinPanelCopy,
  submissionCopy,
  submissionStatusBadgeTones,
  submissionStatusLabels,
  validationCopy,
} from "./data";

export interface SubmissionPanelProps {
  me: DashboardMe;
  onChanged: () => Promise<void>;
  submission: DashboardSubmission | null;
  team: DashboardTeam | null;
}

export interface SubmissionEditorDialogProps {
  onChanged: () => Promise<void>;
  submission: DashboardSubmission | null;
}

export interface SubmissionForwardDialogProps {
  onChanged: () => Promise<void>;
  submissionId: string;
}

const REPO_URL_PATTERN = /^https?:\/\/\S+$/u;

const toSchoolOptions = (schools: School[] | undefined) =>
  (schools ?? []).map((school) => ({
    label: `${school.name} - ${school.city}`,
    value: school.id,
  }));

const formatDate = (value: string | null): string | null =>
  value === null ? null : value.slice(0, 10);

const SlotCounts = ({
  primaryUsed,
  secondaryUsed,
}: {
  primaryUsed: number;
  secondaryUsed: number;
}) => (
  <DataList
    className="border-line-soft rounded-[14px] border p-5"
    columns="minmax(min(100%,140px),1fr)"
  >
    <DataItem
      label={`${divisionLabels.primary} · ${divisionRanges.primary}`}
      value={
        primaryUsed > 0 ? joinPanelCopy.slotsTaken : joinPanelCopy.slotsFree
      }
    />
    <DataItem
      label={`${divisionLabels.secondary} · ${divisionRanges.secondary}`}
      value={
        secondaryUsed > 0 ? joinPanelCopy.slotsTaken : joinPanelCopy.slotsFree
      }
    />
  </DataList>
);

const SubmissionHeader = ({
  submission,
}: {
  submission: DashboardSubmission | null;
}) => (
  <div className="flex flex-wrap items-start justify-between gap-4">
    <div className="min-w-0">
      <Kicker tone="teal">{submissionCopy.sectionKicker}</Kicker>
      <h2 className="font-display mt-4 text-[clamp(24px,3vw,34px)] font-bold tracking-[-0.02em]">
        {submission?.title ?? submissionCopy.emptyTitle}
      </h2>
    </div>
    {submission ? (
      <Badge
        className={
          submission.status === "rejected"
            ? "border-destructive/40 text-destructive"
            : undefined
        }
        tone={submissionStatusBadgeTones[submission.status]}
      >
        {submissionStatusLabels[submission.status]}
      </Badge>
    ) : null}
  </div>
);

export const SubmissionEditorDialog = ({
  onChanged,
  submission,
}: SubmissionEditorDialogProps) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<SubmissionForm>(initialSubmissionForm);
  const [errors, setErrors] = useState<SubmissionErrors>({});

  const isEditing = submission !== null;

  const openMutation = useMutation(
    orpc.submissions.open.mutationOptions({
      onError: (error: unknown) => {
        toast.error(
          error instanceof Error ? error.message : submissionCopy.failure
        );
      },
      onSuccess: async () => {
        toast.success(submissionCopy.openSuccess);
        setOpen(false);
        await onChanged();
      },
    })
  );

  const updateMutation = useMutation(
    orpc.submissions.update.mutationOptions({
      onError: (error: unknown) => {
        toast.error(
          error instanceof Error ? error.message : submissionCopy.failure
        );
      },
      onSuccess: async () => {
        toast.success(submissionCopy.editSuccess);
        setOpen(false);
        await onChanged();
      },
    })
  );

  const pending = openMutation.isPending || updateMutation.isPending;

  const showEditor = () => {
    setForm({
      description: submission?.description ?? "",
      repoUrl: submission?.repoUrl ?? "",
      title: submission?.title ?? "",
    });
    setErrors({});
    setOpen(true);
  };

  const submit = () => {
    const nextErrors: SubmissionErrors = {};
    const title = form.title.trim();
    const description = form.description.trim();
    const repoUrl = form.repoUrl.trim();

    if (title.length === 0) {
      nextErrors.title = validationCopy.titleRequired;
    }
    if (description.length === 0) {
      nextErrors.description = validationCopy.descriptionRequired;
    }
    if (repoUrl.length > 0 && !REPO_URL_PATTERN.test(repoUrl)) {
      nextErrors.repoUrl = validationCopy.repoUrlInvalid;
    }
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error(validationCopy.incomplete);
      return;
    }

    if (submission) {
      updateMutation.mutate({
        description,
        repoUrl,
        submissionId: submission.id,
        title,
      });
      return;
    }

    openMutation.mutate(
      repoUrl.length > 0
        ? { description, repoUrl, title }
        : { description, title }
    );
  };

  return (
    <AlertDialogRoot onOpenChange={setOpen} open={open}>
      <AlertDialogTrigger
        render={
          <Button
            onClick={showEditor}
            variant={isEditing ? "outline" : "primary"}
          />
        }
      >
        {isEditing ? submissionCopy.editLabel : submissionCopy.openLabel}
      </AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogBackdrop />
        <AlertDialogViewport>
          <AlertDialogPopup className="max-w-[600px]">
            <AlertDialogTitle>
              {isEditing
                ? submissionCopy.editDialogTitle
                : submissionCopy.openDialogTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isEditing
                ? submissionCopy.editDialogDescription
                : submissionCopy.openDialogDescription}
            </AlertDialogDescription>

            <div className="mt-7 grid gap-5">
              <TextField
                error={errors.title}
                id="submission-title"
                label={submissionCopy.titleLabel}
                onValueChange={(value) => {
                  setErrors((current) => ({ ...current, title: undefined }));
                  setForm((current) => ({ ...current, title: value }));
                }}
                placeholder={submissionCopy.titlePlaceholder}
                required
                value={form.title}
              />
              <TextareaField
                error={errors.description}
                id="submission-description"
                label={submissionCopy.descriptionLabel}
                onValueChange={(value) => {
                  setErrors((current) => ({
                    ...current,
                    description: undefined,
                  }));
                  setForm((current) => ({ ...current, description: value }));
                }}
                required
                rows={5}
                value={form.description}
              />
              <TextField
                error={errors.repoUrl}
                id="submission-repo"
                label={submissionCopy.repoLabel}
                onValueChange={(value) => {
                  setErrors((current) => ({
                    ...current,
                    repoUrl: undefined,
                  }));
                  setForm((current) => ({ ...current, repoUrl: value }));
                }}
                placeholder={submissionCopy.repoPlaceholder}
                type="url"
                value={form.repoUrl}
              />
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <Button aria-busy={pending} disabled={pending} onClick={submit}>
                {isEditing
                  ? submissionCopy.editSubmitLabel
                  : submissionCopy.openSubmitLabel}
              </Button>
              <AlertDialogClose variant="outline">
                {submissionCopy.cancelLabel}
              </AlertDialogClose>
            </div>
          </AlertDialogPopup>
        </AlertDialogViewport>
      </AlertDialogPortal>
    </AlertDialogRoot>
  );
};

export const SubmissionForwardDialog = ({
  onChanged,
  submissionId,
}: SubmissionForwardDialogProps) => {
  const [open, setOpen] = useState(false);
  const [schoolId, setSchoolId] = useState<string | null>(null);

  const schoolsQuery = useQuery(orpc.schools.list.queryOptions());
  const slotsQuery = useQuery({
    ...orpc.schools.get.queryOptions({ input: { id: schoolId ?? "" } }),
    enabled: schoolId !== null,
  });

  const forwardMutation = useMutation(
    orpc.submissions.forward.mutationOptions({
      onError: (error: unknown) => {
        toast.error(
          error instanceof Error ? error.message : submissionCopy.failure
        );
      },
      onSuccess: async () => {
        toast.success(submissionCopy.forwardSuccess);
        setOpen(false);
        await onChanged();
      },
    })
  );

  const submit = () => {
    if (schoolId === null) {
      toast.error(validationCopy.incomplete);
      return;
    }
    forwardMutation.mutate({ schoolId, submissionId });
  };

  return (
    <AlertDialogRoot onOpenChange={setOpen} open={open}>
      <AlertDialogTrigger render={<Button />}>
        {submissionCopy.forwardLabel}
      </AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogBackdrop />
        <AlertDialogViewport>
          <AlertDialogPopup className="max-w-[600px]">
            <AlertDialogTitle>
              {submissionCopy.forwardDialogTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {submissionCopy.forwardDialogDescription}
            </AlertDialogDescription>

            <div className="mt-7 grid gap-5">
              {schoolsQuery.isPending ? (
                <Skeleton className="h-[62px] w-full" />
              ) : (
                <ComboboxField
                  description={submissionCopy.schoolSlotsHint}
                  id="forward-school"
                  label={submissionCopy.schoolLabel}
                  onValueChange={setSchoolId}
                  options={toSchoolOptions(schoolsQuery.data)}
                  placeholder={submissionCopy.schoolPlaceholder}
                  required
                  value={schoolId}
                />
              )}

              {slotsQuery.data ? (
                <SlotCounts
                  primaryUsed={slotsQuery.data.primarySlotsUsed}
                  secondaryUsed={slotsQuery.data.secondarySlotsUsed}
                />
              ) : null}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <Button
                aria-busy={forwardMutation.isPending}
                disabled={forwardMutation.isPending || schoolId === null}
                onClick={submit}
              >
                {forwardMutation.isPending
                  ? submissionCopy.forwardSubmittingLabel
                  : submissionCopy.forwardSubmitLabel}
              </Button>
              <AlertDialogClose variant="outline">
                {submissionCopy.cancelLabel}
              </AlertDialogClose>
            </div>
          </AlertDialogPopup>
        </AlertDialogViewport>
      </AlertDialogPortal>
    </AlertDialogRoot>
  );
};

export const SubmissionPanel = ({
  me,
  onChanged,
  submission,
  team,
}: SubmissionPanelProps) => {
  const teamId = team?.id ?? null;

  const membersQuery = useQuery({
    ...orpc.teams.listMembers.queryOptions({ input: { teamId: teamId ?? "" } }),
    enabled: teamId !== null,
  });

  const members = membersQuery.data;
  const isLeader =
    members?.find((member) => member.userId === me.userId)?.teamRole ===
    "leader";
  const showLeaderActions = isLeader && submission?.status === "draft";

  if (teamId === null) {
    return (
      <Card className="grid gap-5 p-[clamp(22px,3.5vw,36px)]">
        <SubmissionHeader submission={submission} />
        <Callout title={submissionCopy.noTeamTitle} tone="neutral">
          {submissionCopy.noTeamBody}
        </Callout>
      </Card>
    );
  }

  if (members === undefined) {
    return (
      <Card className="grid gap-5 p-[clamp(22px,3.5vw,36px)]">
        <SubmissionHeader submission={submission} />
        <Skeleton className="h-[220px] w-full" />
      </Card>
    );
  }

  if (submission === null) {
    return (
      <EmptyState
        action={
          isLeader ? (
            <SubmissionEditorDialog
              onChanged={onChanged}
              submission={submission}
            />
          ) : null
        }
        description={submissionCopy.emptyDescription}
        title={submissionCopy.emptyTitle}
      />
    );
  }

  return (
    <Card className="grid gap-6 p-[clamp(22px,3.5vw,36px)]">
      <SubmissionHeader submission={submission} />

      <DefinitionTable
        rows={[
          { label: submissionCopy.titleRow, value: submission.title },
          {
            label: submissionCopy.descriptionRow,
            value: submission.description,
          },
          {
            label: submissionCopy.repoRow,
            value: submission.repoUrl ? (
              <a
                className="text-volt underline-offset-4 hover:underline"
                href={submission.repoUrl}
                rel="noreferrer"
                target="_blank"
              >
                {submission.repoUrl}
                <span className="sr-only">{submissionCopy.openRepoLabel}</span>
              </a>
            ) : (
              submissionCopy.noRepo
            ),
          },
          {
            label: submissionCopy.forwardedRow,
            value:
              formatDate(submission.forwardedAt) ?? submissionCopy.notForwarded,
          },
          {
            label: submissionCopy.reviewedRow,
            value:
              formatDate(submission.reviewedAt) ?? submissionCopy.notReviewed,
          },
        ]}
      />

      {submission.reviewNote ? (
        <Callout title={submissionCopy.reviewNoteTitle} tone="info">
          {submission.reviewNote}
        </Callout>
      ) : null}

      {showLeaderActions && submission ? (
        <div className="border-line-soft flex flex-wrap items-center gap-2.5 border-t pt-5">
          <SubmissionEditorDialog
            onChanged={onChanged}
            submission={submission}
          />
          <SubmissionForwardDialog
            onChanged={onChanged}
            submissionId={submission.id}
          />
        </div>
      ) : null}

      {isLeader ? null : (
        <Callout title={submissionCopy.nonLeaderTitle} tone="info">
          {submissionCopy.nonLeaderBody}
        </Callout>
      )}
    </Card>
  );
};
