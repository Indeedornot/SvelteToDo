import { id, todoDisplay, todoDisplayCreate, todoDisplayDataSchema } from '$lib/models/TodoSchema';
import prisma from '$lib/trpc/prisma';
import { z } from 'zod';

import { logger } from '../middleware/logger';
import { t } from '../t';

export const display = t.router({
	getSingle: t.procedure
		.use(logger)
		.input(id)
		.query(async ({ input }) => {
			const single = await prisma.todoDisplay.findUniqueOrThrow({
				where: {
					id: input
				},
				include: {
					todoTabs: {
						include: {
							todoItems: true
						}
					}
				}
			});

			return todoDisplayDataSchema.parse(single);
		}),
	getAll: t.procedure.query(async () => {
		const many = await prisma.todoDisplay.findMany({
			include: {
				todoTabs: {
					include: {
						todoItems: true
					}
				}
			}
		});

		return z.array(todoDisplayDataSchema).parse(many);
	}),
	create: t.procedure
		.use(logger)
		.input(todoDisplayCreate)
		.query(async ({ input }) => {
			//adjust the sortOrder of the other displays
			await prisma.todoDisplay.updateMany({
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

			const create = await prisma.todoDisplay.create({
				data: {
					title: input.title,
					sortOrder: input.sortOrder,
					todoTabs: {
						create: input.todoTabs?.map((tab) => ({
							title: tab.title,
							sortOrder: tab.sortOrder,
							todoItems: {
								create: tab.todoItems
							}
						}))
					}
				},
				include: {
					todoTabs: {
						include: {
							todoItems: true
						}
					}
				}
			});

			return todoDisplayDataSchema.parse(create);
		}),
	update: t.procedure
		.use(logger)
		.input(todoDisplay)
		.query(async ({ input }) => {
			await updateSortOrder(input.id, input.sortOrder);
			const update = await prisma.todoDisplay.update({
				where: {
					id: input.id
				},
				data: {
					title: input.title,
					sortOrder: input.sortOrder
				},
				include: {
					todoTabs: {
						include: {
							todoItems: true
						}
					}
				}
			});

			return todoDisplayDataSchema.parse(update);
		}),
	delete: t.procedure
		.use(logger)
		.input(id)
		.query(async ({ input }) => {
			const display = await prisma.todoDisplay.findUniqueOrThrow({
				where: {
					id: input
				},
				include: {
					todoTabs: true
				}
			});

			await prisma.todoDisplay.delete({ where: { id: input } });

			//adjust the sortOrder of the other displays
			await prisma.todoDisplay.updateMany({
				where: {
					sortOrder: {
						gt: display.sortOrder
					}
				},
				data: {
					sortOrder: {
						decrement: 1
					}
				}
			});
		})
});

const updateSortOrder = async (id: number, newSort: number) => {
	//adjust the sortOrder of the other items only if it has changed
	const item = await prisma.todoDisplay.findUniqueOrThrow({
		where: {
			id: id
		},
		select: {
			sortOrder: true
		}
	});

	if (item && item.sortOrder === newSort) return;
	if (item.sortOrder > newSort) {
		await prisma.todoDisplay.updateMany({
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
	await prisma.todoDisplay.updateMany({
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
