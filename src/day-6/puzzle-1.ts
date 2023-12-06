import { benchmarkSolve, getLines } from "../util.js";

type Race = { duration: number; distance: number };

const quadraticFormula = (a: number, b: number, c: number) => {
  const discriminant = b ** 2 - 4 * a * c;
  if (discriminant > 0) {
    return [-1, 1].map((sign) => (-b + sign * Math.sqrt(discriminant)) / (2 * a));
  } else if (discriminant === 0) {
    return [-b / (2 * a)];
  } else {
    return [];
  }
};

export const countWinningHoldTimes = (race: Race) => {
  const [min, max] = quadraticFormula(1, -race.duration, race.distance);
  if (min === undefined) return 0;
  if (max === undefined) return 1;

  const minInt = min % 1 ? Math.ceil(min) : min + 1;
  const maxInt = max % 1 ? Math.ceil(max) : max;
  return Math.max(maxInt - minInt, 0);
};

const getRaces = async (): Promise<Race[]> => {
  const linesIterator = getLines("day-6", "input.txt");
  const lines = [linesIterator.next(), linesIterator.next()];
  const [firstLine, secondLine] = (await Promise.all(lines)).map((result) => result.value.replace(/ +/g, " "));
  linesIterator.next();

  const times = firstLine
    .slice("Time: ".length)
    .split(" ")
    .map((time) => parseInt(time));
  const distances = secondLine
    .slice("Distance: ".length)
    .split(" ")
    .map((distance) => parseInt(distance));
  return times.map((time, i) => ({ duration: time, distance: distances[i] }));
};

const solve = async () => {
  const races = await getRaces();
  return races.map((race) => countWinningHoldTimes(race)).reduce((product, current) => product * current, 1);
};

export default () => benchmarkSolve("Day 6 Puzzle 1", "Multiplied ways to beat each record:", solve);
