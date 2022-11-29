//use onFocus and onBlur to toggle class truncate
export function truncateEditable(node: HTMLElement, singleLine = true) {
	const classList = node.classList;
	if (classList.contains('truncate')) {
		classList.remove('truncate');
	}
	if (singleLine) {
		classList.add('text-ellipsis');
		classList.add('overflow-hidden');
		classList.add('whitespace-nowrap');
	}

	const handleFocus = () => {
		if (!singleLine) return;
		node.classList.remove('text-ellipsis');
	};
	const handleBlur = () => {
		if (!singleLine) return;
		node.classList.add('text-ellipsis');
	};

	node.addEventListener('focus', handleFocus);
	node.addEventListener('blur', handleBlur);
	return {
		destroy() {
			node.removeEventListener('focus', handleFocus);
			node.removeEventListener('blur', handleBlur);
		},

		update(isSingleLine: boolean) {
			if (isSingleLine === singleLine) return;

			singleLine = isSingleLine;
			if (singleLine) {
				node.classList.add('text-ellipsis');
				classList.add('overflow-hidden');
				classList.add('whitespace-nowrap');
			} else {
				node.classList.remove('text-ellipsis');
				classList.remove('overflow-hidden');
				classList.remove('whitespace-nowrap');
			}
		}
	};
}
