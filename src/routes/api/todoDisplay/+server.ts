import { json } from '@sveltejs/kit';

import { isUndefined } from '$lib/helpers/jsUtils';
import type { TodoDisplayData } from '$lib/models/TodoData';
import prisma from '$lib/prisma/prisma';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const data: { id: number; title: string } = await request.json();
	if (isUndefined(data.title)) return new Response('Missing title', { status: 400 });
	if (isUndefined(data.id)) return new Response('Missing id', { status: 400 });

	let todoDisplay: TodoDisplayData;
	if (data.id == -1) {
		//add new tab
		const newDisplay = await prisma.todoDisplay.create({
			data: {
				title: data.title
			}
		});
		todoDisplay = {
			id: newDisplay.id,
			title: newDisplay.title,
			todoTabs: []
		};
	} else {
		const existsDisplay = (await prisma.todoDisplay.count({ where: { id: data.id } })) == 1;
		if (!existsDisplay) return new Response('Tab not found', { status: 400 });
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

	const todoDisplayData: TodoDisplayData = {
		id: todoDisplay.id,
		title: todoDisplay.title,
		todoTabs: todoDisplay.todoTabs || []
	};
	return json(todoDisplayData);
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

	const todoDisplayData: TodoDisplayData = {
		id: todoDisplay.id,
		title: todoDisplay.title,
		todoTabs: todoDisplay.todoTabs || [],
		updatedAt: todoDisplay.updatedAt,
		createdAt: todoDisplay.createdAt
	};

	return json(todoDisplayData);
};
