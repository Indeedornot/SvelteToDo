<script>
  export let status = 'Draft';
  export let title = 'ReactMailing';
</script>

<div class="bg-secondary w-full h-[66px] pt-[8px] pb-[12px] px-[12px] rounded-lg">
  <div class="text-font-secondary flex items-center h-[24px] text-[12px]">
    {status}
  </div>
  <div class="text-font-primary text-[14px] flex items-center">
    <span class="truncate">{title}</span>
  </div>
</div>