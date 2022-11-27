import { json } from '@sveltejs/kit';

import type { TodoItem, TodoTab } from '@prisma/client';

import type { TodoDisplayApiData, TodoTabApiData } from '$lib/apiCalls/TodoApiData';
import { isUndefined, parseJson } from '$lib/helpers/jsUtils';
import { error, isValidId, validateTodoTab } from '$lib/server/DataValidation';
import prisma from '$lib/server/prisma';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const parsed = await parseJson<TodoTabApiData>(request);
	if (!isUndefined(parsed.error)) return error(400, parsed.error);

	const data: TodoTabApiData = parsed.data!;
	const validErr = validateTodoTab(data);
	if (!isUndefined(validErr)) return error(validErr.code, validErr.error);

	let todoTab: TodoTab & { todoItems: TodoItem[] };
	if (data.id === -1) {
		//add new item
		todoTab = await prisma.todoTab.create({
			data: {
				title: data.title,
				sortOrder: data.sortOrder,
				todoDisplayId: data.todoDisplayId,
				todoItems: {
					create: data.todoItems
				}
			},
			include: { todoItems: true }
		});

		const returnData: TodoDisplayApiData = todoTabWithoutUndefined(todoTab);
		return json(returnData);
	}

	//update existing item
	const existsTab = (await prisma.todoTab.count({ where: { id: data.id } })) === 1;
	if (!existsTab) return error(400, 'Tab not found');

	todoTab = await prisma.todoTab.update({
		where: { id: data.id },
		data: {
			title: data.title,
			sortOrder: data.sortOrder,
			todoDisplayId: data.todoDisplayId
		},
		include: { todoItems: true }
	});

	const returnData: TodoDisplayApiData = todoTabWithoutUndefined(todoTab);
	return json(returnData);
};

export const DELETE: RequestHandler = async ({ request }) => {
	const parsed = await parseJson<{ id: number }>(request);
	if (parsed.error) return error(400, parsed.error);

	const data: { id: number } = parsed.data!;
	if (!isValidId(data.id)) return error(400, 'Invalid id');

	const existsTab = (await prisma.todoTab.count({ where: { id: data.id } })) === 1;
	if (!existsTab) return error(400, 'Tab not found');
	await prisma.todoTab.delete({ where: { id: data.id } });

	return new Response('ok');
};

export const GET: RequestHandler = async ({ url }) => {
	const params = url.searchParams;

	if (!params.has('id') && !params.has('todoDisplayId')) return error(400, 'Missing id');

	if (params.has('id')) {
		const id = parseInt(params.get('id')!);
		if (!isValidId(id)) return error(400, 'Invalid id');
		const todoTab = await prisma.todoTab.findFirst({
			where: { id: id },
			include: { todoItems: true }
		});
		const returnData: TodoTabApiData | null = todoTab ? todoTabWithoutUndefined(todoTab) : todoTab;
		return json(returnData);
	}

	//todoTabId
	const todoDisplayId = parseInt(params.get('todoDisplayId')!);
	if (!isValidId(todoDisplayId)) return error(400, 'Invalid todoDisplayId');
	const todoTabs = await prisma.todoTab.findMany({
		where: { todoDisplayId: todoDisplayId },
		include: { todoItems: true }
	});

	const returnData: TodoTabApiData[] = todoTabs?.map((tab) => todoTabWithoutUndefined(tab));
	return json(returnData);
};

const todoTabWithoutUndefined = (tab: TodoTab & { todoItems: TodoItem[] }) => {
	return { ...tab, todoItems: tab.todoItems || [] };
};
