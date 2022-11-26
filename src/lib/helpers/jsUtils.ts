export const isUndefined = (x: unknown): x is undefined => {
	return typeof x === 'undefined';
};

export const areSomeUndefined = (x: Array<unknown>) => {
	return x.some(isUndefined);
};

export const areAllUndefined = (x: Array<unknown>): x is Array<undefined> => {
	return x.every(isUndefined);
};

export const isUndefinedOrEmpty = (x: unknown): x is undefined | string => {
	return isUndefined(x) || x === '';
};

export const isString = (x: unknown): x is string => {
	return typeof x === 'string';
};

export const isBoolean = (x: unknown): x is boolean => {
	return typeof x === 'boolean';
};

export const isObject = (x: unknown): x is object => {
	return typeof x === 'object' && x !== null;
};

export const capitalizeStart = (str: string) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 *
 * @param x Request
 * @returns Either parsed data or error
 *
 * Returns neither if parsed data is not of type T
 */
export const parseJson = async <T>(
	x: Request
): Promise<{ data: T; error?: never } | { data?: never; error: string }> => {
	try {
		const parsedData: T = await x.json();
		if (isUndefined(parsedData)) return { error: 'Missing data' };
		return { data: parsedData };
	} catch (e: unknown) {
		if (typeof e === 'string') {
			return { error: e }; // works, `e` narrowed to string
		} else if (e instanceof Error) {
			return { error: e.message }; // works, `e` narrowed to Error
		}
		return { error: 'Unknown error' };
		// ... handle other error types
	}
};
