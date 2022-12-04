import prisma from '$lib/server/prisma';
import { t } from '$lib/trpc/t';

import { logger } from '../middleware/logger';
import { id, todoItem, todoItemCreate } from '../models/TodoData';

export const item = t.router({
	create: t.procedure
		.use(logger)
		.input(todoItemCreate)
		.query(async ({ input }) => {
			//adjust the sortOrder of the other items
			await prisma.todoItem.updateMany({
				where: {
					sortOrder: {
						gte: input.sortOrder
					}
				},
				data: {
					sortOrder: {
						increment: 1
					}
				}
			});

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
	update: t.procedure
		.input(todoItem)
		.use(logger)
		.query(async ({ input }) => {
			await updateSortOrder(input.id, input.sortOrder);
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
	delete: t.procedure
		.use(logger)
		.input(id)
		.query(async ({ input }) => {
			//adjust the sortOrder of the other items
			const item = await prisma.todoItem.findUniqueOrThrow({
				where: {
					id: input
				}
			});

			await prisma.todoItem.delete({ where: { id: input } });

			await prisma.todoItem.updateMany({
				where: {
					sortOrder: {
						gt: item.sortOrder
					}
				},
				data: {
					sortOrder: {
						decrement: 1
					}
				}
			});
		}),
	getSingle: t.procedure
		.use(logger)
		.input(id)
		.query(({ input }) =>
			prisma.todoItem.findUniqueOrThrow({
				where: {
					id: input
				}
			})
		),
	getByTab: t.procedure
		.use(logger)
		.input(id)
		.query(({ input }) =>
			prisma.todoItem.findMany({
				where: {
					todoTabId: input
				}
			})
		),
	getAll: t.procedure.use(logger).query(() => prisma.todoItem.findMany())
});

const updateSortOrder = async (id: number, newSort: number) => {
	//adjust the sortOrder of the other items only if it has changed
	const item = await prisma.todoItem.findUniqueOrThrow({
		where: {
			id: id
		},
		select: {
			sortOrder: true
		}
	});

	if (item && item.sortOrder === newSort) return;
	if (item.sortOrder > newSort) {
		await prisma.todoItem.updateMany({
			where: {
				sortOrder: {
					gte: newSort,
					lt: item.sortOrder
				}
			},
			data: {
				sortOrder: {
					increment: 1
				}
			}
		});
		return;
	}

	//item.sortOrder < oldSort
	await prisma.todoItem.updateMany({
		where: {
			sortOrder: {
				gt: item.sortOrder,
				lte: newSort
			}
		},
		data: {
			sortOrder: {
				decrement: 1
			}
		}
	});
};
