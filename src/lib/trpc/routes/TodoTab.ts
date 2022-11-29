import prisma from '$lib/server/prisma';
import { t } from '$lib/trpc/t';
import { z } from 'zod';

import { id, todoTab, todoTabCreate } from '../models/TodoData';

export const tab = t.router({
	create: t.procedure.input(todoTabCreate).query(async ({ input }) => {
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
	update: t.procedure.input(todoTab).query(async ({ input }) => {
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
	updateMany: t.procedure.input(z.array(todoTab)).query(async ({ input }) => {
		const todoTabs = [];
		for (const tab of input) {
			const newTab = await prisma.todoTab.update({
				where: {
					id: tab.id
				},
				data: {
					sortOrder: tab.sortOrder
				},
				include: {
					todoItems: true
				}
			});
			todoTabs.push(newTab);
		}

		return todoTabs;
	}),
	delete: t.procedure.input(id).query(async ({ input }) => {
		await prisma.todoTab.delete({ where: { id: input } });
	}),
	getSingle: t.procedure.input(id).query(({ input }) =>
		prisma.todoTab.findUniqueOrThrow({
			where: {
				id: input
			},
			include: {
				todoItems: true
			}
		})
	),
	getByDisplay: t.procedure.input(id).query(({ input }) =>
		prisma.todoTab.findMany({
			where: {
				todoDisplayId: input
			},
			include: {
				todoItems: true
			}
		})
	),
	getAll: t.procedure.query(() =>
		prisma.todoTab.findMany({
			include: {
				todoItems: true
			}
		})
	)
});
