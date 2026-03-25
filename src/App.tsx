import { useState, useCallback, useEffect, useRef } from "react";
import { Download, Moon, Plus, Sun, Upload, Users } from "lucide-react";
import type { Player, PlayerBalanceUpdate } from "./types/player";
import {
  applyTheme,
  exportToJson,
  importFromJson,
  loadPlayers,
  loadTheme,
  savePlayers,
  saveTheme,
} from "./lib/storage";
import { DEFAULT_STARTING_CASH } from "./lib/playerFinance";
import { PlayerTable } from "./components/PlayerTable";
import { EditCurrencyDialog } from "./components/EditCurrencyDialog";
import { AddPlayerDialog } from "./components/AddPlayerDialog";
import { DeletePlayerDialog } from "./components/DeletePlayerDialog";

function App() {
  const [players, setPlayers] = useState<Player[]>(loadPlayers);
  const [theme, setTheme] = useState(loadTheme);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const persist = useCallback((next: Player[]) => {
    setPlayers(next);
    savePlayers(next);
  }, []);

  function handleAddPlayer(name: string) {
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name,
      cashOnHand: DEFAULT_STARTING_CASH,
      debt: 0,
    };
    persist([...players, newPlayer]);
  }

  function handleEditCurrency(id: string, values: PlayerBalanceUpdate) {
    persist(players.map((p) => (p.id === id ? { ...p, ...values } : p)));
  }

  function handleRemovePlayer(id: string) {
    persist(players.filter((p) => p.id !== id));
  }

  function requestRemovePlayer(player: Player) {
    setPlayerToDelete(player);
  }

  function openEdit(player: Player) {
    setEditingPlayer(player);
    setEditOpen(true);
  }

  useEffect(() => {
    applyTheme(theme);
    saveTheme(theme);
  }, [theme]);

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importFromJson(file);
      persist(imported);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Import failed");
    }
    e.target.value = "";
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Bennie's Currency Tracker
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track each player&apos;s cash on hand, debt, and available funds locally.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"))}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted cursor-pointer"
              title="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted cursor-pointer"
              title="Import data.json"
            >
              <Download className="h-4 w-4" />
              Import
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
            <button
              onClick={() => exportToJson(players)}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted cursor-pointer"
              title="Export data.json"
            >
              <Upload className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Players
            </span>
            <button
              onClick={() => setAddOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 cursor-pointer transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Player
            </button>
          </div>

          {players.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Users className="h-10 w-10 mb-3 opacity-40" />
              <p className="text-sm">No players yet.</p>
              <p className="text-xs">Click "Add Player" to get started.</p>
            </div>
          ) : (
            <PlayerTable
              players={players}
              onEdit={openEdit}
              onRemove={requestRemovePlayer}
            />
          )}
        </div>
      </div>

      <EditCurrencyDialog
        player={editingPlayer}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={handleEditCurrency}
      />
      <AddPlayerDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdd={handleAddPlayer}
      />
      <DeletePlayerDialog
        player={playerToDelete}
        open={playerToDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPlayerToDelete(null);
          }
        }}
        onConfirm={handleRemovePlayer}
      />
    </div>
  );
}

export default App;
