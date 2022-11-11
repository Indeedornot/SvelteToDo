export const isUndefined = (x: unknown): boolean => {
	return typeof x === 'undefined';
};

export const areSomeUndefined = (x: Array<unknown>) => {
	return x.some(isUndefined);
};

export const areAllUndefined = (x: Array<unknown>) => {
	return x.every(isUndefined);
};

export const isUndefinedOrEmpty = (x: unknown): boolean => {
	return isUndefined(x) || x === '';
};
