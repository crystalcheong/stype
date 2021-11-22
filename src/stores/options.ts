import { writable } from "svelte/store";
import { TypeSession } from "./index";

let activeId = TypeSession.activeId;

const keyBehaviour = `${activeId}-behaviour`;
let TEST_DIFFICULTY_LEVELS: string[] = ["normal", "expert", "master"];

const behaviour = writable(
  JSON.parse(localStorage.getItem(keyBehaviour)) || {
    testDifficulty: {
      currentLevel: 0,
      levels: TEST_DIFFICULTY_LEVELS,
    },
  }
);
behaviour.subscribe((i) =>
  localStorage.setItem(keyBehaviour, JSON.stringify(i))
);

const keyTheme = `${activeId}-theme`;
let THEME_LIST: string[] = ["light", "dark"];

const theme = writable(
  JSON.parse(localStorage.getItem(keyTheme)) || {
    currentTheme: "dark",
    themes: THEME_LIST,

    modalBlur: false,
  }
);
theme.subscribe((i) => localStorage.setItem(keyTheme, JSON.stringify(i)));

const keyMode = `${activeId}-mode`;
let TIMER_MODE_DURATION: number[] = [15, 30, 60, 120];

const mode = writable(
  JSON.parse(localStorage.getItem(keyMode)) || {
    timerMode: {
      currentDuration: 15,
      durations: TIMER_MODE_DURATION,
    },
  }
);
mode.subscribe((i) => localStorage.setItem(keyMode, JSON.stringify(i)));

export default { behaviour, theme, mode };
