export function sortBySortOrder<T extends { sortOrder: number }>(items: T[]): T[] {
	return items.sort((a, b) => a.sortOrder - b.sortOrder);
}

export function adjustSortOrder<T extends { sortOrder: number }>(items: T[]): T[] {
	return items.map((item, index) => ({
		...item,
		sortOrder: index
	}));
}
