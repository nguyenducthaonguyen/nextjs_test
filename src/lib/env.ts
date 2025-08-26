import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod/v4-mini';

export const Env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_APP_URL: z.optional(z.string()),
  },
  shared: {
    NODE_ENV: z.optional(z.enum(['test', 'development', 'production'])),
    NEXT_PUBLIC_API_URL: z.optional(z.string()),
    NEXT_SERVER_ACTIONS_ENCRYPTION_KEY: z.optional(z.string()),
  },
  // You need to destructure all the keys manually
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_SERVER_ACTIONS_ENCRYPTION_KEY: process.env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY,
  },
});
