import { statusType } from '../TodoData';

export enum sortType {
	created = 'Created',
	updated = 'Updated',
	status = 'Status',
	none = 'None'
}

export type TabFilterData = {
	statuses: {
		[status in statusType]: boolean;
	};
};

export const getDefaultFilterData = (): TabFilterData => {
	return {
		statuses: {
			...Object.fromEntries(Object.values(statusType).map((status) => [status, true]))
		}
	};
};
