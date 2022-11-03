import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import PrismaClient from '$lib/prisma/prisma';
import type { TodoDisplayData } from '$lib/models/TodoData';
import { todoDisplayDiff } from '$lib/models/todoDisplayDiff';
const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request }) => {
	const todoDisplay: TodoDisplayData = await request.json();

	//check if todoDisplay is valid
	if (!todoDisplay) {
		return error(400, 'Invalid todoDisplay');
	}

	//if it has id, means we want to update it
	if (!todoDisplay.id) {
		const newTodoDisplay = await prisma.todoDisplay.create({
			data: {
				title: todoDisplay.title,
				todoTabs: {
					create: todoDisplay.todoTabs.map((x) => ({
						title: x.title,
						todoItems: {
							create: x.todoItems.map((y) => ({
								title: y.title,
								status: y.status
							}))
						}
					}))
				}
			}
		});
	}

	const todoDisplayExists = await prisma.todoDisplay.findUnique({
		where: {
			id: todoDisplay.id
		},
		include: {
			todoTabs: {
				include: {
					todoItems: true
				}
			}
		}
	});

	//if it doesnt exist, create it
	if (!todoDisplayExists) {
		return error(400, 'TodoDisplay does not exist');
	}

	//if it exists, update it using diff
	const diff = todoDisplayDiff(todoDisplayExists, todoDisplay);

	//update title
	if (diff.update.title) {
		await prisma.todoDisplay.update({
			where: {
				id: todoDisplay.id
			},
			data: {
				title: diff.update.title
			}
		});
	}

	//create tabs
	if (diff.add.todoTabs) {
		for (const tab of diff.add.todoTabs) {
			await prisma.todoDisplay.update({
				where: {
					id: todoDisplay.id
				},
				data: {
					todoTabs: {
						create: {
							title: tab.title,
							todoItems: {
								create: tab.todoItems.map((x) => ({
									title: x.title,
									status: x.status
								}))
							}
						}
					}
				}
			});
		}
	}
	if (diff.add.todoItems) {
		for (const item of diff.add.todoItems) {
			await prisma.todoTab.update({
				where: {
					id: item.todoTabId
				},
				data: {
					todoItems: {
						create: {
							title: item.title,
							status: item.status
						}
					}
				}
			});
		}
	}

	//update tabs
	if (diff.update.todoTabs) {
		for (const tab of diff.update.todoTabs) {
			await prisma.todoTab.update({
				where: {
					id: tab.id
				},
				data: {
					title: tab.title
				}
			});
		}
	}
	if (diff.update.todoItems) {
		for (const item of diff.update.todoItems) {
			await prisma.todoItem.update({
				where: {
					id: item.id
				},
				data: {
					title: item.title,
					status: item.status
				}
			});
		}
	}

	//delete tabs
	if (diff.del.todoTabs) {
		for (const tab of diff.del.todoTabs) {
			await prisma.todoTab.deleteMany({
				where: {
					id: tab.id
				}
			});
		}
	}
	if (diff.del.todoItems) {
		for (const item of diff.del.todoItems) {
			await prisma.todoItem.deleteMany({
				where: {
					id: item.id
				}
			});
		}
	}
};

export const GET: RequestHandler = async ({ url }) => {
	// const params = url.searchParams;
	// console.log('GET Params', params);
	// return json({ params });

	const todoDisplay = await prisma.todoDisplay.findFirst({
		include: {
			todoTabs: {
				include: {
					todoItems: true
				}
			}
		}
	});

	console.log('todoDisplay', todoDisplay);

	return json(todoDisplay);
};
