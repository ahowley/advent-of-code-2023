import { benchmarkSolve, getLines } from "../util.js";

const getCalibrationValue = (input: string) => {
  const digits = input.replace(/\D/g, "");
  return parseInt(digits[0] + digits.at(-1));
};

const solve = async () => {
  const lines = getLines("day-1", "input.txt");

  let calibrationTotal = 0;
  for await (const line of lines) {
    calibrationTotal += getCalibrationValue(line);
  }

  return calibrationTotal;
};

export default async () => benchmarkSolve("Day 1 Puzzle 1", "Calibration value total:", solve);
