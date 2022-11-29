import prisma from '$lib/server/prisma';
import { t } from '$lib/trpc/t';
import { z } from 'zod';

import { logger } from '../middleware/logger';
import { id, todoItem, todoItemCreate } from '../models/TodoData';

export const item = t.router({
	create: t.procedure
		.use(logger)
		.input(todoItemCreate)
		.query(async ({ input }) => {
			return await prisma.todoItem.create({
				data: {
					title: input.title,
					sortOrder: input.sortOrder,
					status: input.status,
					collapsed: input.collapsed,
					todoTabId: input.todoTabId
				}
			});
		}),
	update: t.procedure.input(todoItem).query(async ({ input }) => {
		return await prisma.todoItem.update({
			where: {
				id: input.id
			},
			data: {
				title: input.title,
				sortOrder: input.sortOrder,
				status: input.status,
				collapsed: input.collapsed,
				todoTabId: input.todoTabId
			}
		});
	}),
	updateMany: t.procedure.input(z.array(todoItem)).query(async ({ input }) => {
		const todoItems = [];
		for (const item of input) {
			const newItem = await prisma.todoItem.update({
				where: {
					id: item.id
				},
				data: {
					sortOrder: item.sortOrder
				}
			});
			todoItems.push(newItem);
		}

		return todoItems;
	}),
	delete: t.procedure.input(id).query(async ({ input }) => {
		await prisma.todoItem.delete({ where: { id: input } });
	}),
	getSingle: t.procedure.input(id).query(({ input }) =>
		prisma.todoItem.findUniqueOrThrow({
			where: {
				id: input
			}
		})
	),
	getByTab: t.procedure.input(id).query(({ input }) =>
		prisma.todoItem.findMany({
			where: {
				todoTabId: input
			}
		})
	),
	getAll: t.procedure.query(() => prisma.todoItem.findMany())
});
