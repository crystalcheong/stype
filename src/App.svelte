<script lang="ts">
  import { onMount, afterUpdate, tick } from "svelte";
  import { WordsData } from "./data";

  let key: string = "";
  let words: string[] = [];
  let activeIdx: number = 0;
  let activeWord: string = "";
  let typedWord: string = "";
  let overflowWord: string = "";
  let typeHistory: string[] = [];

  let viewport, activeElement;
  let viewWidth: number = 0;
  let activeWidth: number = 0;
  let lineWidth: number = 0;
  let viewNextLine: boolean = false;

  $: activeIdx, (activeWord = words[activeIdx]);
  $: lineWidth, (viewNextLine = lineWidth > viewWidth ? true : false);
  $: if (viewNextLine) scrollLine(viewNextLine);

  function generateWords() {
    words = WordsData.words.sort(() => Math.random() - 0.5);
    resetFields();
    activeIdx = activeWidth = lineWidth = 0;
    activeWord = words[activeIdx];
    typeHistory = [];

    console.log(words);
  }

  function resetFields() {
    activeWidth = 0;
    typedWord = overflowWord = "";
  }

  function handleKeydown(e) {
    key = e.key;
    let keyCode = e.keyCode;

    let miscKeyCodes = [13, 16, 17, 18, 20, 27, 37, 38, 39, 40, 45, 46, 220];
    if (miscKeyCodes.includes(keyCode) || (e.ctrlKey && e.keyCode == 82) || e.metaKey)
      return;

    e.preventDefault();

    // TAB [9] - Restart
    if (keyCode === 9) {
      generateWords();
    }

    // SPACE [32] - Next word
    else if (keyCode === 32) {
      activeElement = document.querySelector(".activeWord");
      activeWidth = activeElement.offsetWidth;
      lineWidth += activeWidth;

      typeHistory.push(typedWord + overflowWord);
      activeIdx++;
      resetFields();
    }

    // BACKSPACE [8] - Minus 1 character
    else if (keyCode === 8) {
      if (overflowWord.length > 0) {
        overflowWord = overflowWord.slice(0, -1);
      } else if (typedWord.length > 0) {
        typedWord = typedWord.slice(0, -1);
      } else if (typeHistory.length > 0 && typedWord.length == 0) {
        activeIdx--;

        let prevWord = words[activeIdx];
        let prevTyped = typeHistory[typeHistory.length - 1];
        typeHistory.pop();

        if (prevTyped.length > 0) {
          if (prevTyped.length > prevWord.length) {
            overflowWord = prevTyped.substring(prevWord.length);
            typedWord = prevTyped.slice(0, -overflowWord.length);
          } else {
            typedWord = prevWord;
          }
        }

        activeElement = document.querySelector(".activeWord");
        activeWidth = activeElement.offsetWidth;
        lineWidth -= activeWidth;
      }
    }

    // Acceptable inputs
    else {
      if (typedWord.length >= activeWord.length && overflowWord.length <= 10) {
        overflowWord += key;
      } else if (typedWord.length < activeWord.length) {
        typedWord += key;
      }
    }
  }

  async function scrollLine(nextLine) {
    const { scrollTop, scrollHeight } = viewport;

    viewport.scrollTo({
      left: 0,
      top: nextLine ? scrollTop + 35 : scrollTop - 35,
      behavior: "smooth",
    });

    lineWidth = 0;
  }

  onMount(async () => {
    generateWords();
  });

  afterUpdate(async () => {
    console.log({
      typedWord: typedWord,
      overflowWord: overflowWord,
      typeHistory: typeHistory,

      activeIdx: activeIdx,
      activeWord: activeWord,
      viewNextLine: viewNextLine,
      activeWidth: activeWidth,
      lineWidth: lineWidth,
    });
  });
</script>

<svelte:window on:keydown={handleKeydown} />

<nav>
  <div class="branding">
    <h1 class="brand-name">STYPE</h1>
  </div>
</nav>

<main>
  <!-- <p>
    {activeWidth} / {lineWidth} | {viewWidth} [{lineWidth > viewWidth
      ? "true"
      : "false"}]
  </p> -->
  <section class="type-test" bind:this={viewport} bind:offsetWidth={viewWidth}>
    {#each words as word, idx}
      <p class:activeWord={idx === activeIdx}>
        {#each word as char, id}
          {#if (idx === activeIdx && id === typedWord.length)}
            <span class="blinking-cursor">|</span>
          {/if}
          <span
            class:match={(idx === activeIdx &&
              typedWord.length > 0 &&
              id < typedWord.length &&
              typedWord.charAt(id) === word.charAt(id)) ||
              (typeHistory.length > 0 &&
                idx < activeIdx &&
                typeHistory[idx].charAt(id) === word.charAt(id))}
            class:mismatch={(idx === activeIdx &&
              typedWord.length > 0 &&
              id < typedWord.length &&
              typedWord.charAt(id) !== word.charAt(id)) ||
              (typeHistory.length > 0 &&
                idx < activeIdx &&
                typeHistory[idx].charAt(id) !== word.charAt(id))}>{char}</span
          >
        {/each}
        {#if idx === activeIdx && overflowWord.length > 0}
          <span class="mismatch overflow">{overflowWord}</span>
        {/if}
        {#if typeHistory.length > 0 && idx < activeIdx && typeHistory[idx].length > word.length}
          <span class="mismatch overflow"
            >{typeHistory[typeHistory.length - 1].substring(
              words[idx].length
            )}</span
          >
        {/if}
      </p>
      &nbsp;
    {/each}
  </section>
</main>
<!-- <footer>Footer</footer> -->

<style>
  nav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    align-content: center;

    padding: 2vh 0 1vh;
    flex:0.1;
  }

  /* footer {
    padding: 2vh 0 1vh;
  } */

  .branding {
    /* border: 0.1px solid green; */
    font-size: 2rem;
    text-align: center;
  }

  .brand-name {
    font-weight: 600;
    color: var(--primary);
  }

  .type-test {
    /* border: 0.1px solid red; */
    overflow: hidden;
    /* overflow: scroll; */
    height: 7rem;
  }

  .type-test > p {
    /* display: inline-block; */
    display: inline-flex;
    font-size: 1.5em;
    line-height: 1.5;
    word-break: break-word;

    /* border: 0.1px solid red; */
  }

  .type-test > p > span {
    /* display: table-cell; */
    color: var(--default-letter);

    font-weight: 600;
    text-decoration: solid underline transparent 0.1em;
    text-underline-offset: 0.1em;
  }

  .match {
    color: var(--matched-letter) !important;
  }

  .mismatch {
    color: var(--mismatched-letter) !important;
    text-decoration-color: var(--mismatched-letter)!important;
  }

  .overflow{
    font-weight: lighter !important;
  }
</style>
