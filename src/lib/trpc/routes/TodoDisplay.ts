import prisma from '$lib/server/prisma';
import { t } from '$lib/trpc/t';
import { z } from 'zod';

import { id, todoDisplay, todoDisplayCreate } from '../models/TodoData';

export const display = t.router({
	getSingle: t.procedure.input(id).query(
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
		console.log('getAll');
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
	create: t.procedure.input(todoDisplayCreate).query(async ({ input }) => {
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
	update: t.procedure.input(todoDisplay).query(async ({ input }) => {
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
	updateMany: t.procedure.input(z.array(todoDisplay)).query(async ({ input }) => {
		const todoDisplays = [];
		for (const display of input) {
			const newDisplay = await prisma.todoDisplay.update({
				where: {
					id: display.id
				},
				data: {
					sortOrder: display.sortOrder
				},
				include: {
					todoTabs: {
						include: {
							todoItems: true
						}
					}
				}
			});
			todoDisplays.push(newDisplay);
		}

		return todoDisplays;
	}),
	delete: t.procedure.input(z.number().int().nonnegative()).query(async ({ input }) => {
		await prisma.todoDisplay.delete({ where: { id: input } });
	})
});
