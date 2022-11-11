import { error, json } from '@sveltejs/kit';

import { areSomeUndefined } from '$lib/helpers/jsUtils';
import type { TodoTabData } from '$lib/models/TodoData';
import prisma from '$lib/prisma/prisma';

import type { RequestHandler } from './$types';

//! Doesnt return the todoItems
export const POST: RequestHandler = async ({ request }) => {
	const data: TodoTabData = await request.json();
	if (areSomeUndefined([data.id, data.title])) return new Response('Missing title or id', { status: 400 });

	let todoTab: TodoTabData;
	if (data.id == -1) {
		//add new item
		const newTab = await prisma.todoTab.create({
			data: {
				title: data.title,
				sortOrder: data.sortOrder,
				todoDisplayId: data.todoDisplayId,
				todoItems: {
					create: data.todoItems || []
				}
			},
			include: {
				todoItems: true
			}
		});

		todoTab = {
			id: newTab.id,
			title: newTab.title,
			sortOrder: newTab.sortOrder,
			todoDisplayId: newTab.todoDisplayId,
			todoItems: newTab.todoItems || []
		};
	} else {
		//update existing item
		const existsTab = (await prisma.todoTab.count({ where: { id: data.id } })) == 1;
		if (!existsTab) return new Response('Tab not found', { status: 400 });

		todoTab = await prisma.todoTab.update({
			where: {
				id: data.id
			},
			data: {
				title: data.title,
				sortOrder: data.sortOrder,
				todoDisplayId: data.todoDisplayId
			},
			include: {
				todoItems: true
			}
		});
	}

	return json(todoTab);
};

export const DELETE: RequestHandler = async ({ request }) => {
	const data: { id: number } = await request.json();
	if (!data.id) return new Response('Missing id', { status: 400 });

	const existsTab = (await prisma.todoTab.count({ where: { id: data.id } })) == 1;
	if (!existsTab) return new Response('Item not found', { status: 400 });
	await prisma.todoTab.delete({
		where: {
			id: data.id
		}
	});

	return new Response('ok');
};

export const GET: RequestHandler = async ({ url }) => {
	const params = url.searchParams;

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
		return json(todoTab);
	} else if (params.has('todoDisplayId')) {
		const todoDisplayId = parseInt(params.get('todoDisplayId')!);
		if (isNaN(todoDisplayId)) return error(400, 'Invalid todoDisplayId');
		const todoTabs = await prisma.todoTab.findMany({
			where: {
				todoDisplayId: todoDisplayId
			}
		});
		return json(todoTabs);
	}

	return error(400, 'Invalid parameters');
};
