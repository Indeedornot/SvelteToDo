<script lang="ts">
	import { Dropdown } from '$components/Icons';
	import { capitalizeStart } from '$lib/helpers';
	import { blurClick } from '$lib/helpers/button/blurClick';
	import { clickOutside } from '$lib/helpers/clickOutside.js';
	import { createDropdown } from '$lib/helpers/dropdownCtor';
	import { slide } from '$lib/helpers/slideAnim';
	import { statusType, statusTypeDisplay } from '$lib/models/TodoData';

	const { popperRef, popperContent, extraOpts } = createDropdown({
		placement: 'bottom-start',
		strategy: 'absolute',
		offset: [-1, 2],
		fallbackPlacements: []
	});

	const closeTooltip = () => (showTooltip = false);
	const toggleTooltip = () => (showTooltip = !showTooltip);
	let buttonRef: HTMLElement;

	export let onChoose: (status: statusType) => void;
	export let status: statusType;

	export let canShow: boolean;
	let showTooltip = false;
	const setStatus = (newStatus: statusType) => {
		closeTooltip();
		status = newStatus;
		onChoose && onChoose(newStatus);
	};

	$: if (!canShow) showTooltip = false;
</script>

<button
	use:popperRef
	use:blurClick={showTooltip}
	on:click={toggleTooltip}
	bind:this={buttonRef}
	class="flex h-full w-full flex-none items-center whitespace-nowrap 
	rounded px-1 
	hover:bg-neutral-emphasis hover:text-default 
	focus:bg-neutral-muted focus:text-default"
>
	<span class="pr-1">{statusTypeDisplay[status]}</span>
	<Dropdown size={16} />
</button>
<div class="relative">
	{#if showTooltip}
		<div
			use:popperContent={extraOpts}
			in:slide={{ duration: 300, axis: 'y', z: 1 }}
			use:clickOutside={[buttonRef]}
			on:clickOutside={closeTooltip}
			class="tooltip rounded-md border 
			border-muted bg-subtle text-[14px] text-default 
			shadow-ambient child-hover:bg-neutral-subtle"
		>
			{#each Object.entries(statusType) as [_, value]}
				<button on:click={() => setStatus(value)}>{statusTypeDisplay[value]}</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.tooltip > * {
		text-align: left;
		display: block;
		margin: 0px;
		padding: 5px 14px;
		width: 100%;
	}
</style>
