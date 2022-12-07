import { id, todoTab, todoTabCreate, todoTabDataSchema } from '$lib/models/TodoSchema';
import prisma from '$lib/trpc/prisma';
import { t } from '$lib/trpc/t';
import { z } from 'zod';

import { logger } from '../middleware/logger';

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

			const create = await prisma.todoTab.create({
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

			return todoTabDataSchema.parse(create);
		}),
	update: t.procedure
		.use(logger)
		.input(todoTab)
		.query(async ({ input }) => {
			await updateSortOrder(input.id, input.sortOrder);
			const update = await prisma.todoTab.update({
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

			return todoTabDataSchema.parse(update);
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
		.query(async ({ input }) => {
			const single = await prisma.todoTab.findUniqueOrThrow({
				where: {
					id: input
				},
				include: {
					todoItems: {
						orderBy: {
							sortOrder: 'asc'
						}
					}
				}
			});

			return todoTabDataSchema.parse(single);
		}),
	getByDisplay: t.procedure
		.use(logger)
		.input(id)
		.query(async ({ input }) => {
			const many = await prisma.todoTab.findMany({
				where: {
					todoDisplayId: input
				},
				include: {
					todoItems: {
						orderBy: {
							sortOrder: 'asc'
						}
					}
				},
				orderBy: {
					sortOrder: 'asc'
				}
			});

			return z.array(todoTabDataSchema).parse(many);
		}),
	getAll: t.procedure.use(logger).query(async () => {
		const many = await prisma.todoTab.findMany({
			include: {
				todoItems: true
			},
			orderBy: {
				sortOrder: 'asc'
			}
		});

		return z.array(todoTabDataSchema).parse(many);
	})
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
