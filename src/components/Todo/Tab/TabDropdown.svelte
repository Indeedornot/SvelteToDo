<script lang="ts">
	import { Delete, More } from '$components/Icons';
	import { blurClick } from '$lib/helpers/button/blurClick';
	import { clickOutside } from '$lib/helpers/clickOutside';
	import { createDropdown } from '$lib/helpers/dropdownCtor';
	import { slide } from '$lib/helpers/slideAnim';

	const { popperRef, popperContent, extraOpts } = createDropdown({
		placement: 'bottom-end',
		strategy: 'absolute',
		offset: [0, 3],
		fallbackPlacements: []
	});

	const closeTooltip = () => (showTooltip = false);
	const toggleTooltip = () => (showTooltip = !showTooltip);
	let buttonRef: HTMLElement;

	export let onDelete: () => void;
	const onDel = () => {
		closeTooltip();
		onDelete();
	};

	let showTooltip = false;
</script>

<button
	use:popperRef
	use:blurClick={showTooltip}
	on:click={toggleTooltip}
	bind:this={buttonRef}
	class="flex h-fit w-fit flex-none items-center 
	justify-center whitespace-nowrap rounded p-1 
	hover:bg-neutral-emphasis hover:text-default 
	focus:bg-neutral-muted focus:text-default"
>
	<More size={16} />
</button>
<div class="relative">
	{#if showTooltip}
		<div
			use:popperContent={extraOpts}
			in:slide={{ duration: 300, axis: 'y' }}
			out:slide={{ duration: 300, axis: 'y' }}
			use:clickOutside={[buttonRef]}
			on:clickOutside={closeTooltip}
			class="tooltip rounded-md border 
			border-muted bg-subtle text-[14px] text-default shadow-ambient child-hover:bg-neutral-subtle"
		>
			<button class="flex items-center justify-center" on:click={onDel}>
				<Delete size={14} class="inline-block" />
				<span class="pb-[2px] pl-[2px]">Delete</span>
			</button>
		</div>
	{/if}
</div>

<style>
	.tooltip > * {
		text-align: left;
		margin: 0px;
		padding: 4px 12px 4px 12px;
		width: 100%;
	}
</style>
