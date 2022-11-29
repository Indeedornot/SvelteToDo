import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

import { display } from './routes/TodoDisplay';
import { item } from './routes/TodoItem';
import { tab } from './routes/TodoTab';
import { t } from './t';

export const router = t.router({
	item,
	display,
	tab
});

export type Router = typeof router;

export type RouterInputs = inferRouterInputs<Router>;
export type RouterOutputs = inferRouterOutputs<Router>;
