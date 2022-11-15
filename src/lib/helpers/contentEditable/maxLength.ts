import { restoreCursorPos, saveCursorPos } from './cursorPos';

export function maxLength(node: HTMLElement, maxLength: number) {
	const handleInput = (event: Event) => {
		const caretPosition = saveCursorPos(node);
		const target = event.target as HTMLDivElement;
		const text = target.innerText;
		if (text.length > maxLength - 1) {
			target.innerText = text.slice(0, maxLength - 1);
			restoreCursorPos(target, caretPosition);
			node.focus();
		}
	};

	node.innerText = node.innerText.slice(0, maxLength);

	node.addEventListener('input', handleInput);

	return {
		destroy() {
			node.removeEventListener('input', handleInput);
		}
	};
}
