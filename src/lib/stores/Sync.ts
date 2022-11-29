import { writable } from 'svelte/store';

export type SyncData =
	| {
			isSync: false;
			error: string;
	  }
	| {
			isSync: true;
	  };

const createSync = () => {
	const { subscribe, set, update } = writable<SyncData>({ isSync: true });

	const setSync = (data: SyncData) => {
		if (data.isSync) set({ isSync: true });
		else set({ isSync: false, error: data.error || 'Unknown error' });
	};

	return {
		subscribe,
		set: setSync,
		update
	};
};

export const isSynced = createSync();
