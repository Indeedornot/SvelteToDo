import { isUndefined } from '../jsUtils';
import { restoreCursorPos, saveCursorPos } from './cursorPos';

export function maxLength(node: HTMLElement, { maxLength, value }: { maxLength: number; value?: string }) {
	node.innerText = (isUndefined(value) ? node.innerText : value).slice(0, maxLength - 1);
	let oldValue = node.innerText;

	const handleInput = (event: Event) => {
		const caretPosition = saveCursorPos(node);
		const target = event.target as HTMLDivElement;
		const text = target.innerText;
		if (text.length >= maxLength) {
			target.innerText = oldValue;
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
