//Quick typing fix for svelte-dnd-action

declare module 'svelte-icons';

declare type Item = import('svelte-dnd-action').Item;
declare type DndEvent<ItemType = Item> = import('svelte-dnd-action').DndEvent<ItemType>;

declare namespace svelte.JSX {
	interface HTMLAttributes<T> {
		onclickOutside: () => void;
		onstopTyping: (event: CustomEvent<{ text: string }>) => void;
		onconsider?: (event: CustomEvent<DndEvent<ItemType>> & { target: EventTarget & T }) => void;
		onfinalize?: (event: CustomEvent<DndEvent<ItemType>> & { target: EventTarget & T }) => void;
		ondragged?: (event: CustomEvent<{ isDragged: boolean }> & { target: EventTarget & T }) => void;
	}
}
