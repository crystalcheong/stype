import { writable } from "svelte/store";

const theme = writable("system");

export default { theme };
