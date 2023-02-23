export let Settings = {
    title: "My Library"
}

export function updateSettings(newSettings: string[]) {
    Settings.title = newSettings[0]
}