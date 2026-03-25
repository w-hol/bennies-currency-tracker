import type { Player } from "../types/player";
import { PlayerRow } from "./PlayerRow";

interface PlayerTableProps {
  players: Player[];
  onEdit: (player: Player) => void;
  onRemove: (player: Player) => void;
}

export function PlayerTable({ players, onEdit, onRemove }: PlayerTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[46rem] w-full table-auto border-collapse">
        <colgroup>
          <col />
          <col />
          <col />
          <col />
          <col className="w-[8.5rem]" />
        </colgroup>
        <thead>
          <tr className="border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <th className="border-r border-border px-4 py-3 text-left">Player</th>
            <th className="border-r border-border px-4 py-3 text-right">Cash on Hand</th>
            <th className="border-r border-border px-4 py-3 text-right">Debt</th>
            <th className="border-r border-border px-4 py-3 text-right">Available Funds</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <PlayerRow
              key={player.id}
              player={player}
              index={index}
              onEdit={onEdit}
              onRemove={onRemove}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
