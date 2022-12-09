<script lang="ts">
	import { maxLength, singleLine, stopTyping, truncateEditable } from '$lib/helpers/contentEditable';
	import { TodoDisplayConstr } from '$lib/models/TodoDataConstr';
	import '$lib/styles/Scrollbar.css';

	export let onStopTyping: () => void;
	export let title: string;
</script>

<div
	class="header bg-primary flex h-[103px] w-full flex-none items-center text-[20px] sm:pl-[12px] md:pl-[20px] lg:pl-[28px]"
>
	<div
		class="single-line content-editable hover:bg-secondary focus:bg-secondary text-ellipsis rounded py-[16px] pl-[4px] pr-[24px] transition-colors duration-200 ease-linear"
		contenteditable="true"
		spellcheck="false"
		use:stopTyping
		on:stopTyping={(event) => {
			title = event.detail.text;
			onStopTyping();
		}}
		use:singleLine
		use:maxLength={{ maxLength: TodoDisplayConstr.title.maxLength, value: title }}
		use:truncateEditable
	/>
</div>
