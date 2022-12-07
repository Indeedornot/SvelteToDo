import { id, todoItem, todoItemCreate, todoItemDataSchema } from '$lib/models/TodoSchema';
import prisma from '$lib/trpc/prisma';
import { t } from '$lib/trpc/t';
import { z } from 'zod';

import { logger } from '../middleware/logger';

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

			const create = await prisma.todoItem.create({
				data: {
					title: input.title,
					sortOrder: input.sortOrder,
					status: input.status,
					collapsed: input.collapsed,
					todoTabId: input.todoTabId
				}
			});

			return todoItemDataSchema.parse(create);
		}),
	update: t.procedure
		.input(todoItem)
		.use(logger)
		.query(async ({ input }) => {
			await updateSortOrder(input.id, input.sortOrder);
			const update = await prisma.todoItem.update({
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

			return todoItemDataSchema.parse(update);
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
		.query(async ({ input }) => {
			const single = await prisma.todoItem.findUniqueOrThrow({
				where: {
					id: input
				}
			});

			return todoItemDataSchema.parse(single);
		}),
	getByTab: t.procedure
		.use(logger)
		.input(id)
		.query(async ({ input }) => {
			const many = await prisma.todoItem.findMany({
				where: {
					todoTabId: input
				},
				orderBy: {
					sortOrder: 'asc'
				}
			});

			return z.array(todoItemDataSchema).parse(many);
		}),
	getAll: t.procedure.use(logger).query(async () => {
		const many = await prisma.todoItem.findMany({
			orderBy: {
				sortOrder: 'asc'
			}
		});
		return z.array(todoItemDataSchema).parse(many);
	})
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
