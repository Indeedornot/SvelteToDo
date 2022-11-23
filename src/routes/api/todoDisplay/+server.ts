import { json } from '@sveltejs/kit';

import type { TodoDisplay, TodoItem, TodoTab } from '@prisma/client';

import { isUndefined, parseJson } from '$lib/helpers/jsUtils';
import type { TodoDisplayApiData } from '$lib/prisma/TodoApiData';
import { error, isValidId, validateTodoDisplay } from '$lib/server/DataValidation';
import prisma from '$lib/server/prisma';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	//#region Parse request
	const parsed = await parseJson<TodoDisplayApiData>(request);
	if (!isUndefined(parsed.error)) return error(400, parsed.error);

	const data: TodoDisplayApiData = parsed.data!;
	const validErr = validateTodoDisplay(data);
	if (!isUndefined(validErr)) return error(validErr.code, validErr.error);

	//#endregion

	let todoDisplay: TodoDisplay & { todoTabs?: (TodoTab & { todoItems?: TodoItem[] })[] };

	//add new tab
	if (data.id === -1) {
		todoDisplay = await prisma.todoDisplay.create({
			data: {
				title: data.title,
				sortOrder: data.sortOrder,
				todoTabs: {
					create: data.todoTabs?.map((tab) => ({
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

		const returnData: TodoDisplayApiData = todoDisplayWithoutUndefined(todoDisplay);
		return json(returnData);
	}

	//update existing tab
	const existsDisplay = (await prisma.todoDisplay.count({ where: { id: data.id } })) == 1;
	if (!existsDisplay) return error(400, 'Tab not found');
	todoDisplay = await prisma.todoDisplay.update({
		where: {
			id: data.id
		},
		data: {
			title: data.title,
			sortOrder: data.sortOrder
		},
		include: {
			todoTabs: {
				include: {
					todoItems: true
				}
			}
		}
	});

	const returnData: TodoDisplayApiData = todoDisplayWithoutUndefined(todoDisplay);
	return json(returnData);
};

export const DELETE: RequestHandler = async ({ request }) => {
	const parsed = await parseJson<{ id: number }>(request);
	if (!isUndefined(parsed.error)) return error(400, parsed.error);

	const data = parsed.data!;
	if (!isValidId(data.id)) return error(400, 'Invalid id');

	const existsDisplay = (await prisma.todoDisplay.count({ where: { id: data.id } })) == 1;
	if (!existsDisplay) return error(400, 'Display not found');

	await prisma.todoDisplay.delete({ where: { id: data.id } });
	return json({ success: true });
};

export const GET: RequestHandler = async ({ url }) => {
	// const params = url.searchParams;
	// console.log('GET Params', params);
	// return json({ params });
	const params = url.searchParams;

	if (params.has('id')) {
		const id = parseInt(params.get('id')!);
		if (!isValidId(id)) return error(400, 'Invalid id');
		const todoDisplay = await prisma.todoDisplay.findFirst({
			where: {
				id: id
			},
			include: {
				todoTabs: {
					include: {
						todoItems: true
					}
				}
			}
		});
		const returnData: TodoDisplayApiData | null = todoDisplay ? todoDisplayWithoutUndefined(todoDisplay!) : null;
		return json(returnData);
	}

	const todoDisplays = await prisma.todoDisplay.findMany({
		include: {
			todoTabs: {
				include: {
					todoItems: true
				}
			}
		}
	});
	const returnData: TodoDisplayApiData[] = todoDisplays.map((todoDisplay) => todoDisplayWithoutUndefined(todoDisplay));
	return json(returnData);
};

const todoDisplayWithoutUndefined = (
	todoDisplay: TodoDisplay & { todoTabs?: (TodoTab & { todoItems?: TodoItem[] })[] }
) => {
	return {
		...todoDisplay,
		todoTabs:
			todoDisplay.todoTabs?.map((tab) => ({
				...tab,
				todoItems: tab.todoItems || []
			})) || []
	};
};
