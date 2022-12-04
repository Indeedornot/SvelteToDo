export function dndHandle(node: HTMLElement, isDragged: boolean) {
	node.ariaLabel = 'drag-handle';

	const dragged = {
		set(value: boolean) {
			node.tabIndex = value ? -1 : 0;
			node.dispatchEvent(new CustomEvent('dragged', { detail: { isDragged: value } }));
		}
	};

	const dragKeys = {
		move: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'],
		start: ['Enter', ' ']
	};

	const onDragKeyboard = (e: KeyboardEvent) => {
		if (dragKeys.start.includes(e.key) && !isDragged) {
			dragged.set(true);
		} else if (dragKeys.move.includes(e.key)) {
			e.preventDefault();
		} else {
			dragged.set(false);
		}
	};

	const onDrag = (e: Event) => {
		dragged.set(true);
	};
	const onDragEnd = (e: Event) => {
		dragged.set(false);
	};

	node.addEventListener('mousedown', onDrag);
	node.addEventListener('mouseup', onDragEnd);
	node.addEventListener('keydown', onDragKeyboard);
	node.addEventListener('touchstart', onDrag);
	node.addEventListener('touchend', onDragEnd);

	return {
		destroy() {
			node.removeEventListener('mousedown', onDrag);
			node.removeEventListener('mouseup', onDragEnd);
			node.removeEventListener('keydown', onDragKeyboard);
			node.removeEventListener('touchstart', onDrag);
			node.removeEventListener('touchend', onDragEnd);
		},

		update(value: boolean) {
			isDragged = value;
		}
	};
}
