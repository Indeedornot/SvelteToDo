/** Dispatch event on click outside of node */
export function clickOutside(node: HTMLElement, exceptions: HTMLElement[] = []) {
	let except = exceptions;

	const handleClick = (event: Event) => {
		const target = event.target as HTMLElement;

		console.log('target', target);
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
	document.addEventListener('touchstart', handleClick, false);
	document.addEventListener('dragstart', handleClick, false);
	document.addEventListener('mousedown', handleClick, false);
	document.addEventListener('focusin', handleClick, false);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, false);
			document.removeEventListener('touchstart', handleClick, false);
			document.removeEventListener('dragstart', handleClick, false);
			document.removeEventListener('mousedown', handleClick, false);
			document.removeEventListener('focusin', handleClick, false);
		},
		update(newExceptions: HTMLElement[]) {
			except = newExceptions;
		}
	};
}
