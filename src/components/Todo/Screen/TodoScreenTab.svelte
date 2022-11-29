<script lang="ts">
	import { Project } from '$components/Icons';
	import { ScreenMore } from '$components/Todo';
	import { postTodoDisplay } from '$lib/apiCalls/TodoActions';
	import { maxLength, stopTyping, truncateEditable } from '$lib/helpers/contentEditable';
	import { singleLine } from '$lib/helpers/contentEditable/singleLine';
	import { slide } from '$lib/helpers/slideAnim';
	import type { TodoDisplayData } from '$lib/models/TodoData';
	import { TodoDisplayConstr } from '$lib/models/TodoDataConstr';
	import '$lib/styles/ContentEditable.css';

	export let data: TodoDisplayData;
	export let chosen: boolean;
	export let changeIndex: (id: number) => void;
	export let onDelete: (id: number) => void;

	const postDisplay = () => {
		postTodoDisplay(data, true).catch();
	};
</script>

<div
	class="rounded-t border border-b-0 border-muted bg-default hover:bg-overlay"
	out:slide={{ axis: 'x', duration: 400 }}
	in:slide={{ axis: 'x', duration: 400, delay: 50, easing: (t) => (t * t) / 2 }}
>
	<div
		class="flex h-full w-full flex-none flex-row px-3 py-1 transition-all duration-300 ease-linear"
		class:px-2={chosen}
		class:text-default={chosen}
		class:font-semibold={chosen}
		class:bg-subtle={chosen}
	>
		<button class="flex flex-none flex-row items-center justify-center" on:click={() => changeIndex(data.sortOrder)}>
			<Project size={20} class="pr-1" />
			<div
				contenteditable={chosen}
				class="content-editable rounded px-1 focus-within:shadow-outline-muted"
				use:singleLine
				use:maxLength={{ maxLength: TodoDisplayConstr.title.maxLength, value: data.title }}
				use:truncateEditable
				use:stopTyping
				on:stopTyping={(e) => {
					data.title = e.detail.text;
					postDisplay();
				}}
			>
				{data.title}
			</div>
		</button>
		{#if chosen}
			<div transition:slide|local={{ axis: 'x' }}>
				<button class="flex h-full w-full flex-none items-center whitespace-nowrap pl-1">
					<ScreenMore onDelete={() => onDelete(data.id)} />
				</button>
			</div>
		{/if}
	</div>
</div>
