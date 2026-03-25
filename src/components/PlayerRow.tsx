import { Pencil, Trash2 } from "lucide-react";
import { cn } from "../lib/cn";
import type { Player } from "../types/player";

interface PlayerRowProps {
  player: Player;
  index: number;
  onEdit: (player: Player) => void;
  onRemove: (player: Player) => void;
}

export function PlayerRow({ player, index, onEdit, onRemove }: PlayerRowProps) {
  const isEven = index % 2 === 0;
  const currencyColor =
    player.currency === 0
      ? "text-muted-foreground"
      : player.currency > 0
        ? "text-positive"
        : "text-negative";
  const formattedCurrency =
    player.currency < 0 ? `-$${Math.abs(player.currency)}` : `$${player.currency}`;

  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-3",
        isEven ? "bg-background" : "bg-muted"
      )}
    >
      <span className="font-medium text-sm">{player.name}</span>
      <div className="flex items-center gap-3">
        <span className={cn("font-mono text-sm font-semibold", currencyColor)}>
          {formattedCurrency}
        </span>
        <button
          onClick={() => onEdit(player)}
          className="p-1.5 rounded-md hover:bg-border cursor-pointer transition-colors"
          title="Edit currency"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => onRemove(player)}
          className="cursor-pointer rounded-md p-1.5 text-destructive transition-colors hover:bg-red-500/15 focus-visible:bg-red-500/15 focus-visible:outline-none"
          title="Remove player"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
