export function dndVirtualization(node: HTMLElement) {
	//use intersection observer to check if element is visible to user
	const observer = new IntersectionObserver((entries) => {
		entries.forEach(
			(entry) => {
				node.dispatchEvent(new CustomEvent('dndVirtualization', { detail: entry.isIntersecting }));
			},
			{
				threshold: 0.5,
				root: node.parentElement
			}
		);
	});

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
