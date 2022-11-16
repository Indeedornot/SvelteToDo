/** Dispatch event on click outside of node */
export function clickOutside(node: HTMLElement) {
	const handleClick = (event: MouseEvent) => {
		if (node && !node.contains(event.target as HTMLElement) && !event.defaultPrevented) {
			node.dispatchEvent(new CustomEvent('clickoutside', { detail: node }));
		}
	};

	document.addEventListener('click', handleClick, false);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, false);
		}
	};
}
