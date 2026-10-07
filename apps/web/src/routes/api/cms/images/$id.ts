import { cmsImage } from "@byte-quest/db";
import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";

import { db } from "../../../../services";

/** Public, unauthenticated: CMS images are meant to be embedded site-wide. */
export const Route = createFileRoute("/api/cms/images/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const [row] = await db
          .select({ data: cmsImage.data, mimeType: cmsImage.mimeType })
          .from(cmsImage)
          .where(eq(cmsImage.id, params.id));

        if (!row) {
          return new Response("Not found", { status: 404 });
        }

        return new Response(new Uint8Array(row.data), {
          headers: {
            "Content-Type": row.mimeType,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
