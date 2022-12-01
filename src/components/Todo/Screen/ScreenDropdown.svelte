<script lang="ts">
	import { Delete, More } from '$components/Icons';
	import { blurClick } from '$lib/helpers/button/blurClick';
	import { clickOutside } from '$lib/helpers/clickOutside';
	import { createDropdown } from '$lib/helpers/dropdownCtor';
	import { slide } from '$lib/helpers/slideAnim';

	const { popperRef, popperContent, extraOpts } = createDropdown({
		placement: 'bottom-start',
		strategy: 'absolute',
		offset: [-30, 0],
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
	class="flex flex-none items-center whitespace-nowrap rounded 
	bg-neutral-muted p-[1px] 
	hover:bg-neutral-emphasis hover:text-default focus:text-default"
>
	<More size={16} />
</button>
{#if showTooltip}
	<div
		use:popperContent={extraOpts}
		in:slide={{ duration: 300, axis: 'y' }}
		out:slide={{ duration: 300, axis: 'y' }}
		class="tooltip z-[1] rounded-md 
		border border-muted bg-subtle text-[12px] 
		text-default shadow-ambient 
		child-hover:bg-neutral-subtle"
		use:clickOutside={[buttonRef]}
		on:clickOutside={closeTooltip}
	>
		<button class="flex items-center justify-center" on:click={onDel}>
			<Delete size={12} class="inline-block" />
			<span class="pb-[2px] pl-[2px]">Delete</span>
		</button>
	</div>
{/if}

<style>
	.tooltip > * {
		text-align: left;
		margin: 0px;
		padding: 5px 14px;
		width: 100%;
	}
</style>
