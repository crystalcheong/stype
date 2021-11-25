<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { OptionStore } from "../stores";
  import { IconsData } from "../data";
  import Modal from "../components/Modal.svelte";
  import Icon from "./Icon.svelte";

  let themeOptions = OptionStore.theme;
  let themes: string[] = [];
  let currentTheme: string;
  const subscribeTheme = themeOptions.subscribe((t) => {
    currentTheme = t.currentTheme;
    themes = t.themes;
  });
  const updateTheme = () =>
    themeOptions.update((to) => {
      const theme = { ...to, currentTheme: currentTheme };
      return theme;
    });

  let themeModal, showThemeModal;

  onMount(function () {
    showThemeModal = function () {
      themeModal.openModal();
    };
  });

  onDestroy(() => {
    subscribeTheme();
  });
</script>

{#if themeOptions && themes.length > 0}
  <p class="current-theme clickable" on:click|preventDefault={showThemeModal}>
    <Icon
      {...{
        alt: true,
        d: IconsData.palette,
      }}
    />&nbsp;{$themeOptions.currentTheme}
  </p>

  <Modal bind:this={themeModal}>
    <div slot="content" class="theme-list">
      {#each themes as theme}
        <p
          class:selected-theme={theme == currentTheme}
          on:click={() => {
            currentTheme = theme;
            updateTheme();
          }}
        >
          {theme}
        </p>
      {/each}
    </div>
  </Modal>
{/if}

<style>
  .current-theme {
    color: var(--primary-color);
    font-size: 1em;
  }

  .theme-list {
    flex: 1;
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    gap: 1em;

    overflow-y: scroll;
    background: var(--background-color);
    padding: 2% 3%;
  }

  .theme-list > * {
    width: 100%;
  }

  .theme-list > p {
    text-align: center;
    padding: 1% 0;
    font-weight: bold;

    color: var(--default-letter);
  }

  .theme-list > p:hover {
    color: var(--background-color) !important;
    background: var(--accent-color);
  }

  .selected-theme {
    color: var(--background-color) !important;
    background: var(--primary-color);
  }
</style>
