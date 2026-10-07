import { EmptyState } from "@byte-quest/ui/components/callout";
import { Button } from "@byte-quest/ui/primitives/button";
import { Field, FieldLabel } from "@byte-quest/ui/primitives/field";
import { Input } from "@byte-quest/ui/primitives/input";
import { Skeleton } from "@byte-quest/ui/primitives/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";

import { orpc } from "@/utils/orpc";

const SKELETON_KEYS = [
  "media-skeleton-1",
  "media-skeleton-2",
  "media-skeleton-3",
];

const formatBytes = (bytes: number) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  return `${(bytes / 1024).toFixed(1)} KB`;
};

const BASE64_CHUNK_SIZE = 0x80_00;

const fileToDataUrl = async (file: File) => {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += BASE64_CHUNK_SIZE) {
    binary += String.fromCodePoint(
      ...bytes.subarray(offset, offset + BASE64_CHUNK_SIZE)
    );
  }
  return `data:${file.type};base64,${btoa(binary)}`;
};

const copyImageUrl = async (id: string) => {
  const url = `${window.location.origin}/api/cms/images/${id}`;
  await navigator.clipboard.writeText(url);
  toast.success("URL copied");
};

export const MediaPanel = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const query = useQuery(orpc.cms.list.queryOptions());

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: orpc.cms.list.key() });

  const upload = useMutation(
    orpc.cms.upload.mutationOptions({
      onSuccess: () => {
        toast.success("Image uploaded");
        setName("");
        setFile(null);
        invalidate();
      },
      onError: (error: unknown) => {
        toast.error(
          error instanceof Error && error.message
            ? error.message
            : "Could not upload that image"
        );
      },
    })
  );

  const remove = useMutation(
    orpc.cms.remove.mutationOptions({
      onSuccess: () => {
        toast.success("Image deleted");
        invalidate();
      },
      onError: () => toast.error("Could not delete that image"),
    })
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      toast.error("Choose an image first");
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    upload.mutate({ name: name.trim() || file.name, dataUrl });
  };

  return (
    <div className="grid gap-8">
      <form
        className="border-line-soft grid gap-4 rounded-2xl border p-5 sm:grid-cols-[1fr_1fr_auto]"
        onSubmit={handleSubmit}
      >
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input
            onChange={(event) => setName(event.currentTarget.value)}
            placeholder="Hero avatar"
            value={name}
          />
        </Field>
        <Field>
          <FieldLabel>Image</FieldLabel>
          <input
            accept="image/*"
            className="text-muted file:text-fg file:bg-surface-2 file:mr-3 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-[13px] file:font-semibold"
            onChange={(event) =>
              setFile(event.currentTarget.files?.[0] ?? null)
            }
            type="file"
          />
        </Field>
        <Button
          aria-busy={upload.isPending}
          className="self-end"
          disabled={upload.isPending}
          type="submit"
        >
          {upload.isPending ? "Uploading…" : "Upload"}
        </Button>
      </form>

      {query.isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {SKELETON_KEYS.map((key) => (
            <Skeleton className="aspect-square rounded-2xl" key={key} />
          ))}
        </div>
      ) : null}

      {!query.isLoading && query.data?.length === 0 ? (
        <EmptyState
          description="Uploaded images are re-encoded to WebP and stored directly in the database."
          title="No images yet"
        />
      ) : null}

      {query.data && query.data.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {query.data.map((image) => (
            <div
              className="border-line-soft flex flex-col gap-2 overflow-hidden rounded-2xl border"
              key={image.id}
            >
              <img
                alt={image.name}
                className="bg-surface-2 aspect-square w-full object-cover"
                src={`/api/cms/images/${image.id}`}
              />
              <div className="flex flex-col gap-2 p-3">
                <div
                  className="truncate text-[13.5px] font-semibold"
                  title={image.name}
                >
                  {image.name}
                </div>
                <div className="text-muted-2 font-mono text-[11px]">
                  {image.width}×{image.height} · {formatBytes(image.sizeBytes)}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => copyImageUrl(image.id)}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    Copy URL
                  </Button>
                  <Button
                    aria-busy={remove.isPending}
                    onClick={() => remove.mutate({ id: image.id })}
                    size="sm"
                    type="button"
                    variant="ghost"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
