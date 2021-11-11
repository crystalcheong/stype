<script lang="ts">
  import { onMount, afterUpdate, tick } from "svelte";
  import { WordsData } from "../data";
  import { CountdownTimer, Options } from "../stores";

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
  const viewWidthBuffer = 0.85;

  let duration = Options.duration;
  let countdown: number = $duration;
  let timer = CountdownTimer.createTimer(countdown);
  let time = CountdownTimer.time;
  let timerIsRunning = CountdownTimer.isRunning;
  let timerIsComplete = CountdownTimer.isComplete;

  let netWPM: number = 0;

  const generateWords: Function = () =>
    WordsData.words.sort(() => Math.random() - 0.5);
  const generateMoreWords: Function = async () => {
    let moreWords = [
      ...words,
      ...WordsData.words.sort(() => Math.random() - 0.5),
    ];
    words = moreWords;
    await tick();
  };
  const updateTimer: Function = async () => {
    timer = CountdownTimer.createTimer(countdown);
    time = CountdownTimer.time;
    timer.reset();
    await tick();
  };
  const scrollLine = async (nextLine) => {
    if (!viewport) return;
    const { scrollTop, scrollHeight } = viewport;

    viewport.scrollTo({
      left: 0,
      top: nextLine ? scrollTop + 36 : scrollTop - 36,
      behavior: "smooth",
    });

    lineWidth = 0;
  };

  $:if($duration != countdown){
    console.log(`TYPE TEST: ${$duration}`);
    countdown = $duration;
  }
  $: countdown, updateTimer();
  $: activeIdx, (activeWord = words[activeIdx]);
  $: lineWidth,
    (viewNextLine = lineWidth >= viewWidth * viewWidthBuffer ? true : false);
  $: if (viewNextLine) scrollLine(viewNextLine);

  $: if ($timerIsComplete) {
    console.log(`TIMER ENDED`);

    if (typedWord.length > 0 && !$timerIsRunning) {
      typeHistory.push(typedWord + overflowWord);
    }

    let totalChars = 0;
    let totalMatchChars = 0;
    let totalMismatchChars = 0;
    let accuracy = 0;

    typeHistory.forEach((word, idx) => {
      totalChars += word.length;

      let actualWord = words[idx];
      let typed = "";
      let overflow = "";

      if (word.length > 0) {
        if (word.length > actualWord.length) {
          overflow = word.substring(actualWord.length);
          typed = word.slice(0, -overflow.length);
        } else {
          typed = word;
        }

        [...actualWord].forEach((char, id) => {
          if (char === typed[id]) {
            totalMatchChars += 1;
          } else {
            totalMismatchChars += 1;
          }
        });
        totalMismatchChars += overflow.length;
      } else {
        totalMismatchChars += actualWord.length;
      }
    });

    netWPM = totalChars / 5 / (countdown / 60);
    accuracy = (totalMatchChars / totalChars) * 100;

    console.log({
      totalChars: totalChars,
      totalSeconds: countdown,
      totalMinutes: countdown / 60,
      netWPM: netWPM,
      accuracy: accuracy,
    });
  }

  function newTest() {
    words = generateWords();
    activeIdx = activeWidth = lineWidth = 0;
    activeWord = words[activeIdx];
    typeHistory = [];
    resetFields();

    timer.reset();
    console.log(words);
  }

  function resetFields() {
    activeElement = null;
    activeWidth = 0;
    typedWord = overflowWord = "";
  }

  async function handleKeydown(e) {
    key = e.key;
    let keyCode = e.keyCode;

    let ignoredKeyCodes = [13, 16, 17, 18, 20, 27, 37, 38, 39, 40, 45, 46, 220];
    if (
      ignoredKeyCodes.includes(keyCode) ||
      (e.ctrlKey && e.keyCode == 82) ||
      e.metaKey
    )
      return;

    e.preventDefault();

    // TAB [9] - Restart
    if (keyCode === 9) {
      newTest();
      return;
    }

    if (
      !$timerIsRunning &&
      key &&
      typeHistory.length == 0 &&
      typedWord.length == 0
    ) {
      timer.start();
    }

    // ACCEPTABLE TEST INPUTS
    if ($timerIsRunning && !$timerIsComplete) {
      // SPACE [32] - Next word
      if (keyCode === 32) {
        if (activeIdx === words.length - 1) generateMoreWords();

        typeHistory.push(typedWord + overflowWord);

        activeElement = document.querySelector(".activeWord");
        activeWidth = activeElement.offsetWidth;
        lineWidth += activeWidth;

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

          if (
            lineWidth * viewWidthBuffer <= 0 ||
            lineWidth < viewWidth * (1 - viewWidthBuffer)
          ) {
            scrollLine(viewNextLine);
          }
        }
      }
      // REST OF KEYS
      else {
        if (typedWord.length < activeWord.length) {
          typedWord += key;
        } else if (
          typedWord.length >= activeWord.length &&
          overflowWord.length <= 10
        ) {
          overflowWord += key;
        }
      }
    }
  }

  onMount(async () => {
    newTest();
  });

  afterUpdate(async () => {
    // console.log({
    //   typedWord: typedWord,
    //   overflowWord: overflowWord,
    //   typeHistory: typeHistory,
    //   activeIdx: activeIdx,
    //   activeWord: activeWord,
    //   viewNextLine: viewNextLine,
    //   activeWidth: activeWidth,
    //   lineWidth: lineWidth,
    // });
  });
</script>

<svelte:window on:keydown={handleKeydown} />

{#if timer}
  <div class="timer">
    <h2>
      <!-- {$time} -->
      {+$time.split(":").reduce((acc, time) => `${60 * +acc + +time}`)}
    </h2>

    <!-- {#if !$timerIsComplete}
  {#if $timerIsRunning}
    <button on:click={() => timer.pause()}>pause</button>
    <button on:click={() => timer.reset()}>reset</button>
  {:else}
    <button on:click={() => timer.start()}>start</button>
  {/if}
{/if} -->
  </div>
{/if}

<section class="type-test" bind:this={viewport} bind:offsetWidth={viewWidth}>
  {#each words as word, idx}
    <p class:activeWord={idx === activeIdx}>
      {#each word as char, id}
        {#if idx === activeIdx && id === typedWord.length}
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

<style>
  .timer {
    /* border: 0.1px solid red; */
    width: 100%;
    color: var(--primary-color);
    font-size: 1.5rem;
    font-weight: 600;
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

    filter: brightness(2.5);
  }

  .mismatch {
    color: var(--mismatched-letter) !important;
    text-decoration-color: var(--mismatched-letter) !important;
    filter: brightness(2.5);
  }

  .overflow {
    font-weight: lighter !important;
  }
</style>
