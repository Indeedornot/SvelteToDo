<script lang="ts">
	import { browser } from '$app/environment';
	import { DesyncModal, TodoScreen } from '$components/Todo';
	import * as dbCalls from '$lib/apiCalls/TodoActions';
	import type { TodoDisplayCreateData, TodoDisplayData } from '$lib/models/TodoData';
	import { isSynced } from '$lib/stores/Sync';

	import type { PageData } from './$types';

	export const prerender = false;

	export let data: PageData;
</script>

<div class="h-full w-full">
	{#if data.todos}
		<TodoScreen data={data.todos} />
		<DesyncModal isSynced={$isSynced} />
	{/if}
</div>
