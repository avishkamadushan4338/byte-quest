import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core";

import { userProfile } from "../access/user-profile";

/**
 * A small CMS-managed image. Uploads are always re-encoded to WebP and
 * downsized before being stored, so the blob itself stays small enough to
 * live directly in SQLite instead of needing object storage.
 */
export const cmsImage = sqliteTable("cms_image", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  mimeType: text("mime_type")
    .$type<"image/webp">()
    .default("image/webp")
    .notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  data: blob("data", { mode: "buffer" }).notNull(),
  uploadedByUserId: text("uploaded_by_user_id").references(
    () => userProfile.userId,
    { onDelete: "set null" }
  ),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export type CmsImage = typeof cmsImage.$inferSelect;
export type NewCmsImage = typeof cmsImage.$inferInsert;
