import prisma from '$lib/server/prisma';

import { logger } from '../middleware/logger';
import { id, todoDisplay, todoDisplayCreate } from '../models/TodoData';
import { t } from '../t';

export const display = t.router({
	getSingle: t.procedure
		.use(logger)
		.input(id)
		.query(
			async ({ input }) =>
				await prisma.todoDisplay.findUniqueOrThrow({
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
				})
		),
	getAll: t.procedure.query(async () => {
		return await prisma.todoDisplay.findMany({
			include: {
				todoTabs: {
					include: {
						todoItems: true
					}
				}
			}
		});
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

			return await prisma.todoDisplay.create({
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
		}),
	update: t.procedure
		.use(logger)
		.input(todoDisplay)
		.query(async ({ input }) => {
			await updateSortOrder(input.id, input.sortOrder);
			return await prisma.todoDisplay.update({
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
