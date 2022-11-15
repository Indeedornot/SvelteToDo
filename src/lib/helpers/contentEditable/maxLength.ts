import { restoreCursorPos, saveCursorPos } from './cursorPos';

export function maxLength(node: HTMLElement, maxLength: number) {
	node.innerText = node.innerText.slice(0, maxLength - 1);
	let oldValue = node.innerText;

	const handleInput = (event: Event) => {
		const caretPosition = saveCursorPos(node);
		const target = event.target as HTMLDivElement;
		const text = target.innerText;
		if (text.length >= maxLength) {
			target.innerText = oldValue;
			console.log(caretPosition);
			restoreCursorPos(target, caretPosition);
			node.focus();
		}
		oldValue = target.innerText;
	};

	node.addEventListener('input', handleInput);

	return {
		destroy() {
			node.removeEventListener('input', handleInput);
		}
	};
}
