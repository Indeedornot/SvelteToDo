<script type="ts">
	import { Warning } from '$components/Icons';
	import { delayEnabled } from '$lib/helpers/button/delayEnabled';
	import type { SyncData } from '$lib/stores/Sync';

	export let isSynced: SyncData;
	let closed = false;

	const close = () => {
		closed = true;
	};

	let isDesynced = !isSynced.isSync && !closed;
	$: isDesynced = !isSynced.isSync && !closed;
</script>

<button
	class="fixed inset-0 cursor-default bg-[#000000] opacity-70"
	class:hidden={!isDesynced}
	class:flex={isDesynced}
	use:delayEnabled={4000}
	disabled={true}
	on:click={close}
/>

<div
	class="absolute top-1/2 left-1/2 
	flex h-full
	w-full max-w-[415px] flex-none 
	-translate-x-1/2 -translate-y-1/2 
	items-center justify-center overflow-y-auto 
	overflow-x-hidden"
	class:hidden={!isDesynced}
	class:flex={isDesynced}
>
	<div class="relative flex h-auto w-full flex-col border-y-4 border-muted bg-default md:rounded-md md:border-x-4">
		<div class="flex items-center justify-center pb-2.5 pt-2">
			<h3 class="font-medium leading-snug tracking-wider text-default sm:text-3xl md:text-4xl">Ooops!</h3>
			<div class="ml-2 inline-flex flex-none items-center justify-center pt-1 text-default">
				<Warning size={32} />
			</div>
		</div>
		<div class="relative flex-auto bg-neutral-subtle py-2 pb-3 text-justify sm:px-[16px] xs:px-[12px] md:px-[24px]">
			<p class="my-4 text-lg leading-relaxed tracking-wide text-muted">
				We're sorry. Due to an unexpected error, we were unable to sync your data. Please restart the site.
				<br /> <br />
				Should the problem persist, please create a ticket at
				<a href="https://github.com/Indeedornot/SvelteToDo" class="text-default hover:underline">SvelteTodo Repo</a>
				{#if !isSynced.isSync}
					<details class="pt-2" open>
						<summary> Error info </summary>
						<p class="pl-5 text-[14px]">{isSynced.error}</p>
					</details>
				{/if}
			</p>
		</div>
		<div class="flex items-center justify-center px-2 pt-2.5 pb-0.5">
			<button
				class="text-md shadow hover:shadow-lg mb-1 flex flex-none items-center
					justify-center rounded bg-subtle px-10 py-2 text-[18px] font-semibold uppercase tracking-widest text-default
					outline-none transition-all duration-150 ease-linear hover:bg-default hover:bg-opacity-75 focus:outline-none active:bg-default"
				type="button"
				on:click={() => window.location.reload()}
			>
				Restart
			</button>
		</div>
	</div>
</div>
