export function dndHandle(node: HTMLElement, isDragged: boolean) {
	node.ariaLabel = 'drag-handle';
	node.tabIndex = isDragged ? -1 : 0;

	const dragged = {
		set(value: boolean) {
			node.tabIndex = value ? -1 : 0;
			node.dispatchEvent(new CustomEvent('dragged', { detail: { isDragged: value } }));
		}
	};

	const onDrag = (e: Event) => {
		//Under the assumption that handle is one element with no children as a part of it
		if (e.target !== node) return;
		dragged.set(true);
	};
	const onDragEnd = () => {
		dragged.set(false);
	};

	node.addEventListener('mousedown', onDrag);
	node.addEventListener('mouseup', onDragEnd);
	node.addEventListener('touchstart', onDrag);
	node.addEventListener('touchend', onDragEnd);

	return {
		destroy() {
			node.removeEventListener('mousedown', onDrag);
			node.removeEventListener('mouseup', onDragEnd);
			node.removeEventListener('touchstart', onDrag);
			node.removeEventListener('touchend', onDragEnd);
		},

		update(value: boolean) {
			isDragged = value;
		}
	};
}
