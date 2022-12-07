<script lang="ts">
	import { Delete, More } from '$components/Icons';
	import { blurClick } from '$lib/helpers/button/blurClick';
	import { slide } from '$lib/helpers/slideAnim';

	import DropdownBase from '../DropdownBase.svelte';

	export let canShow: boolean;
	let showTooltip = false;

	export let onDelete: () => void;
	const onDel = () => {
		showTooltip = false;
		onDelete();
	};
</script>

<DropdownBase
	bind:showTooltip={showTooltip}
	canShow={canShow}
	options={{
		placement: 'bottom-start',
		strategy: 'absolute',
		offset: [-30, 0],
		fallbackPlacements: []
	}}
	zIndex={1}
>
	<button
		slot="button"
		use:blurClick={showTooltip}
		on:click={() => (showTooltip = !showTooltip)}
		class="flex flex-none items-center whitespace-nowrap rounded bg-neutral-muted p-[1px] 
	hover:bg-neutral-emphasis hover:text-default focus:text-default"
	>
		<More size={16} />
	</button>

	<div
		slot="dropdown"
		in:slide={{ duration: 300, axis: 'y' }}
		class="tooltip rounded-md 
		border border-muted bg-subtle text-[12px] 
		text-default shadow-ambient 
		child-hover:bg-neutral-subtle"
	>
		<button class="flex items-center justify-center" on:click={onDel}>
			<Delete size={12} class="inline-block" />
			<span class="pb-[2px] pl-[2px]">Delete</span>
		</button>
	</div>
</DropdownBase>

<style>
	.tooltip > * {
		text-align: left;
		margin: 0px;
		padding: 5px 14px;
		width: 100%;
	}
</style>
