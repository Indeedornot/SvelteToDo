<script lang="ts">
	import { TabMore } from '$components/Todo';
	import { maxLength, stopTyping, truncateEditable } from '$lib/helpers/contentEditable';
	import { singleLine } from '$lib/helpers/contentEditable/singleLine';
	import { TodoTabConstr } from '$lib/models/TodoDataConstr';
	import '$lib/styles/ContentEditable.css';
	import '$lib/styles/Scrollbar.css';

	export let onDelete: () => void;
	export let onStopTyping: () => void;
	export let title: string;
	export let isDragged: boolean = false;
	export let itemCount: number;
	const onDrag = (e: Event) => {
		e.preventDefault();
		isDragged = true;
	};
</script>

<div class="flex h-[42px] flex-col pb-[2px] text-[16px] font-bold">
	<div class="flex h-[10px] w-full flex-none items-end justify-center pb-[2px]">
		<div
			class="box-border flex h-full w-4/12 flex-none cursor-grab rounded-b bg-secondary hover:bg-border"
			on:mousedown={onDrag}
			class:dragging={isDragged}
			on:mouseup={() => {
				isDragged = false;
			}}
		/>
	</div>
	<div class="flex max-h-full w-full flex-shrink-0 flex-grow flex-row items-center px-[12px] text-font-primary">
		<div
			class="single-line content-editable mr-[4px] flex truncate rounded pl-[4px] pr-[4px] transition-colors duration-200
			ease-linear hover:bg-secondary focus:bg-secondary"
			contenteditable="true"
			use:stopTyping
			on:stopTyping={(event) => {
				title = event.detail.text;
				onStopTyping();
			}}
			use:singleLine
			use:maxLength={{ maxLength: TodoTabConstr.title.maxLength, value: title }}
			use:truncateEditable
		/>

		<span
			class="relative mx-1 flex w-fit items-center justify-center truncate rounded-full
			bg-secondary py-[2px] px-[4px] text-xs font-semibold leading-tight text-font-secondary first:ml-0"
			>{itemCount}
		</span>
		<div class="ml-auto box-border flex h-[90%] w-[10%] items-center justify-center p-0.5">
			<TabMore onDelete={onDelete} />
		</div>
	</div>
</div>

<!-- 
<div class="flex h-[42px] flex-col pb-[2px] text-[16px] font-bold">
	<div
		class="flex h-[10px] w-full flex-none cursor-grab hover:bg-secondary"
		on:mousedown={onDrag}
		on:touchstart={onDrag}
		class:dragging={isDragged}
	/>
	<div
		class="flex max-h-full w-full flex-shrink-0 flex-grow flex-row items-center px-[12px] text-font-primary"
	>
		<div
			class="single-line content-editable mr-[15px] flex flex-grow text-ellipsis rounded py-[2px] pl-[4px] transition-colors duration-200 ease-linear
			hover:bg-secondary focus:bg-secondary"
			contenteditable="true"
			bind:innerHTML={title}
			use:stopTyping
			on:stopTyping={onStopTyping}
			use:maxLength={TodoTabConstr.title.maxlength}
			use:truncateEditable
		/>

		<div class="m-0 box-border aspect-square h-full justify-center p-0.5">
			<button
				class="h-full w-full rounded p-1.5 text-font-secondary shadow outline-none transition-colors duration-200 ease-linear hover:bg-secondary"
				type="button"
				on:click={onDelete}
			>
				<FaMinus />
			</button>
		</div>
	</div>
</div> 
-->
<style>
	.dragging {
		cursor: grabbing;
	}
</style>
