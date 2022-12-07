import { TodoDisplayConstr, TodoItemConstr, TodoTabConstr } from '$lib/models/TodoDataConstr';
import { z } from 'zod';

import { statusType } from './TodoData';

export const id = z.number().int().nonnegative();
export const sortOrder = z.number().int().nonnegative();

export const displayTitle = z.string().max(TodoDisplayConstr.title.maxLength);
export const tabTitle = z.string().max(TodoTabConstr.title.maxLength);

export const itemTitle = z.string().max(TodoItemConstr.title.maxLength);
export const status = z.nativeEnum(statusType);

export const todoItem = z.object({
	id: id,
	title: itemTitle,
	sortOrder: sortOrder,
	status: status,
	todoTabId: id,
	collapsed: z.boolean()
});

export const todoTab = z.object({
	id: id,
	title: tabTitle,
	sortOrder: sortOrder,
	todoDisplayId: id
});

export const todoDisplay = z.object({
	id: id,
	title: displayTitle,
	sortOrder: sortOrder
});

export const todoItemCreate = todoItem.omit({ id: true });

export const todoTabCreate = todoTab.omit({ id: true }).extend({
	todoItems: z
		.array(
			todoItemCreate.partial({
				todoTabId: true
			})
		)
		.optional()
});

export const todoDisplayCreate = todoDisplay.omit({ id: true }).extend({
	todoTabs: z
		.array(
			todoTabCreate.partial({
				todoDisplayId: true
			})
		)
		.optional()
});

const dateSchema = z.preprocess((arg) => {
	if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
}, z.date());

export const todoItemDataSchema = todoItem.extend({
	createdAt: dateSchema,
	updatedAt: dateSchema
});

export const todoTabDataSchema = todoTab.extend({
	todoItems: z.array(todoItemDataSchema),
	createdAt: dateSchema,
	updatedAt: dateSchema
});
export const todoDisplayDataSchema = todoDisplay.extend({
	todoTabs: z.array(todoTabDataSchema),
	createdAt: dateSchema,
	updatedAt: dateSchema
});
