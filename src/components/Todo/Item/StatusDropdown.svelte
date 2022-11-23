<script lang="ts">
	import { ArrowDown, Dropdown } from '$components/Icons';
	import { clickOutside } from '$lib/helpers/clickOutside.js';
	import { slide } from '$lib/helpers/slideAnim';
	import { createPopperActions } from 'svelte-popperjs';

	const [popperRef, popperContent] = createPopperActions({
		placement: 'bottom-start',
		strategy: 'absolute'
	});
	const extraOpts = {
		modifiers: [
			{ name: 'offset', options: { offset: [-4, 2] } },
			{
				name: 'flip',
				options: { fallbackPlacements: [] }
			}
		]
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
		closeTooltip();
		status = newStatus;
		onChoose && onChoose(newStatus);
	};
</script>

<button
	use:popperRef
	on:click={toggleTooltip}
	use:clickOutside
	on:clickoutside={closeTooltip}
	class="flex h-full w-full flex-none items-center whitespace-nowrap"
>
	<span class="pr-1">{status}</span>
	<Dropdown size={16} />
</button>
<div class="relative">
	{#if showTooltip}
		<div
			use:popperContent={extraOpts}
			in:slide={{ duration: 300, axis: 'y' }}
			out:slide={{ duration: 300, axis: 'y' }}
			class="tooltip rounded-md border border-accent bg-secondary text-[12px] text-font-primary child-hover:bg-accent"
		>
			{#each statuses as stat}
				<button on:click={() => setStatus(stat)}>{stat}</button>
			{/each}
			<!--    <div id="arrow" data-popper-arrow />-->
		</div>
	{/if}
</div>

<style>
	.tooltip > * {
		text-align: left;
		display: block;
		margin: 0px;
		padding: 4px 16px 4px 16px;
		width: 100%;
	}
</style>
