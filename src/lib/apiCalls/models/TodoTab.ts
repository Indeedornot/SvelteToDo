import { AbstractEntity } from './AbstractEntity';
import type { TodoItem } from './TodoItem';

export class TodoTab extends AbstractEntity {
	todoItems!: TodoItem[];

	constructor(
		public title: string,
		public sortOrder: number,
		public todoDisplayId: string,
		id?: string,
		createdAt?: Date,
		updatedAt?: Date
	) {
		super(id, createdAt, updatedAt);

		Object.defineProperties(this, {
			todoItems: {
				value: [],
				writable: true,
				enumerable: false
			}
		});
	}
}
