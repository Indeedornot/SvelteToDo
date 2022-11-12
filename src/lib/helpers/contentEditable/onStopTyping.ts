export function stopTyping(node: HTMLElement, timeToWait = 500) {
	const handleKeyup = debounce((event: KeyboardEvent) => {
		// (1) the debounce logic
		if (node.contains(event.target as HTMLElement)) {
			// (2) restrict the event to the only referring node
			node.dispatchEvent(new CustomEvent('stopTyping')); // (3) fire the event
		}
	}, timeToWait);

	// (4) add a generic keyup event
	document.addEventListener('keyup', handleKeyup, true);

	return {
		destroy() {
			// (5) cleanup on destroy
			document.removeEventListener('keyup', handleKeyup, true);
		}
	};
}

function debounce(inputFunction: (event: KeyboardEvent) => unknown, timeToWaitBeforeFiringInMs = 500) {
	let timer: NodeJS.Timeout;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			inputFunction.apply(this, args);
		}, timeToWaitBeforeFiringInMs);
	};
}
