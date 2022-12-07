<script lang="ts">
	import { Delete } from '$components/Icons';

	export let onDelete: () => void;
</script>

<button class="dropdown-item flex items-center justify-center" on:click={onDelete}>
	<Delete size={14} />
	<span class="pl-[4px]">Delete</span>
</button>
