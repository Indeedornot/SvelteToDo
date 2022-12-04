/** Dispatch event on click outside of node */
export function clickOutside(node: HTMLElement, exceptions: HTMLElement[] = []) {
	let except = exceptions;

	const handleClick = (event: MouseEvent) => {
		const target = event.target as HTMLElement;

		if (
			node &&
			//still in dom
			document.body.contains(target) &&
			!event.defaultPrevented &&
			//not a child of node
			!node.contains(target) &&
			//not in exceptions
			!except.find((x) => x?.contains(target))
		) {
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
