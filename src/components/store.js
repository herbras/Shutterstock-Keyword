import { writable } from "svelte/store";

export const keywordsInput = writable("");
export const result = writable(null);
export const loading = writable(false);
export const errorMessage = writable(null);
