<script type="ts">
	import { Warning } from '$components/Icons';
	import { delayEnabled } from '$lib/helpers/button/delayEnabled';

	export let isSynced: boolean;
	let closed = false;

	const close = () => {
		closed = true;
	};

	let isDesynced = !isSynced && !closed;
	$: isDesynced = !isSynced && !closed;
</script>

<div
	class="absolute top-1/2 left-1/2 z-[4] 
	flex h-full max-h-[370px] 
	w-full max-w-[415px] flex-none 
	-translate-x-1/2 -translate-y-1/2 
	items-center justify-center overflow-y-auto 
	overflow-x-hidden"
	class:hidden={!isDesynced}
	class:flex={isDesynced}
>
	<div class="relative flex h-full w-full flex-col border-y-4 border-muted bg-default md:rounded-md md:border-x-4">
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
				<a href="https://github.com/Indeedornot/SvelteToDo" class="text-font-primary hover:underline">SvelteTodo Repo</a
				>
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
<button
	class="fixed inset-0 z-[3] bg-[#000000] opacity-70"
	id="modal-id-backdrop"
	class:hidden={!isDesynced}
	class:flex={isDesynced}
	on:click={close}
	use:delayEnabled={3000}
/>

<!-- 
				<div>We encountered an error while synchronising your data. We're sorry. Please restart the site</div>
			<div class="flex h-fit flex-none items-center justify-end pt-1 pb-[2%] pr-[2%]">
				<button class="rounded-md bg-secondary p-2 hover:bg-accent" on:click={() => window.location.reload()}>
					Restart
				</button>
			</div>
 -->

<!-- 
	<div
	class="fixed inset-0 z-[2] items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none"
	class:hidden={!isDesynced}
	class:flex={isDesynced}
>
	<div class="relative mx-auto max-h-[400px] w-auto max-w-md">
		<div
			class="relative flex h-full w-full flex-col bg-border shadow-lg outline-none focus:outline-none md:rounded-2xl"
		>
			<div class="flex items-center justify-center sm:pb-1 sm:pt-1 md:pt-2 md:pb-2">
				<h3 class="font-semibold leading-snug tracking-wide text-font-primary sm:text-3xl  md:text-4xl">Error!</h3>
			</div>
			<div class="relative flex-auto bg-secondary pb-4 text-justify sm:px-[16px] xs:px-[12px] md:px-[24px]">
				<p class="my-4 text-xl leading-relaxed text-font-secondary ">
					We're sorry. Due to an unexpected error, we were unable to sync your data. Please restart the site.
					<br /> <br />
					Should the problem continue, please create a ticket at
					<a href="https://github.com/Indeedornot/SvelteToDo" class="text-font-primary hover:underline"
						>SvelteTodo Repo</a
					>
				</p>
			</div>
			<div class="flex items-center justify-center px-2 pt-2 pb-1">
				<button
					class="text-md mb-1 flex flex-none items-center justify-center rounded-md 
					bg-secondary px-6 py-3 font-bold uppercase text-font-primary shadow outline-none 
					transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-secondary"
					type="button"
					on:click={close}
				>
					Save Changes
				</button>
			</div>
		</div>
	</div>
</div>
  -->
