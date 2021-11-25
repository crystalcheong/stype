import { writable } from "svelte/store";
import { v4 as uuidv4 } from "uuid";

interface TestRecord {
  rawWPM: number;
  accuracy: number;
  testMode: {
    mode: string;
    language: string;
    duration: string;
  };
  characters: {
    match: number;
    mismatch: number;

    totalWrong: number;
    totalMissed: number;
    totalExtra: number;
  };
}

class Session {
  uuid: string;
  history: TestRecord[];
  testActive: Boolean;

  constructor() {
    this.uuid = uuidv4();
    this.history = [];
    this.testActive = false;
  }
}

const activeSession =
  JSON.parse(localStorage.getItem("instance")) || new Session();
export const instance = writable(activeSession);

localStorage.setItem("instance", JSON.stringify(instance));

instance.subscribe((i) => localStorage.setItem("instance", JSON.stringify(i)));

const activeId = activeSession.uuid;

export default { activeId, instance };
