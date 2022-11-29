//delays clicking of the button until given time passed
export function delayEnabled(node: HTMLButtonElement, time: number) {
	node.disabled = true;
	const timeOut = setTimeout(() => {
		node.disabled = false;
		clearTimeout(timeOut);
	}, time);

	return {
		destroy() {
			clearTimeout(timeOut);
		}
	};
}
