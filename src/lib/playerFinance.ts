import type { Player } from "../types/player";

export const DEFAULT_STARTING_CASH = 10;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isWholeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value);
}

function isNonNegativeWholeNumber(value: unknown): value is number {
  return isWholeNumber(value) && value >= 0;
}

function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function normalizePlayer(value: unknown): Player {
  if (!isRecord(value)) {
    throw new Error("expected an object");
  }

  const { id, name, cashOnHand, debt, currency } = value;

  if (!isString(id)) {
    throw new Error("missing a valid id");
  }

  if (!isString(name)) {
    throw new Error("missing a valid name");
  }

  if (isNonNegativeWholeNumber(cashOnHand) && isNonNegativeWholeNumber(debt)) {
    return {
      id,
      name,
      cashOnHand,
      debt,
    };
  }

  if (isWholeNumber(currency)) {
    return {
      id,
      name,
      cashOnHand: currency >= 0 ? currency : 0,
      debt: currency >= 0 ? 0 : Math.abs(currency),
    };
  }

  throw new Error("missing valid cash/debt values");
}

export function normalizePlayers(value: unknown): Player[] {
  if (!Array.isArray(value)) {
    throw new Error("Invalid format: expected an array of players");
  }

  return value.map((entry, index) => {
    try {
      return normalizePlayer(entry);
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown error";
      throw new Error(`Invalid player at position ${index + 1}: ${message}`);
    }
  });
}

export function getAvailableFunds(player: Pick<Player, "cashOnHand" | "debt">): number {
  return player.cashOnHand - player.debt;
}

export function formatMoney(value: number): string {
  return value < 0 ? `-$${Math.abs(value)}` : `$${value}`;
}
