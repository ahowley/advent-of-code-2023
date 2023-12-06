import { benchmarkSolve, getLines } from "../util.js";
import { countWinningHoldTimes } from "./puzzle-1.js";

const getRace = async () => {
  const linesIterator = getLines("day-6", "input.txt");
  const lines = [linesIterator.next(), linesIterator.next()];
  const [firstLine, secondLine] = (await Promise.all(lines)).map((result) => result.value.replace(/ +/g, ""));
  const duration = parseInt(firstLine.slice("Time:".length));
  const distance = parseInt(secondLine.slice("Distance:".length));
  return { duration, distance };
};

const solve = async () => {
  const race = await getRace();
  return countWinningHoldTimes(race);
};

export default () => benchmarkSolve("Day 6 Puzzle 2", "Multiplied ways to beat the record:", solve);
