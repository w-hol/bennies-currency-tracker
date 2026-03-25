export interface Player {
  id: string;
  name: string;
  cashOnHand: number;
  debt: number;
}

export interface PlayerBalanceUpdate {
  cashOnHand: number;
  debt: number;
}
