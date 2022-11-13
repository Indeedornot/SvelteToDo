import { isUndefined } from '$lib/helpers/jsUtils';
import { TodoDisplayConstr, TodoItemConstr, TodoTabConstr } from '$lib/models/TodoDataConstr';
import type { TodoDisplayApiData, TodoItemApiData, TodoTabApiData } from '$lib/prisma/TodoApiData';

export const validateTodoDisplay = (display: TodoDisplayApiData): { code: number; error: string } | undefined => {
	if (!isValidTitle(display.title, TodoDisplayConstr.title.maxLength)) return { code: 400, error: 'Invalid title' };
	if (!isValidId(display.id)) return { code: 400, error: 'Invalid id' };
	if (display.todoTabs && !display.todoTabs.every((item) => isUndefined(validateTodoTab(item)))) {
		return { code: 400, error: 'Invalid TodoTabs' };
	}
	return undefined;
};

export const validateTodoTab = (tab: TodoTabApiData): { code: number; error: string } | undefined => {
	if (!isValidTitle(tab.title, TodoTabConstr.title.maxlength)) return { code: 400, error: 'Invalid title' };
	if (!isValidId(tab.id)) return { code: 400, error: 'Invalid id' };
	if (!isValidId(tab.todoDisplayId)) return { code: 400, error: 'Invalid todoDisplayId' };
	if (!isValidSortOrder(tab.sortOrder)) return { code: 400, error: 'Invalid sortOrder' };
	if (tab.todoItems && !tab.todoItems.every((item) => isUndefined(validateTodoItem(item)))) {
		return { code: 400, error: 'Invalid TodoItems' };
	}
	return undefined;
};

export const validateTodoItem = (item: TodoItemApiData): { code: number; error: string } | undefined => {
	if (!isValidStatus(item.status)) return { code: 400, error: 'Invalid status' };
	if (!isValidTitle(item.title, TodoItemConstr.title.maxlength)) return { code: 400, error: 'Invalid title' };
	if (!isValidId(item.todoTabId)) return { code: 400, error: 'Invalid todoTabId' };
	if (!isValidSortOrder(item.sortOrder)) return { code: 400, error: 'Invalid sortOrder' };
	if (!isValidId(item.id)) return { code: 400, error: 'Invalid id' };
	return undefined;
};

export const isValidId = (id: number) => {
	return Number.isInteger(id) && id >= -1;
};

export const isValidSortOrder = (sortOrder: number) => {
	return Number.isInteger(sortOrder) && sortOrder >= 0;
};

export const isValidTitle = (title: string, maxLength: number) => {
	return !isUndefined(title) && typeof title === 'string' && title.length <= maxLength;
};

export const isValidStatus = (status: string) => {
	return typeof status === 'string';
};
