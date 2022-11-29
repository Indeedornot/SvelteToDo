import { writable } from 'svelte/store';

const createSync = () => {
	const { subscribe, set, update } = writable(true);

	const setSync = (sync: boolean) => {
		set(sync);
	};

	return {
		subscribe,
		set: setSync,
		update
	};
};

export const isSynced = createSync();
