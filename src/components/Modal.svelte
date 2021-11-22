<script lang="ts">
  import { onDestroy } from "svelte";
  import { OptionStore } from "../stores";

  let themeOptions = OptionStore.theme;
  let showModal: Boolean = false;

  const subscribeTheme = themeOptions.subscribe((t) => {
    showModal = t.modalBlur;
  });

  const updateTheme = () =>
    themeOptions.update((to) => {
      const theme = { ...to, modalBlur: showModal };
      return theme;
    });

  function keydownModal(event) {
    event.stopPropagation();

    if (event.key == "Escape") closeModal();
  }
  export function openModal() {
    showModal = true;
    updateTheme();
  }

  function closeModal() {
    showModal = false;
    updateTheme();
  }

  onDestroy(() => {
    subscribeTheme();
  });
</script>

{#if showModal}
  <section
    class="modal-backdrop"
    on:click|self={closeModal}
    on:keydown={keydownModal}
    tabindex={0}
  >
    <div class="modal-content">
      <slot name="content">
        <span class="missing">🎉 Here's a popup!🍾</span>
      </slot>
    </div>
  </section>
{/if}

<style>
  .modal-backdrop {
    /* border: 0.1px solid red; */

    height: 100vh;
    width: 100vw;
    min-width: 100vw !important;
    max-width: 100vw !important;
    min-height: 100vh !important;
    max-height: 100vh !important;

    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    z-index: 40;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    place-content: center;

    background: transparent;
    background: rgba(0, 0, 0, 0.5);
  }

  .modal-content {
    border: 0.1px solid green;
    background: palegoldenrod;
    /* flex: 0.8; */
    width: 70%;
    border-radius: 1rem;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    place-content: center;

    overflow-y: scroll;
    position: relative;
    z-index: 50;
  }

  .modal-content > * {
    border: 0.1px solid blue;
  }
</style>
