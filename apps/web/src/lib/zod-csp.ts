import { config } from "zod";

// Zod probes `new Function("")` to enable JIT parsing. Strict CSPs report that
// probe as an `unsafe-eval` violation even though the error is caught, so the
// browser runs in jitless mode and never touches eval.
if (typeof window !== "undefined") {
  config({ jitless: true });
}
