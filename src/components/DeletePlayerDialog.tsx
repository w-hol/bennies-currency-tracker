import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, X } from "lucide-react";
import type { Player } from "../types/player";

interface DeletePlayerDialogProps {
  player: Player | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => void;
}

export function DeletePlayerDialog({
  player,
  open,
  onOpenChange,
  onConfirm,
}: DeletePlayerDialogProps) {
  function handleDelete() {
    if (!player) return;

    onConfirm(player.id);
    onOpenChange(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-background p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-red-500/10 p-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
              </span>
              <Dialog.Title className="text-lg font-semibold">
                Delete Player
              </Dialog.Title>
            </div>
            <Dialog.Close className="cursor-pointer rounded-sm p-1 transition-colors hover:bg-muted">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <Dialog.Description className="mb-5 text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">{player?.name}</span>?
            This action removes their cash and debt details from the tracker.
          </Dialog.Description>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="cursor-pointer rounded-md bg-red-700 px-4 py-2 text-sm text-white transition-colors hover:bg-red-600"
            >
              Delete Player
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
