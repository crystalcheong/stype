<script lang="ts">
  import { OptionStore } from "../stores";

  let themeOptions = OptionStore.theme;
  let themes = $themeOptions.presets.themes;
</script>

<select bind:value={$themeOptions.presets.currentTheme}>
  {#each themes as theme}
    <option value={theme}>{theme}</option>
  {/each}
</select>
