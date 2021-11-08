<script lang="ts" context="module">
  import { Stores } from "../data";

  let theme = Stores.theme;

  let themes = [
    { name: "System", value: "system" },
    { name: "Light", value: "light" },
    { name: "Dark", value: "dark" },
  ];
</script>

<select bind:value={$theme}>
  {#each themes as { name, value }, id}
    <option {value}>{name}</option>
  {/each}
</select>
