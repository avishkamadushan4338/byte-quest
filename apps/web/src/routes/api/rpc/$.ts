import { appRouter } from "@byte-quest/api/routers/index";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { createFileRoute } from "@tanstack/react-router";

import { createContext } from "../../../context";
import { clientIp, guardRequest } from "../../../lib/rate-limit";

/** Shared budget for every /api/rpc call: generous for normal app traffic. */
const RPC_LIMITS = {
  limit: 300,
  windowMs: 60_000,
  maxBodyBytes: 512 * 1024,
};

const rpcHandler = new RPCHandler(appRouter, {
  interceptors: [
    // eslint-disable-next-line promise/prefer-await-to-callbacks
    onError((error) => {
      console.error(error);
    }),
  ],
});

const apiHandler = new OpenAPIHandler(appRouter, {
  plugins: [
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
  ],
  interceptors: [
    // eslint-disable-next-line promise/prefer-await-to-callbacks
    onError((error) => {
      console.error(error);
    }),
  ],
});

const handle = async ({ request }: { request: Request }) => {
  const guarded = guardRequest(request, `rpc:${clientIp(request)}`, RPC_LIMITS);
  if (guarded) {
    return guarded;
  }

  const rpcResult = await rpcHandler.handle(request, {
    prefix: "/api/rpc",
    context: await createContext({ req: request }),
  });
  if (rpcResult.response) {
    return rpcResult.response;
  }

  const apiResult = await apiHandler.handle(request, {
    prefix: "/api/rpc/api-reference",
    context: await createContext({ req: request }),
  });
  if (apiResult.response) {
    return apiResult.response;
  }

  return new Response("Not found", { status: 404 });
};

export const Route = createFileRoute("/api/rpc/$")({
  server: {
    handlers: {
      HEAD: handle,
      GET: handle,
      POST: handle,
      PUT: handle,
      PATCH: handle,
      DELETE: handle,
    },
  },
});
