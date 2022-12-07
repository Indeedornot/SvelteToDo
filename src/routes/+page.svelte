<script lang="ts">
	import { DesyncModal, TodoScreen } from '$components/Todo';
	import type { TodoDisplayData } from '$lib/models/TodoData';
	import { isSynced } from '$lib/stores/Sync';

	import type { PageData } from './$types';

	export let data: PageData;

	let todoData: TodoDisplayData[] = data.todos;
</script>

<div class="h-full w-full">
	<TodoScreen data={todoData} />
	<DesyncModal isSynced={$isSynced} />
</div>
