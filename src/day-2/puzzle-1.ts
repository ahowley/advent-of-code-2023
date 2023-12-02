import { benchmarkSolve, getLines } from "../util.js";

export type InputString = `Game ${number}:${string}`;
export type Color = "red" | "green" | "blue";

export type GameRound = {
  red: number;
  green: number;
  blue: number;
};
export type Game = {
  id: number;
  rounds: GameRound[];
};

const MAX_CUBES: GameRound = {
  red: 12,
  green: 13,
  blue: 14,
};

export const parseInputToGame = (input: InputString): Game => {
  const [gameString, roundsString] = input.split(": ");
  const id = parseInt(gameString.split(" ")[1]);

  const rounds: GameRound[] = roundsString.split("; ").map((roundString: string) => {
    const colorStrings = roundString.split(", ");
    const round: GameRound = { red: 0, green: 0, blue: 0 };

    for (const colorString of colorStrings) {
      const [quantityString, color] = colorString.split(" ") as [string, Color];
      round[color] += parseInt(quantityString);
    }

    return round;
  });

  return { id, rounds };
};

const isPossible = (round: GameRound) => {
  const entries = Object.entries(round) as [Color, number][];
  return entries.every(([color, quantity]) => quantity <= MAX_CUBES[color]);
};

const solve = async () => {
  const lines = getLines("day-2", "input.txt") as AsyncGenerator<InputString, null, InputString>;

  let possibleIdSum = 0;
  for await (const line of lines) {
    const game = parseInputToGame(line);
    if (game.rounds.every(isPossible)) {
      possibleIdSum += game.id;
    }
  }

  return possibleIdSum;
};

export default async () => benchmarkSolve("Day 2 Puzzle 1", "Sum of game IDs where quantities are possible:", solve);
