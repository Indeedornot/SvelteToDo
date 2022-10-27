<script lang="ts">
  import TodoItem from "./TodoItem.svelte";
  import GoPlus from 'svelte-icons/go/GoPlus.svelte'
  import type {Todo} from "$lib/Todo";

  export let todos: Todo[];
</script>

<div class="bg-primary text-font-primary h-[680px] w-[350px] flex flex-col rounded-md border border-2 border-accent">
  <div class="h-[42px] pt-[8px] px-[12px] pb-[2px] text-[16px] font-bold">
    <div class="flex items-center py-[4px]">
      Todo
    </div>
  </div>
  <div class="todos styled-scrollbar flex-grow px-[10px] pt-[2px]">
    <TodoItem title="Sample Title" status="Draft"/>
    <TodoItem title="Sample Title" status="Draft"/>
    <TodoItem title="Sample Title That Overflows Hopefully Not Yet ASDASD" status="Draft"/>
    <TodoItem title="Sample Title" status="Draft"/>
    <TodoItem title="Sample Title" status="Draft"/>
    <TodoItem title="Sample Title" status="Draft"/>
    <TodoItem title="Sample Title" status="Draft"/>
    <TodoItem title="Sample Title" status="Draft"/>
    <TodoItem title="Sample Title" status="Draft"/>
  </div>
  <button class="h-[42px] py-[12px] px-[6px] flex flex-row items-center text-font-secondary text-[12px]">
    <div class="h-[16px] w-[16px] mr-[8px]">
      <GoPlus></GoPlus>
    </div>
    Add Item
  </button>
</div>

<style>
    .todos {
        overflow-y: auto;
    }

    .todos > :global(*)
    {
        margin-bottom: 8px;
    }

    .styled-scrollbar {
        /* Foreground, Background */
        scrollbar-color: #999 #333;
    }
    .styled-scrollbar::-webkit-scrollbar {
        width: 10px; /* Mostly for vertical scrollbars */
        height: 10px; /* Mostly for horizontal scrollbars */
    }
    .styled-scrollbar::-webkit-scrollbar-thumb { /* Foreground */
        background: #999;
    }
    .styled-scrollbar::-webkit-scrollbar-track { /* Background */
        background: #333;
    }
</style>