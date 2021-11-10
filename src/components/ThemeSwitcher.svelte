<script lang="ts" context="module">
  import { ThemeStore } from "../stores";

  let theme = ThemeStore.theme;

  let themes = [
    { name: "System", value: "system" },
    { name: "Light", value: "light" },
    { name: "Dark", value: "default" },
  ];
  
</script>

<select bind:value={$theme}>
  {#each themes as { name, value }, id}
    <option {value}>{name}</option>
  {/each}
</select>
