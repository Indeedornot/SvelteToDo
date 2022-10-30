/** Dispatch event on click outside of node */
export function clickOutside(node) {
	const handleClick = (event) => {
		if (node && !node.contains(event.target) && !event.defaultPrevented) {
			node.dispatchEvent(new CustomEvent('clickoutside', node));
		}
	};

	document.addEventListener('click', handleClick, false);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, false);
		}
	};
}
