import prisma from '$lib/server/prisma';
import { t } from '$lib/trpc/t';

import { logger } from '../middleware/logger';
import { id, todoTab, todoTabCreate } from '../models/TodoData';

export const tab = t.router({
	create: t.procedure
		.use(logger)
		.input(todoTabCreate)
		.query(async ({ input }) => {
			//adjust the sortOrder of the other tabs
			await prisma.todoTab.updateMany({
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

			return await prisma.todoTab.create({
				data: {
					title: input.title,
					sortOrder: input.sortOrder,
					todoDisplayId: input.todoDisplayId,
					todoItems: {
						create: input.todoItems?.map((item) => ({
							title: item.title,
							sortOrder: item.sortOrder,
							status: item.status,
							collapsed: item.collapsed
						}))
					}
				},
				include: {
					todoItems: true
				}
			});
		}),
	update: t.procedure
		.use(logger)
		.input(todoTab)
		.query(async ({ input }) => {
			await updateSortOrder(input.id, input.sortOrder);
			return await prisma.todoTab.update({
				where: {
					id: input.id
				},
				data: {
					title: input.title,
					sortOrder: input.sortOrder,
					todoDisplayId: input.todoDisplayId
				},
				include: {
					todoItems: true
				}
			});
		}),
	delete: t.procedure
		.use(logger)
		.input(id)
		.query(async ({ input }) => {
			const tab = await prisma.todoTab.findUniqueOrThrow({
				where: {
					id: input
				},
				select: {
					sortOrder: true
				}
			});

			await prisma.todoTab.delete({ where: { id: input } });

			//adjust sortOrder of all tabs after the deleted tab
			await prisma.todoTab.updateMany({
				where: {
					sortOrder: {
						gt: tab.sortOrder
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
			prisma.todoTab.findUniqueOrThrow({
				where: {
					id: input
				},
				include: {
					todoItems: true
				}
			})
		),
	getByDisplay: t.procedure
		.use(logger)
		.input(id)
		.query(({ input }) =>
			prisma.todoTab.findMany({
				where: {
					todoDisplayId: input
				},
				include: {
					todoItems: true
				}
			})
		),
	getAll: t.procedure.use(logger).query(() =>
		prisma.todoTab.findMany({
			include: {
				todoItems: true
			}
		})
	)
});

const updateSortOrder = async (id: number, newSort: number) => {
	//adjust the sortOrder of the other items only if it has changed
	const tab = await prisma.todoTab.findUniqueOrThrow({
		where: {
			id: id
		},
		select: {
			sortOrder: true
		}
	});

	if (tab && tab.sortOrder === newSort) return;
	if (tab.sortOrder > newSort) {
		await prisma.todoTab.updateMany({
			where: {
				sortOrder: {
					gte: newSort,
					lt: tab.sortOrder
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
	await prisma.todoTab.updateMany({
		where: {
			sortOrder: {
				gt: tab.sortOrder,
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
