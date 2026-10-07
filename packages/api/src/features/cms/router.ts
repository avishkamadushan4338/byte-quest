import { cmsImage } from "@byte-quest/db";
import { ORPCError } from "@orpc/server";
import { desc, eq } from "drizzle-orm";
import sharp from "sharp";
import { z } from "zod";

import { adminProcedure } from "../../index";

/** Uploads larger than this (before re-encoding) are rejected outright. */
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

/** Images are downsized to fit within this box before being stored. */
const MAX_DIMENSION = 640;

const WEBP_QUALITY = 72;

const cmsImageMetaSchema = z.object({
  id: z.string(),
  name: z.string(),
  width: z.number(),
  height: z.number(),
  sizeBytes: z.number(),
  createdAt: z.string(),
});

const dataUrlToBuffer = (dataUrl: string): Buffer => {
  const match = /^data:[^;]+;base64,(?<base64>.+)$/u.exec(dataUrl);
  const base64 = match?.groups?.base64;
  if (!base64) {
    throw new ORPCError("BAD_REQUEST", {
      message: "Expected a base64 data URL",
    });
  }
  return Buffer.from(base64, "base64");
};

export const cmsRouter = {
  cms: {
    /** Admin: upload an image, re-encoded to a small WebP and stored in SQLite. */
    upload: adminProcedure
      .input(
        z.object({
          name: z.string().min(1).max(120),
          dataUrl: z.string().min(1),
        })
      )
      .output(cmsImageMetaSchema)
      .handler(async ({ context, input }) => {
        const original = dataUrlToBuffer(input.dataUrl);
        if (original.byteLength > MAX_UPLOAD_BYTES) {
          throw new ORPCError("BAD_REQUEST", {
            message: "Image must be 8MB or smaller",
          });
        }

        const webp = await sharp(original)
          .rotate()
          .resize({
            width: MAX_DIMENSION,
            height: MAX_DIMENSION,
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: WEBP_QUALITY })
          .toBuffer({ resolveWithObject: true });

        const [created] = await context.db
          .insert(cmsImage)
          .values({
            name: input.name.trim(),
            width: webp.info.width,
            height: webp.info.height,
            sizeBytes: webp.data.byteLength,
            data: webp.data,
            uploadedByUserId: context.profile.userId,
          })
          .returning();
        if (!created) {
          throw new ORPCError("INTERNAL_SERVER_ERROR", {
            message: "Failed to store image",
          });
        }

        return {
          id: created.id,
          name: created.name,
          width: created.width,
          height: created.height,
          sizeBytes: created.sizeBytes,
          createdAt: created.createdAt.toISOString(),
        };
      }),

    /** Admin: list uploaded images, newest first. Blob data is excluded. */
    list: adminProcedure
      .output(z.array(cmsImageMetaSchema))
      .handler(async ({ context }) => {
        const rows = await context.db
          .select({
            id: cmsImage.id,
            name: cmsImage.name,
            width: cmsImage.width,
            height: cmsImage.height,
            sizeBytes: cmsImage.sizeBytes,
            createdAt: cmsImage.createdAt,
          })
          .from(cmsImage)
          .orderBy(desc(cmsImage.createdAt));
        return rows.map((row) => ({
          ...row,
          createdAt: row.createdAt.toISOString(),
        }));
      }),

    /** Admin: delete an uploaded image. */
    remove: adminProcedure
      .input(z.object({ id: z.string() }))
      .output(z.object({ id: z.string() }))
      .handler(async ({ context, input }) => {
        const [deleted] = await context.db
          .delete(cmsImage)
          .where(eq(cmsImage.id, input.id))
          .returning({ id: cmsImage.id });
        if (!deleted) {
          throw new ORPCError("NOT_FOUND", { message: "Image not found" });
        }
        return deleted;
      }),
  },
};
