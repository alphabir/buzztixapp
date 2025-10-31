import { serve } from '@hono/node-server';
import app from './backend/hono.ts';

const PORT = 8081;

console.log(`Server is running on http://localhost:${PORT}`);

serve({
  fetch: app.fetch,
  port: PORT
});