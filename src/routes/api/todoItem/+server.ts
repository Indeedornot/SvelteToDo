import { json } from '@sveltejs/kit';

import { isUndefined, parseJson } from '$lib/helpers/jsUtils';
import type { TodoItemApiData } from '$lib/prisma/TodoApiData';
import { error, isValidId, validateTodoItem } from '$lib/server/DataValidation';
import prisma from '$lib/server/prisma';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const parsed = await parseJson<TodoItemApiData>(request);
	if (!isUndefined(parsed.error)) return error(400, parsed.error);

	const data: TodoItemApiData = parsed.data!;
	const validErr = validateTodoItem(data);
	if (!isUndefined(validErr)) return error(validErr.code, validErr.error);
	//add new item
	if (data.id === -1) {
		//add new item
		const todoItem = await prisma.todoItem.create({
			data: {
				title: data.title,
				status: data.status,
				todoTabId: data.todoTabId,
				sortOrder: data.sortOrder,
				collapsed: data.collapsed
			}
		});

		const returnData: TodoItemApiData = todoItem;
		return json(returnData);
	}

	//update existing item
	const existsItem = (await prisma.todoItem.count({ where: { id: data.id } })) === 1;
	if (!existsItem) return error(400, 'Item not found');

	const todoItem = await prisma.todoItem.update({
		where: {
			id: data.id
		},
		data: {
			title: data.title,
			status: data.status,
			todoTabId: data.todoTabId,
			sortOrder: data.sortOrder,
			collapsed: data.collapsed
		}
	});
	const returnData: TodoItemApiData = todoItem;

	return json(returnData);
};

export const DELETE: RequestHandler = async ({ request }) => {
	const parsed = await parseJson<{ id: number }>(request);
	if (!isUndefined(parsed.error)) return error(400, parsed.error);

	const data: { id: number } = parsed.data!;
	if (!isValidId(data.id)) return error(400, 'Invalid id');

	const existsItem = (await prisma.todoItem.count({ where: { id: data.id } })) === 1;
	if (!existsItem) return error(400, 'Item not found');
	await prisma.todoItem.delete({ where: { id: data.id } });

	return new Response('ok');
};

export const GET: RequestHandler = async ({ url }) => {
	const params = url.searchParams;

	if (!params.has('id') && !params.has('todoTabId')) return error(400, 'Missing id');

	if (params.has('id')) {
		const id = parseInt(params.get('id')!);
		if (!isValidId(id)) return error(400, 'Invalid id');
		const todoItem = await prisma.todoItem.findFirst({ where: { id: id } });

		const returnData: TodoItemApiData | null = todoItem;
		return json(returnData);
	}

	//todoTabId
	const todoTabId = parseInt(params.get('todoTabId')!);
	if (!isValidId(todoTabId)) return error(400, 'Invalid todoTabId');
	const todoItems = await prisma.todoItem.findMany({ where: { todoTabId: todoTabId } });

	const returnData: TodoItemApiData[] = todoItems;
	return json(returnData);
};
