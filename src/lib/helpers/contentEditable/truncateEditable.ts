//use onFocus and onBlur to toggle class truncate
export function truncateEditable(node: HTMLElement) {
	const handleFocus = () => {
		node.classList.remove('text-elipsis');
	};
	const handleBlur = () => {
		node.classList.add('text-elipsis');
	};

	node.addEventListener('focus', handleFocus);
	node.addEventListener('blur', handleBlur);
	return {
		destroy() {
			node.removeEventListener('focus', handleFocus);
			node.removeEventListener('blur', handleBlur);
		}
	};
}
