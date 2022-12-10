import type { statusType } from '$lib/models/TodoData';

import { AbstractEntity } from './AbstractEntity';

export class TodoItem extends AbstractEntity {
	constructor(
		public title: string,
		public sortOrder: number,
		public status: statusType,
		public todoTabId: string,
		public collapsed: boolean,
		id?: string,
		createdAt?: Date,
		updatedAt?: Date
	) {
		super(id, createdAt, updatedAt);
	}
}
