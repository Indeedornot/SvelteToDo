import { error, json } from '@sveltejs/kit';

import type { TodoDisplay, TodoItem, TodoTab } from '@prisma/client';

import { isUndefined, parseJson } from '$lib/helpers/jsUtils';
import type { TodoDisplayApiData } from '$lib/prisma/TodoApiData';
import { validateTodoDisplay } from '$lib/server/DataValidation';
import prisma from '$lib/server/prisma';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	//#region Parse request
	const parsed = await parseJson<TodoDisplayApiData>(request);
	if (!isUndefined(parsed.error)) return error(400, parsed.error);

	const data: TodoDisplayApiData = parsed.data!;
	const validErr = validateTodoDisplay(data);
	if (validErr) return error(validErr.code, validErr.error);

	//#endregion

	let todoDisplay: TodoDisplay & { todoTabs?: (TodoTab & { todoItems?: TodoItem[] })[] };

	//add new tab
	if (data.id === -1) {
		todoDisplay = await prisma.todoDisplay.create({
			data: {
				title: data.title,
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
	}
	//update existing tab
	else {
		const existsDisplay = (await prisma.todoDisplay.count({ where: { id: data.id } })) == 1;
		if (!existsDisplay) return error(400, 'Tab not found');
		todoDisplay = await prisma.todoDisplay.update({
			where: {
				id: data.id
			},
			data: {
				title: data.title
			},
			include: {
				todoTabs: {
					include: {
						todoItems: true
					}
				}
			}
		});
	}

	const returnData: TodoDisplayApiData = todoDisplayWithoutUndefined(todoDisplay);
	return json(returnData);
};

// export const DELETE: RequestHandler = async ({ request }) => {
// 	return new Response('ok', { status: 200 });
// };

export const GET: RequestHandler = async ({ url }) => {
	// const params = url.searchParams;
	// console.log('GET Params', params);
	// return json({ params });

	let todoDisplay = await prisma.todoDisplay.findFirst({
		include: {
			todoTabs: {
				include: {
					todoItems: true
				}
			}
		}
	});

	if (!todoDisplay) {
		const newDisplay = await prisma.todoDisplay.create({
			data: {
				title: 'Default'
			}
		});

		todoDisplay = {
			id: newDisplay.id,
			title: newDisplay.title,
			todoTabs: [],
			updatedAt: newDisplay.updatedAt,
			createdAt: newDisplay.createdAt
		};
	}

	const returnData: TodoDisplayApiData = todoDisplayWithoutUndefined(todoDisplay);
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
