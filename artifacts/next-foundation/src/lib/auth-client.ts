import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  basePath: "/auth",
  plugins: [inferAdditionalFields<typeof auth>()],
});