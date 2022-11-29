export function blurClick(node: HTMLButtonElement, blur = true) {
	const handleClick = () => {
		if (blur) {
			node.blur();
		}
	};

	node.addEventListener('click', handleClick);

	return {
		destroy() {
			node.removeEventListener('click', handleClick);
		},

		update(newBlur: boolean) {
			blur = newBlur;
		}
	};
}
