<script lang="ts">
  import { onMount, onDestroy, tick } from "svelte";
  import { OptionStore, TypeSession } from "./stores";
  import { IconsData } from "./data";
  import ThemeSwitcher from "./components/ThemeSwitcher.svelte";
  import TypeTest from "./components/TypeTest.svelte";
  import TypeResult from "./components/TypeResult.svelte";
  import Icon from "./components/Icon.svelte";
  import PackageJson from "../package.json";

  let themeOptions = OptionStore.theme;
  let theme: string;
  var themeList: string[] = [];
  const subscribeTheme = themeOptions.subscribe((t) => {
    theme = t.currentTheme;
    themeList = t.themes;
  });

  // Apply current theme to DOM
  function themeClass(node, themeClass) {
    window.document.body.className = theme == "system" ? "default" : theme;
    return {
      update(themeClass) {
        window.document.body.className = theme == "system" ? "default" : theme;
      },
    };
  }

  let modeOptions = OptionStore.mode;
  let currentDuration: number;
  let timerModeDuration: number[];
  const subscribeMode = modeOptions.subscribe((m) => {
    currentDuration = m.timerMode.currentDuration;
    timerModeDuration = m.timerMode.durations;
  });
  const updateMode = (newDuration) =>
    modeOptions.update((m) => {
      const mode = {
        ...m,
        timerMode: { ...m.timerMode, currentDuration: newDuration },
      };
      return mode;
    });

  let typeSession = TypeSession.instance;

  // let behaviourOptions = OptionStore.behaviour;
  // let testDifficultyLevels = $behaviourOptions.testDifficulty.levels;
  // let currentTestDifficulty = $behaviourOptions.testDifficulty.currentLevel;

  onDestroy(() => {
    subscribeTheme();
    subscribeMode();
  });
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
          class:brand-name={+currentDuration === time}
          on:click={() => updateMode(timerModeDuration[id])}
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

<div class="key-tips">
  <p><span class="key">Tab</span>&nbsp;&nbsp;-&nbsp;&nbsp;Restart Test</p>
</div>

<footer>
  <a
    href="https://github.com/crystalcheong/stype"
    target="_blank"
    rel="noopener"
    class="clickable"
  >
    <Icon
      {...{
        alt: true,
        d: IconsData.github,
      }}
    />&nbsp;Github</a
  >

  <aside class="right-links">
    <ThemeSwitcher />

    <p class="app-version clickable">
      <Icon
        {...{
          alt: true,
          d: IconsData.code_merge,
        }}
      />&nbsp;{PackageJson.version}
    </p>
  </aside>
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
    height: 100%;
  }

  footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    gap: 1em;

    padding: 2vh 0 3vh;
    color: var(--primary-color);
    font-size: 1em;
    /* border-top: .1px solid var(--accent-color); */
  }

  .key-tips {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-content: center;
    gap: 0.5em;

    font-size: 0.8rem;
    font-weight: bold;
    color: var(--default-letter);
  }

  .key {
    color: var(--background-color);
    background-color: var(--default-letter);
    padding: 0.2rem 0.3rem;
    border-radius: 0.3rem;
    display: inline-block;
    vertical-align: middle;
    line-height: 0.7rem;
  }

  .right-links {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    gap: 1em;
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

  .options {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    align-content: center;
  }

  .countdown-duration {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    align-content: center;
    gap: 0.5em;

    font-size: 0.8rem;
    font-weight: bold;
    color: var(--default-letter);
  }
</style>
