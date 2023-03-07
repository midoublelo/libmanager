import { writable } from "svelte/store";

export const currentBook = writable();

export let Settings = {
    title: "My Library"
}

export function updateSettings(newSettings: string[]) {
    Settings.title = newSettings[0]
}