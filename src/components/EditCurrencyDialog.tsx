import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { Player } from "../types/player";

interface EditCurrencyDialogProps {
  player: Player | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, newCurrency: number) => void;
}

export function EditCurrencyDialog({
  player,
  open,
  onOpenChange,
  onSave,
}: EditCurrencyDialogProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!player) return;
    const formData = new FormData(e.currentTarget);
    const rawValue = formData.get("currency");
    const parsed = parseInt(String(rawValue ?? ""), 10);
    if (Number.isNaN(parsed)) return;
    onSave(player.id, parsed);
    onOpenChange(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background rounded-lg border border-border shadow-lg p-6 w-full max-w-sm">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold">
              Edit Currency
            </Dialog.Title>
            <Dialog.Close className="rounded-sm p-1 hover:bg-muted cursor-pointer">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="text-sm text-muted-foreground mb-4">
            Set a new currency value for{" "}
            <span className="font-medium text-foreground">
              {player?.name}
            </span>
            .
          </Dialog.Description>
          <form onSubmit={handleSubmit}>
            <input
              key={player?.id ?? "empty-player"}
              name="currency"
              type="number"
              defaultValue={player?.currency ?? 0}
              className="no-spinner mb-4 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 text-sm rounded-md border border-border hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
