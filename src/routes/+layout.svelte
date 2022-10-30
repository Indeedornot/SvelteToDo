<script>
	import '../app.css';
</script>

<div class="flex h-full w-full flex-col">
	<div class="header h-[66px] flex-none bg-secondary" />

	<div class="min-h-0 w-full flex-grow">
		<slot />
	</div>
</div>
