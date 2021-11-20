<script lang="ts">
  export let filled: Boolean = false;
  export let size = "1em";
  export let strokeWidth = "2";
  export let d = "";
</script>

{#if d.length > 0}
  <svg
    on:click
    class="icon clickable"
    class:icon-filled={filled}
    viewBox="0 0 512 512"
    preserveAspectRatio="xMidYMid meet"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      {d}
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
{/if}

<style>
  .icon {
    position: relative;
    display: inline-block;
    color: var(--default-letter);
    fill: var(--default-letter);
    stroke: var(--default-letter);
  }
  .icon:hover,
  .icon-filled {
    color: var(--matched-letter);
    fill: var(--matched-letter);
    stroke: var(--matched-letter);
  }
</style>
