<script lang="ts">
	import { stopTyping } from '$lib/helpers/onStopTyping';
	import { TodoTabConstr } from '$lib/models/TodoData';
	import '$lib/styles/Scrollbar.css';

	export let onStopTyping: () => void;
	export let title: string;
</script>

<div
	class="header flex h-[103px] w-full flex-none items-center bg-primary text-[20px] sm:pl-[12px] md:pl-[20px] lg:pl-[28px]"
>
	<textarea
		contenteditable="true"
		class="stylelessTextArea overflow-hidden truncate whitespace-nowrap rounded py-[16px] pl-[4px] pr-[24px] transition-colors duration-200 ease-linear hover:bg-secondary focus:bg-secondary"
		maxlength={TodoTabConstr.title.maxlength}
		bind:value={title}
		use:stopTyping
		on:stopTyping={onStopTyping}
		rows="1"
	/>
</div>
