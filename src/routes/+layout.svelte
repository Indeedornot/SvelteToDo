<script>
	import '../app.css';
	import '$lib/styles/Scrollbar.css';
</script>

<div class="flex h-full w-full flex-none flex-col">
	<div class=" h-[66px] flex-none bg-secondary" />

	<div class="flex min-h-0 w-full flex-grow">
		<slot />
	</div>
</div>
