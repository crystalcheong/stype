<script lang="ts">
  import { TypeSession } from "../stores";
  import { IconsData } from "../data";
  import Icon from "./Icon.svelte";

  let typeSession = TypeSession.instance;
  let typeHistory = $typeSession.history;
  let typeStats = typeHistory[typeHistory.length - 1];
</script>

{#if typeStats}
  <section class="type-result">
    <div class="main-stats">
      <div class="stat-group">
        <h3 class="stat-title md-stat">wpm</h3>
        <p class="stat-value xl-stat">{Math.round(typeStats.rawWPM)}</p>
      </div>
      <div class="stat-group">
        <h3 class="stat-title md-stat">acc</h3>
        <p class="stat-value xl-stat">{Math.round(typeStats.accuracy)}%</p>
      </div>
    </div>
    <div class="visual-stats">Visual</div>
    <div class="misc-stats">
      <div class="stat-group">
        <h3 class="stat-title">test type</h3>
        <p class="stat-value">{typeStats.testMode.mode}</p>
        <p class="stat-value">{typeStats.testMode.language}</p>
      </div>

      <div class="stat-group">
        <h3 class="stat-title">characters</h3>
        <p class="stat-value md-stat">
          {typeStats.characters.match}/{typeStats.characters.mismatch}
        </p>
      </div>

      <div class="stat-group">
        <h3 class="stat-title">time</h3>
        <p class="stat-value md-stat">
          {typeStats.testMode.mode.split(" ")[1]}s
        </p>
        <p class="stat-title sm-stat">
          {typeStats.testMode.duration}&nbsp; session
        </p>
      </div>
    </div>
    <div class="stats-options">
      <Icon
        {...{
          filled: false,
          size: "1.2em",
          strokeWidth: "30",
          d: IconsData.chevron_right,
        }}
        on:click={() => {
          $typeSession.testActive = true;
        }}
      />
    </div>
  </section>
{/if}

<style>
  .type-result {
    /* border: 0.1px solid red; */

    flex: 0.8;
    width: 100%;
    /* display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    align-content: center; */
    gap: 0.5em;

    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  /* .type-result > * {
    border: 0.1px solid blue;
  } */
  .type-result > * > * {
    /* border: 0.1px solid green; */

    flex: 1;
    /* width: 100%; */
  }

  .main-stats {
    grid-row: span 1 / span 4;

    display: inline-flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: center;

    align-items: center;
  }

  .visual-stats {
    grid-column: span 2 / span 3;
    grid-row: span 1 / span 4;

    display: none;
  }

  .misc-stats,
  .stats-options {
    grid-column: span 3 / span 3;

    display: inline-flex;
    flex-direction: row;
    justify-content: flex-start;
    /* align-items: center; */
    align-items: flex-start;
    align-content: center;
    gap: 0.5em;
  }

  .stats-options {
    justify-content: center;
    align-items: flex-start;
  }

  .main-stats > * {
    width: 100%;
  }
  .misc-stats > * {
    height: 100%;
  }

  .stat-group {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: start;
    align-content: center;
    gap: 0.5em;
  }

  .stat-title {
    /* border: 0.1px solid green; */
    font-size: 1rem;
    /* line-height: 1.5; */
    color: var(--accent-color);
  }

  .stat-value {
    /* border: 0.1px solid yellow; */
    font-size: 1rem;
    color: var(--primary-color);
  }

  .sm-stat {
    font-size: 0.75rem !important;
  }

  .md-stat {
    font-size: 2rem !important;
  }

  .xl-stat {
    font-size: 4rem !important;
  }

  /* Medium devices (landscape tablets, 768px and up) */
  /* @media only screen and (max-width: 768px) { */
  .type-result {
    /* background: palegreen; */
    flex: 1;
    /* gap: .5em; */
  }

  .main-stats {
    grid-column: span 3 / span 3;
    grid-row: span 1 / span 5;

    flex-direction: row;
    justify-content: center;
  }

  .visual-stats,
  .misc-stats {
    grid-column: span 3 / span 3;
    /* grid-row: span 2 / span 5; */
  }

  .stats-options{
    grid-row: span 2 / span 5;
  }

  .stat-group {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
  }

  .misc-stats > .stat-group:first-of-type{
    align-items: flex-start;
  }
  .misc-stats > .stat-group:last-of-type{
    align-items: flex-end;
  }
  
  /* } */

  /* Extra small devices (phones, 600px and down) */
  @media only screen and (max-width: 600px) {
    .type-result {
      background: paleturquoise;
    }

    .sm-stat {
      font-size: 0.5rem !important;
    }

    .md-stat {
      font-size: 1rem !important;
    }

    .xl-stat {
      font-size: 3rem !important;
    }
  }
</style>
