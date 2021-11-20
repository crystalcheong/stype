<script lang="ts">
  import { onMount, afterUpdate, tick } from "svelte";
  import { OptionStore, TypeSession } from "./stores";
  import ThemeSwitcher from "./components/ThemeSwitcher.svelte";
  import TypeTest from "./components/TypeTest.svelte";
  import TypeResult from "./components/TypeResult.svelte";

  let themeOptions = OptionStore.theme;
  let theme: string = $themeOptions.presets.currentTheme;

  $: $themeOptions.presets.currentTheme,
    (theme = $themeOptions.presets.currentTheme);

  const themeClass = (node, themeClass) => {
    window.document.body.className = theme == "system" ? "default" : theme;
    return {
      update(themeClass) {
        window.document.body.className = theme == "system" ? "default" : theme;
      },
    };
  };

  let modeOptions = OptionStore.mode;
  let currentDuration = $modeOptions.timerMode.currentDuration;
  let timerModeDuration: number[] = $modeOptions.timerMode.durations;

  let behaviourOptions = OptionStore.behaviour;
  let testDifficultyLevels = $behaviourOptions.testDifficulty.levels;
  let currentTestDifficulty = $behaviourOptions.testDifficulty.currentLevel;

  let typeSession = TypeSession.instance;

  // onMount(async () => {});
</script>

<svelte:head>
  <meta name="color-scheme" content={theme == "system" ? "default" : theme} />
</svelte:head>

<svelte:body use:themeClass={theme} />

<nav>
  <div class="branding">
    <h1 class="brand-name clickable">stype</h1>
  </div>

  <div class="options">
    <div class="countdown-duration">
      {#each timerModeDuration as time, id}
        <p
          class="clickable"
          class:match={+currentDuration === time}
          on:click={() => {
            $modeOptions.timerMode.currentDuration = currentDuration =
              timerModeDuration[id];
          }}
        >
          {time}
        </p>
      {/each}
    </div>
  </div>
</nav>

<main>
  <!-- {#each testDifficultyLevels as level, idx}
    <label>
      <input
        type="radio"
        id={String(idx)}
        on:change={() => {
          $behaviourOptions.testDifficulty.currentLevel =
            currentTestDifficulty = idx;
        }}
        checked={currentTestDifficulty === idx}
        value={level}
      />&nbsp;{level}
    </label>
  {/each} -->

  {#if $typeSession.testActive || $typeSession.history.length == 0}
    <TypeTest />
  {:else if !$typeSession.testActive}
    <TypeResult />
  {/if}
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
    /* border: 0.1px solid red; */
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
