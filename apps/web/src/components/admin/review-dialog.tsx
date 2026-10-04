import { TextareaField } from "@byte-quest/ui/components/fields";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { orpc } from "@/utils/orpc";

import type { AdminSubmission } from "./data";
import { reviewCopy } from "./data";

interface ReviewDialogProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  submission: AdminSubmission | null;
}

export const ReviewDialog = ({
  onOpenChange,
  open,
  submission,
}: ReviewDialogProps) => {
  const queryClient = useQueryClient();
  const [note, setNote] = useState("");

  const review = useMutation(
    orpc.submissions.review.mutationOptions({
      onError: (error) => {
        toast.error(error.message || reviewCopy.failureMessage);
      },
      onSuccess: async () => {
        setNote("");
        onOpenChange(false);
        await queryClient.invalidateQueries({
          queryKey: orpc.submissions.adminList.key(),
        });
        toast.success(reviewCopy.successMessage);
      },
    })
  );

  const handleReview = (approve: boolean) => {
    if (!submission) {
      return;
    }

    review.mutate({
      approve,
      note: note.trim() || undefined,
      submissionId: submission.id,
    });
  };

  return (
    <AlertDialogRoot onOpenChange={onOpenChange} open={open}>
      <AlertDialogPortal>
        <AlertDialogBackdrop />
        <AlertDialogViewport>
          <AlertDialogPopup className="sm:max-w-[560px]">
            <AlertDialogTitle>
              {submission?.title ?? reviewCopy.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {reviewCopy.description}
            </AlertDialogDescription>

            <div className="mt-6 grid gap-5">
              <div className="border-line-soft bg-ink/60 max-h-[180px] overflow-y-auto rounded-[14px] border p-4">
                <div className="text-faint font-mono text-[10px] tracking-[0.14em] uppercase">
                  {reviewCopy.proposalLabel}
                </div>
                <p className="text-muted mt-2 text-[14px] leading-[1.6] whitespace-pre-wrap">
                  {submission?.description}
                </p>
              </div>

              <TextareaField
                description={reviewCopy.notePlaceholder}
                id="review-note"
                label={reviewCopy.noteLabel}
                onValueChange={setNote}
                placeholder={reviewCopy.notePlaceholder}
                rows={4}
                value={note}
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-2.5">
              <AlertDialogClose variant="ghost">
                {reviewCopy.cancelLabel}
              </AlertDialogClose>
              <Button
                className={reviewCopy.rejectClassName}
                disabled={review.isPending || !submission}
                onClick={() => handleReview(false)}
                variant="outline"
              >
                {reviewCopy.rejectLabel}
              </Button>
              <Button
                aria-busy={review.isPending}
                disabled={review.isPending || !submission}
                onClick={() => handleReview(true)}
              >
                {reviewCopy.approveLabel}
              </Button>
            </div>
          </AlertDialogPopup>
        </AlertDialogViewport>
      </AlertDialogPortal>
    </AlertDialogRoot>
  );
};
