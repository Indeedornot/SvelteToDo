import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import PrismaClient from '$lib/prisma/prisma';
import type { TodoTabData } from '$lib/models/TodoData';
import type { TodoTab } from '.prisma/client';
const prisma = new PrismaClient();

//! Doesnt return the todoItems
export const POST: RequestHandler = async ({ request }) => {
	const data: TodoTabData = await request.json();
	if (!data.title || !data.id) return new Response('Missing title or id', { status: 400 });

	let todoTab: TodoTab;
	if (data.id == -1) {
		//add new item
		todoTab = await prisma.todoTab.create({
			data: {
				title: data.title,
				sortOrder: data.sortOrder,
				todoDisplayId: data.todoDisplayId
			}
		});

		if (data.todoItems && data.todoItems.length > 0) {
			for (const i in data.todoItems) {
				await prisma.todoItem.create({
					data: {
						title: data.todoItems[i].title,
						status: data.todoItems[i].status,
						todoTabId: todoTab.id,
						sortOrder: data.todoItems[i].sortOrder
					}
				});
			}
		}
	} else {
		//update existing item
		const existingTab = await prisma.todoTab.findFirst({ where: { id: data.id } });
		if (!existingTab) return new Response('Tab not found', { status: 400 });

		todoTab = await prisma.todoTab.update({
			where: {
				id: data.id
			},
			data: {
				title: data.title,
				sortOrder: data.sortOrder
			}
		});
	}

	const todoTabData: TodoTabData = {
		id: todoTab.id,
		title: todoTab.title,
		sortOrder: todoTab.sortOrder,
		todoDisplayId: todoTab.todoDisplayId,
		todoItems: []
	};
	return json(todoTabData);
};

export const DELETE: RequestHandler = async ({ request }) => {
	const data: { id: number } = await request.json();
	if (!data.id) return new Response('Missing id', { status: 400 });

	const existingItem = await prisma.todoTab.findFirst({ where: { id: data.id } });
	if (!existingItem) return new Response('Item not found', { status: 400 });
	await prisma.todoTab.delete({
		where: {
			id: data.id
		}
	});

	return new Response('ok');
};

export const GET: RequestHandler = async ({ url }) => {
	const params = url.searchParams;
	console.log('GET Params', params);

	if (params.has('id')) {
		const id = parseInt(params.get('id')!);
		if (isNaN(id)) return error(400, 'Invalid id');
		const todoTab = await prisma.todoTab.findFirst({
			where: {
				id: id
			},
			include: {
				todoItems: true
			}
		});
		console.log('todoTab', todoTab);
		return json(todoTab);
	} else if (params.has('todoDisplayId')) {
		const todoDisplayId = parseInt(params.get('todoDisplayId')!);
		if (isNaN(todoDisplayId)) return error(400, 'Invalid todoDisplayId');
		const todoTabs = await prisma.todoTab.findMany({
			where: {
				todoDisplayId: todoDisplayId
			}
		});
		console.log('todoTabs', todoTabs);
		return json(todoTabs);
	}

	return error(400, 'Invalid parameters');
};
