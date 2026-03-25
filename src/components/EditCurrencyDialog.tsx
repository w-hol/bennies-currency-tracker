import { useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../lib/cn";
import { formatMoney } from "../lib/playerFinance";
import type { Player, PlayerBalanceUpdate } from "../types/player";

interface EditCurrencyDialogProps {
  player: Player | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, values: PlayerBalanceUpdate) => void;
}

function parseWholeNumber(value: string): number | null {
  if (value.trim() === "") {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

export function EditCurrencyDialog({
  player,
  open,
  onOpenChange,
  onSave,
}: EditCurrencyDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background rounded-lg border border-border shadow-lg p-6 w-full max-w-sm">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold">
              Adjust Player Funds
            </Dialog.Title>
            <Dialog.Close className="rounded-sm p-1 hover:bg-muted cursor-pointer">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="text-sm text-muted-foreground mb-4">
            Update the cash on hand and debt for{" "}
            <span className="font-medium text-foreground">
              {player?.name}
            </span>
            . Available funds are calculated automatically.
          </Dialog.Description>
          {player ? (
            <EditCurrencyForm
              key={player.id}
              player={player}
              onCancel={() => onOpenChange(false)}
              onSave={(values) => {
                onSave(player.id, values);
                onOpenChange(false);
              }}
            />
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

interface EditCurrencyFormProps {
  player: Player;
  onCancel: () => void;
  onSave: (values: PlayerBalanceUpdate) => void;
}

function EditCurrencyForm({ player, onCancel, onSave }: EditCurrencyFormProps) {
  const [cashOnHand, setCashOnHand] = useState(String(player.cashOnHand));
  const [debt, setDebt] = useState(String(player.debt));

  const parsedCashOnHand = useMemo(() => parseWholeNumber(cashOnHand), [cashOnHand]);
  const parsedDebt = useMemo(() => parseWholeNumber(debt), [debt]);
  const availableFunds =
    parsedCashOnHand !== null && parsedDebt !== null
      ? parsedCashOnHand - parsedDebt
      : null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (parsedCashOnHand === null || parsedDebt === null) {
      return;
    }

    onSave({
      cashOnHand: parsedCashOnHand,
      debt: parsedDebt,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="font-medium">Cash on Hand</span>
          <input
            name="cashOnHand"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            value={cashOnHand}
            onChange={(e) => setCashOnHand(e.target.value)}
            className="no-spinner w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            autoFocus
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium">Debt</span>
          <input
            name="debt"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            value={debt}
            onChange={(e) => setDebt(e.target.value)}
            className="no-spinner w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
      </div>
      <div className="mb-4 rounded-md border border-border bg-muted/50 px-3 py-2 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Available Funds</span>
          <span
            className={cn(
              "font-mono font-semibold",
              availableFunds === null
                ? "text-muted-foreground"
                : availableFunds === 0
                  ? "text-muted-foreground"
                  : availableFunds > 0
                    ? "text-positive"
                    : "text-negative"
            )}
          >
            {availableFunds === null ? "Enter whole numbers" : formatMoney(availableFunds)}
          </span>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm rounded-md border border-border hover:bg-muted cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={parsedCashOnHand === null || parsedDebt === null}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
