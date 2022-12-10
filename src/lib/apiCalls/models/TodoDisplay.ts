import { AbstractEntity } from './AbstractEntity';
import type { TodoTab } from './TodoTab';

export class TodoDisplay extends AbstractEntity {
	todoTabs!: TodoTab[];

	constructor(public title: string, public sortOrder: number, id?: string, createdAt?: Date, updatedAt?: Date) {
		super(id, createdAt, updatedAt);

		Object.defineProperties(this, {
			todoTabs: {
				value: [],
				writable: true,
				enumerable: false
			}
		});
	}
}
