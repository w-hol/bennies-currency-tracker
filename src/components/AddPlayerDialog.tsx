import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

interface AddPlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (name: string) => void;
}

export function AddPlayerDialog({
  open,
  onOpenChange,
  onAdd,
}: AddPlayerDialogProps) {
  const [name, setName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setName("");
    onOpenChange(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background rounded-lg border border-border shadow-lg p-6 w-full max-w-sm">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold">
              Add Player
            </Dialog.Title>
            <Dialog.Close className="rounded-sm p-1 hover:bg-muted cursor-pointer">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="text-sm text-muted-foreground mb-4">
            Enter the name of the new player. They will start with 10 currency.
          </Dialog.Description>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Player name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring mb-4"
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
                Add
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
