//use onFocus and onBlur to toggle class truncate
export function truncateEditable(node: HTMLElement) {
	const classList = node.classList;
	if (classList.contains('truncate')) {
		classList.remove('truncate');
	}
	classList.add('text-ellipsis');
	classList.add('overflow-hidden');
	classList.add('whitespace-nowrap');

	const handleFocus = () => {
		node.classList.remove('text-ellipsis');
	};
	const handleBlur = () => {
		node.classList.add('text-ellipsis');
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
