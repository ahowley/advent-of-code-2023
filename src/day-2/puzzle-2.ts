import { benchmarkSolve, getLines } from "../util.js";
import { InputString, Color, GameRound, Game, parseInputToGame } from "./puzzle-1.js";

const getMinimumCubes = (game: Game): GameRound => {
  const minimums: GameRound = { red: 0, green: 0, blue: 0 };

  for (const round of game.rounds) {
    const colorQuantities = Object.entries(round) as [Color, number][];

    for (const [color, quantity] of colorQuantities) {
      minimums[color] = Math.max(minimums[color], quantity);
    }
  }

  return minimums;
};

const getGamePower = (game: Game) => {
  const { red, green, blue } = getMinimumCubes(game);
  return red * green * blue;
};

const solve = async () => {
  const lines = getLines("day-2", "input.txt") as AsyncGenerator<InputString, null, InputString>;

  let sumOfPowers = 0;
  for await (const line of lines) {
    const game = parseInputToGame(line);
    sumOfPowers += getGamePower(game);
  }

  return sumOfPowers;
};

export default async () => benchmarkSolve("Day 2 Puzzle 2", "Sum of game powers:", solve);
