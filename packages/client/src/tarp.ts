import { createTRPCReact } from '@trpc/react-query';

import type { AppRouter as TARPRouter } from '../../tarp_server';

export const tarp = createTRPCReact<TARPRouter>();
