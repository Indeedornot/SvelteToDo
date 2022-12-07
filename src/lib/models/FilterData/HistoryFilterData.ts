export type HistoryFilterData = {
	historyData: {
		item: {
			added: boolean;
			removed: boolean;
			changed: boolean;
		};
		tab: {
			added: boolean;
			removed: boolean;
			changed: boolean;
		};
		display: {
			added: boolean;
			removed: boolean;
			changed: boolean;
		};
	};
	sort: sortType;
};

export enum sortType {
	date = 'date',
	type = 'type',
	historyType = 'history'
}
