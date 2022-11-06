import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import PrismaClient from '$lib/prisma/prisma';
import type { TodoItemData } from '$lib/models/TodoData';
const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request }) => {
	const data: TodoItemData = await request.json();
	if (!data.status || !data.title || !data.id) return new Response('Missing status or title or id', { status: 400 });

	let todoItem: TodoItemData;
	if (data.id == -1) {
		//add new item
		todoItem = await prisma.todoItem.create({
			data: {
				title: data.title,
				status: data.status,
				todoTabId: data.todoTabId,
				sortOrder: data.sortOrder
			}
		});
	} else {
		const existingItem = await prisma.todoItem.findFirst({ where: { id: data.id } });
		if (!existingItem) return new Response('Item not found', { status: 400 });

		//update existing item
		todoItem = await prisma.todoItem.update({
			where: {
				id: data.id
			},
			data: {
				title: data.title,
				status: data.status,
				todoTabId: data.todoTabId,
				sortOrder: data.sortOrder
			}
		});
	}

	return json(todoItem);
};

export const DELETE: RequestHandler = async ({ request }) => {
	const data: { id: number } = await request.json();
	if (!data.id) return new Response('Missing id', { status: 400 });

	const existingItem = await prisma.todoItem.findFirst({ where: { id: data.id } });
	if (!existingItem) return new Response('Item not found', { status: 400 });
	await prisma.todoItem.delete({
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
		const todoItem = await prisma.todoItem.findFirst({
			where: {
				id: id
			}
		});
		console.log('todoItem', todoItem);
		return json(todoItem);
	} else if (params.has('todoTabId')) {
		const todoTabId = parseInt(params.get('todoTabId')!);
		if (isNaN(todoTabId)) return error(400, 'Invalid todoTabId');
		const todoItems = await prisma.todoItem.findMany({
			where: {
				todoTabId: todoTabId
			}
		});
		console.log('todoItems', todoItems);
		return json(todoItems);
	}

	return error(400, 'Invalid parameters');
};
