<script lang="ts">
  import { onMount, afterUpdate, tick } from "svelte";
  import { ThemeStore, Options } from "./stores";
  import ThemeSwitcher from "./components/ThemeSwitcher.svelte";
  import TypeTest from "./components/TypeTest.svelte";

  let theme = ThemeStore.theme;

  const themeClass = (node, themeClass) => {
    window.document.body.className = $theme == "system" ? "default" : $theme;
    return {
      update(themeClass) {
        window.document.body.className =
          $theme == "system" ? "default" : $theme;
      },
    };
  };

  let duration = Options.duration;
  let timerModeDuration: number[] = [15, 30, 60, 120];

  // onMount(async () => {});
</script>

<svelte:head>
  <meta name="color-scheme" content={$theme == "system" ? "default" : $theme} />
</svelte:head>

<svelte:body use:themeClass={$theme} />

<nav>
  <div class="branding">
    <h1 class="brand-name">stype</h1>
  </div>

  <div class="options">
    <div class="countdown-duration">
      {#each timerModeDuration as time, id}
        <p
          class:match={$duration === time}
          on:click={() => {
            duration.update((d) => (d = timerModeDuration[id]));
          }}
        >
          {time}
        </p>
      {/each}
    </div>
  </div>
</nav>

<main>
  <TypeTest />
</main>

<footer>
  <ThemeSwitcher />
</footer>

<style>
  nav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    align-content: center;

    padding: 2vh 0 1vh;
    flex: 0.1;
  }

  nav > * {
    border: 0.1px solid red;
  }

  footer {
    padding: 2vh 0 1vh;
  }

  .branding {
    /* border: 0.1px solid green; */
    font-size: 2rem;
    text-align: center;
  }

  .brand-name {
    font-weight: 600;
    color: var(--primary-color);
  }

  .countdown-duration {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    align-content: center;
    gap: 0.3em;

    font-size: 0.7rem;
    color: var(--default-letter);
  }

  .match {
    color: var(--matched-letter) !important;

    filter: brightness(2.5);
  }
</style>
