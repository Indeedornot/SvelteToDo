<script lang="ts">
	import { clickOutside } from '$lib/helpers/clickOutside.js';
	import IoMdArrowDropdown from 'svelte-icons/io/IoMdArrowDropdown.svelte';
	import { createPopperActions } from 'svelte-popperjs';

	const [popperRef, popperContent] = createPopperActions({
		placement: 'bottom',
		strategy: 'fixed'
	});
	const extraOpts = {
		modifiers: [{ name: 'offset', options: { offset: [0, 2] } }]
	};
	const closeTooltip = () => {
		showTooltip = false;
	};
	const openTooltip = () => {
		showTooltip = true;
	};
	const toggleTooltip = () => {
		showTooltip = !showTooltip;
	};

	export let onChoose: (status: string) => void;
	export let status = '';

	let showTooltip = false;
	let statuses = ['Draft', 'Completed', 'In Progress', 'Archived', 'Abandoned'];
	const setStatus = (newStatus: string) => {
		status = newStatus;
		onChoose && onChoose(newStatus);
	};
</script>

<button
	use:popperRef
	on:click={toggleTooltip}
	use:clickOutside
	on:clickoutside={closeTooltip}
	class="flex h-full items-center"
>
	{status}
	<IoMdArrowDropdown />
</button>
{#if showTooltip}
	<div
		use:popperContent={extraOpts}
		class="tooltip rounded-md border border-accent bg-secondary text-[12px] text-font-primary child-hover:bg-accent"
	>
		{#each statuses as stat}
			<button on:click={() => setStatus(stat)}>{stat}</button>
		{/each}
		<!--    <div id="arrow" data-popper-arrow />-->
	</div>
{/if}

<style>
	.tooltip > * {
		text-align: left;
		display: block;
		margin: 0px;
		padding: 4px 16px 4px 16px;
		width: 100%;
	}
</style>
