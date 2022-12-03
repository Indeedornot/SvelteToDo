/** Dispatch event on click outside of node */
export function clickOutside(node: HTMLElement, exceptions: HTMLElement[] = []) {
	let except = exceptions;

	const handleClick = (event: MouseEvent) => {
		const target = event.target as HTMLElement;
		if (node && !node.contains(target) && !except.find((x) => x?.contains(target)) && !event.defaultPrevented) {
			console.log('clickOutside');
			node.dispatchEvent(new CustomEvent('clickOutside', { detail: node }));
		}
	};

	document.addEventListener('click', handleClick, false);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, false);
		},
		update(newExceptions: HTMLElement[]) {
			except = newExceptions;
		}
	};
}
