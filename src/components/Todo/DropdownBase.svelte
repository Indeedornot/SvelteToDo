<script lang="ts">
	import { type DropdownProps, clickOutside, createDropdown } from '$lib/helpers';

	export let options: DropdownProps;
	export let canShow: boolean = true;
	export let showTooltip: boolean;
	export let zIndex: number = 0;
	$: if (!canShow && showTooltip) {
		showTooltip = false;
	}

	let buttonRef: HTMLElement;
	const { popperRef, popperContent, extraOpts } = createDropdown(options);
</script>

<div bind:this={buttonRef} use:popperRef>
	<slot name="button" />
</div>
{#if showTooltip}
	<div
		use:popperContent={extraOpts}
		use:clickOutside={[buttonRef]}
		on:clickOutside={() => (showTooltip = false)}
		style:z-index={zIndex}
	>
		<slot name="dropdown" />
	</div>
{/if}
