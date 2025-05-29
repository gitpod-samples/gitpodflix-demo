export const SHIPS = [
  { name: "Carrier", size: 5 },
  { name: "Battleship", size: 4 },
  { name: "Cruiser", size: 3 },
  { name: "Submarine", size: 3 },
  { name: "Destroyer", size: 2 },
];

export interface Position {
  x: number;
  y: number;
}

export interface Ship {
  name: string;
  size: number;
  positions: Position[];
}

export interface GameBoard {
  ships: Ship[];
  guesses: Array<{
    x: number;
    y: number;
    isHit: boolean;
  }>;
} 