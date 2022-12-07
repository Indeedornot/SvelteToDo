import type { statusType } from '../TodoData';

export enum sortType {
	created = 'Created',
	updated = 'Updated',
	status = 'Status',
	none = 'None'
}

export type TabFilterData = {
	itemData: {
		statuses: {
			[status in statusType]: boolean;
		};
	};
};
