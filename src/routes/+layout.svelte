<script>
	import '../app.css';
	import '$lib/styles/Scrollbar.css';
</script>

<div class="flex h-screen w-screen flex-none flex-col">
	<div class=" h-[66px] flex-none bg-secondary" />

	<div class="min-h-0 w-full flex-grow">
		<slot />
	</div>
</div>
