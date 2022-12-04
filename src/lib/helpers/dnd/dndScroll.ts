import { isUndefined } from '$lib/helpers/jsUtils';

//Dndzode x-axis scroll helper
export function dndScroll(
	dndZone: HTMLElement,
	{ scrollSpeed, centerSize }: { scrollSpeed: number; centerSize: number }
) {
	let timer: NodeJS.Timer;

	//get added element with id 'dnd-action-dragged-el'
	const observer = new MutationObserver(function (mutations) {
		mutations.forEach(function (mutation) {
			if (isUndefined(dndZone)) return;
			if (mutation.type !== 'childList') return;

			if (mutation.addedNodes.length !== 0) {
				const node = getFromNodeList(mutation.addedNodes, 'dnd-action-dragged-el');
				if (!isUndefined(node)) {
					timer = createTimer(node);
				}
			}
			if (mutation.removedNodes.length !== 0) {
				const node: HTMLElement | undefined = getFromNodeList(mutation.removedNodes, 'dnd-action-dragged-el');
				if (!isUndefined(node)) {
					clearInterval(timer);
				}
			}
		});
	});

	//subtree: true,
	observer.observe(document.body, { attributes: false, characterData: false, childList: true });

	const createTimer = (node: HTMLElement) => {
		return setInterval(() => {
			const rect = node.getBoundingClientRect();
			const fromCenter = rect.x + rect.width / 2 - window.innerWidth / 2;
			//if dragged element is in the center of the screen, do nothing
			if (Math.abs(fromCenter) < centerSize) return;

			//fromCenter < 0 means the left
			const side = fromCenter < 0 ? -1 : 1;

			dndZone.scrollTo({ left: dndZone.scrollLeft + side * scrollSpeed, top: 0, behavior: 'smooth' });
		}, 100);
	};

	const getFromNodeList = (nodeList: NodeList, id: string) => {
		let node: HTMLElement;
		for (const element of nodeList) {
			node = element as HTMLElement;
			if (node.id === id) {
				return node;
			}
		}
		return undefined;
	};

	return {
		destroy() {
			observer.disconnect();
			clearInterval(timer);
		}
	};
}
