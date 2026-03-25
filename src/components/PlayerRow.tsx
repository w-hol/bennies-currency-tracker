import { Pencil, Trash2 } from "lucide-react";
import { cn } from "../lib/cn";
import { formatMoney, getAvailableFunds } from "../lib/playerFinance";
import type { Player } from "../types/player";

interface PlayerRowProps {
  player: Player;
  index: number;
  onEdit: (player: Player) => void;
  onRemove: (player: Player) => void;
}

export function PlayerRow({ player, index, onEdit, onRemove }: PlayerRowProps) {
  const isEven = index % 2 === 0;
  const availableFunds = getAvailableFunds(player);
  const cashOnHandColor =
    player.cashOnHand === 0
      ? "text-muted-foreground"
      : "text-positive";
  const debtColor =
    player.debt === 0 ? "text-muted-foreground" : "text-negative";
  const availableFundsColor =
    availableFunds === 0
      ? "text-muted-foreground"
      : availableFunds > 0
        ? "text-positive"
        : "text-negative";

  return (
    <tr className={cn(isEven ? "bg-background" : "bg-muted/60")}>
      <td className="border-b border-r border-border px-4 py-3 text-sm font-medium">
        {player.name}
      </td>
      <td
        className={cn(
          "border-b border-r border-border px-4 py-3 text-right font-mono text-sm font-semibold whitespace-nowrap",
          cashOnHandColor
        )}
      >
        {formatMoney(player.cashOnHand)}
      </td>
      <td
        className={cn(
          "border-b border-r border-border px-4 py-3 text-right font-mono text-sm font-semibold whitespace-nowrap",
          debtColor
        )}
      >
        {formatMoney(-player.debt)}
      </td>
      <td
        className={cn(
          "border-b border-r border-border px-4 py-3 text-right font-mono text-sm font-semibold whitespace-nowrap",
          availableFundsColor
        )}
      >
        {formatMoney(availableFunds)}
      </td>
      <td className="border-b border-border px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(player)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-background cursor-pointer"
            title="Adjust player funds"
          >
            <Pencil className="h-4 w-4" />
            Adjust
          </button>
          <button
            onClick={() => onRemove(player)}
            className="cursor-pointer rounded-md p-1.5 text-destructive transition-colors hover:bg-red-500/15 focus-visible:bg-red-500/15 focus-visible:outline-none"
            title="Remove player"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
