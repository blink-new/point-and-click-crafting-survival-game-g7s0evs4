// Blink SDK client configuration for Survivor's Haven

import { createClient } from '@blinkdotnew/sdk';

export const blink = createClient({
  projectId: 'point-and-click-crafting-survival-game-g7s0evs4',
  authRequired: true
});

// Export individual services for convenience
export const { auth, db, storage, ai, data, notifications, realtime, analytics } = blink;