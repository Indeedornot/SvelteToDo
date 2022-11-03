import { TodoDisplayDataSample } from '$lib/models/SampleData';
import type { TodoDisplayData } from '$lib/models/TodoData';
import { todoDisplayDiff } from '$lib/models/todoDisplayDiff';

const todoDisplay: TodoDisplayData = {
	id: 0,
	title: 'test',
	todoTabs: TodoDisplayDataSample
};

const getCopy = (obj: TodoDisplayData): TodoDisplayData => {
	return JSON.parse(JSON.stringify(obj));
};

test('Should Return Deleted Tab', () => {
	const todoDisplayCopy = getCopy(todoDisplay);
	todoDisplayCopy.todoTabs.splice(0, 1);
	const diff = todoDisplayDiff(todoDisplay, todoDisplayCopy);
	expect(diff.del.todoTabs.length).toBe(1);
	expect(diff.del.todoItems.length).toBe(0);
	expect(diff.update.todoTabs.length).toBe(0);
	expect(diff.update.todoItems.length).toBe(0);
	expect(diff.update.title).toBeUndefined();
	expect(diff.add.todoTabs.length).toBe(0);
	expect(diff.add.todoItems.length).toBe(0);
});

test('Should Return Updated Tab', () => {
	const todoDisplayCopy = getCopy(todoDisplay);
	todoDisplayCopy.todoTabs[0].title = 'updated';
	const diff = todoDisplayDiff(todoDisplay, todoDisplayCopy);
	expect(diff.update.todoTabs.length).toBe(1);
	expect(diff.del.todoTabs.length).toBe(0);
	expect(diff.del.todoItems.length).toBe(0);
	expect(diff.update.todoItems.length).toBe(0);
	expect(diff.update.title).toBeUndefined();
	expect(diff.add.todoTabs.length).toBe(0);
	expect(diff.add.todoItems.length).toBe(0);
});

test('Should Return Added Tab', () => {
	const todoDisplayCopy = getCopy(todoDisplay);
	todoDisplayCopy.todoTabs.push({
		id: -1,
		title: 'added',
		todoItems: []
	});
	const diff = todoDisplayDiff(todoDisplay, todoDisplayCopy);
	expect(diff.add.todoTabs.length).toBe(1);
	expect(diff.del.todoTabs.length).toBe(0);
	expect(diff.del.todoItems.length).toBe(0);
	expect(diff.update.todoTabs.length).toBe(0);
	expect(diff.update.todoItems.length).toBe(0);
	expect(diff.update.title).toBeUndefined();
	expect(diff.add.todoItems.length).toBe(0);
});

test('Should Return Deleted Item', () => {
	const todoDisplayCopy = getCopy(todoDisplay);
	todoDisplayCopy.todoTabs[0].todoItems.splice(0, 1);
	const diff = todoDisplayDiff(todoDisplay, todoDisplayCopy);
	expect(diff.del.todoItems.length).toBe(1);
	expect(diff.del.todoTabs.length).toBe(0);
	expect(diff.update.todoTabs.length).toBe(0);
	expect(diff.update.todoItems.length).toBe(0);
	expect(diff.update.title).toBeUndefined();
	expect(diff.add.todoTabs.length).toBe(0);
	expect(diff.add.todoItems.length).toBe(0);
});

test('Should Return Updated Item', () => {
	const todoDisplayCopy = getCopy(todoDisplay);
	todoDisplayCopy.todoTabs[0].todoItems[0].title = 'updated';
	const diff = todoDisplayDiff(todoDisplay, todoDisplayCopy);
	expect(diff.update.todoItems.length).toBe(1);
	expect(diff.del.todoTabs.length).toBe(0);
	expect(diff.del.todoItems.length).toBe(0);
	expect(diff.update.todoTabs.length).toBe(0);
	expect(diff.update.title).toBeUndefined();
	expect(diff.add.todoTabs.length).toBe(0);
	expect(diff.add.todoItems.length).toBe(0);
});

test('Should Return Added Item', () => {
	const todoDisplayCopy = getCopy(todoDisplay);
	todoDisplayCopy.todoTabs[0].todoItems.push({
		id: -1,
		title: 'added',
		status: 'todo',
		todoTabId: 0
	});
	const diff = todoDisplayDiff(todoDisplay, todoDisplayCopy);
	expect(diff.add.todoItems.length).toBe(1);
	expect(diff.del.todoTabs.length).toBe(0);
	expect(diff.del.todoItems.length).toBe(0);
	expect(diff.update.todoTabs.length).toBe(0);
	expect(diff.update.todoItems.length).toBe(0);
	expect(diff.update.title).toBeUndefined();
	expect(diff.add.todoTabs.length).toBe(0);
});

test('Should Return Updated Title', () => {
	const todoDisplayCopy = getCopy(todoDisplay);
	todoDisplayCopy.title = 'updated';
	console.log(todoDisplayCopy);
	const diff = todoDisplayDiff(todoDisplay, todoDisplayCopy);
	expect(diff.update.title).toBe('updated');
	expect(diff.del.todoTabs.length).toBe(0);
	expect(diff.del.todoItems.length).toBe(0);
	expect(diff.update.todoTabs.length).toBe(0);
	expect(diff.update.todoItems.length).toBe(0);
	expect(diff.add.todoTabs.length).toBe(0);
	expect(diff.add.todoItems.length).toBe(0);
});

test('Should Return Moved Item', () => {
	const todoDisplayCopy = getCopy(todoDisplay);

	const item = todoDisplayCopy.todoTabs[1].todoItems.splice(0, 1)[0];
	item.todoTabId = todoDisplayCopy.todoTabs[0].id;

	todoDisplayCopy.todoTabs[0].todoItems.push(item);
	const diff = todoDisplayDiff(todoDisplay, todoDisplayCopy);
	expect(diff.update.todoItems.length).toBe(1);
	expect(diff.del.todoTabs.length).toBe(0);
	expect(diff.del.todoItems.length).toBe(0);
	expect(diff.update.todoTabs.length).toBe(0);
	expect(diff.update.title).toBeUndefined();
	expect(diff.add.todoTabs.length).toBe(0);
	expect(diff.add.todoItems.length).toBe(0);
});

test('Should Return Moved Item From Deleted Tab', () => {
	const todoDisplayCopy = getCopy(todoDisplay);

	const item = todoDisplayCopy.todoTabs[1].todoItems.splice(0, 1)[0];
	item.todoTabId = todoDisplayCopy.todoTabs[0].id;
	todoDisplayCopy.todoTabs[0].todoItems.push(item);
	todoDisplayCopy.todoTabs.splice(1, 1);

	const diff = todoDisplayDiff(todoDisplay, todoDisplayCopy);
	expect(diff.update.todoItems.length).toBe(1);
	expect(diff.del.todoTabs.length).toBe(1);
	expect(diff.del.todoItems.length).toBe(0);
	expect(diff.update.todoTabs.length).toBe(0);
	expect(diff.update.title).toBeUndefined();
	expect(diff.add.todoTabs.length).toBe(0);
	expect(diff.add.todoItems.length).toBe(0);
});
