<script lang="ts">
	import { Delete, More } from '$components/Icons';
	import { clickOutside } from '$lib/helpers/clickOutside';
	import { slide } from '$lib/helpers/slideAnim';
	import { createPopperActions } from 'svelte-popperjs';

	//#region Popper
	const [popperRef, popperContent] = createPopperActions({
		placement: 'bottom-end',
		strategy: 'absolute'
	});
	const extraOpts = {
		modifiers: [
			{
				name: 'offset',
				options: { offset: [0, -3] }
			},
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
	//#endregion

	export let onDelete: () => void;

	const onDel = () => {
		closeTooltip();
		onDelete();
	};

	let showTooltip = false;
</script>

<button
	use:popperRef
	on:click={toggleTooltip}
	use:clickOutside
	on:clickoutside={closeTooltip}
	class="flex flex-none items-center whitespace-nowrap"
>
	<More size={16} />
</button>
<div class="relative">
	{#if showTooltip}
		<div
			use:popperContent={extraOpts}
			in:slide={{ duration: 300, axis: 'y' }}
			out:slide={{ duration: 300, axis: 'y' }}
			class="tooltip z-[1] rounded-md border border-accent bg-secondary text-[12px] text-font-primary child-hover:bg-accent"
		>
			<button class="flex items-center justify-center" on:click={onDel}>
				<Delete size={12} class="inline-block" />
				<span class="pb-[2px] pl-[2px]">Delete</span>
			</button>
		</div>
	{/if}
</div>

<!--
{#if showTooltip}
	<div
		use:popperContent={extraOpts}
		class="tooltip rounded-md border border-accent bg-secondary text-[12px] text-font-primary child-hover:bg-accent"
	>
		{#each statuses as stat}
			<button on:click={() => setStatus(stat)}>{stat}</button>
		{/each}
		<!--    <div id="arrow" data-popper-arrow /> -- >
	</div>
{/if}
-->
<style>
	.tooltip > * {
		text-align: left;
		margin: 0px;
		padding: 4px 12px 4px 12px;
		width: 100%;
	}
</style>
