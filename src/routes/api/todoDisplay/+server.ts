import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import PrismaClient from '$lib/prisma/prisma';
import type { TodoDisplayData } from '$lib/models/TodoData';
const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request }) => {
	const data: { id: number; title: string } = await request.json();
	if (!data.title) return new Response('Missing title', { status: 400 });
	if (!data.id) return new Response('Missing id', { status: 400 });

	let todoDisplay;
	if (data.id == -1) {
		//add new tab
		todoDisplay = await prisma.todoDisplay.create({
			data: {
				title: data.title
			}
		});
	} else {
		const existingTab = await prisma.todoDisplay.findFirst({ where: { id: data.id } });
		if (!existingTab) return new Response('Tab not found', { status: 400 });
		todoDisplay = await prisma.todoDisplay.update({
			where: {
				id: data.id
			},
			data: {
				title: data.title
			}
		});
	}

	const todoDisplayData: TodoDisplayData = { id: todoDisplay.id, title: todoDisplay.title, todoTabs: [] };
	return json(todoDisplayData);
};

// export const DELETE: RequestHandler = async ({ request }) => {
// 	return new Response('ok', { status: 200 });
// };

export const GET: RequestHandler = async ({ url }) => {
	// const params = url.searchParams;
	// console.log('GET Params', params);
	// return json({ params });

	const todoDisplay = (await prisma.todoDisplay.findFirst({
		include: {
			todoTabs: {
				include: {
					todoItems: true
				}
			}
		}
	})) as TodoDisplayData;
	console.log('todoDisplay', todoDisplay);

	return json(todoDisplay);
};
