import type { Player } from "../types/player";

const STORAGE_KEY = "bennies-currency-tracker";
const THEME_STORAGE_KEY = "bennies-currency-tracker-theme";

export type Theme = "dark" | "light";

function getBrowserStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch (error) {
    console.error("Local storage is unavailable in this browser context.", error);
    return null;
  }
}

export function loadPlayers(): Player[] {
  const storage = getBrowserStorage();

  if (!storage) {
    return [];
  }

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Player[];
  } catch (error) {
    console.error("Failed to load saved players.", error);
    return [];
  }
}

export function savePlayers(players: Player[]): void {
  const storage = getBrowserStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(players));
  } catch (error) {
    console.error("Failed to save players.", error);
  }
}

export function exportToJson(players: Player[]): void {
  const blob = new Blob([JSON.stringify(players, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "data.json";
  a.click();
  URL.revokeObjectURL(url);
}

export function importFromJson(file: File): Promise<Player[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed: unknown = JSON.parse(reader.result as string);
        if (!Array.isArray(parsed)) {
          reject(new Error("Invalid format: expected an array of players"));
          return;
        }
        resolve(parsed as Player[]);
      } catch {
        reject(new Error("Failed to parse JSON file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

export function loadTheme(): Theme {
  const storage = getBrowserStorage();

  if (!storage) {
    return "dark";
  }

  try {
    const storedTheme = storage.getItem(THEME_STORAGE_KEY);

    return storedTheme === "light" ? "light" : "dark";
  } catch (error) {
    console.error("Failed to load theme.", error);
    return "dark";
  }
}

export function saveTheme(theme: Theme): void {
  const storage = getBrowserStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.error("Failed to save theme.", error);
  }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}
