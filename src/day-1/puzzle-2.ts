import { getLines } from "../util.js";

const digitMap = new Map<string, string>([
  ["one", "1"],
  ["two", "2"],
  ["three", "3"],
  ["four", "4"],
  ["five", "5"],
  ["six", "6"],
  ["seven", "7"],
  ["eight", "8"],
  ["nine", "9"],
]);

const getCalibrationValue = (input: string) => {
  const numericWordsPresent = [...digitMap].filter((tuple) => input.includes(tuple[0]));

  if (numericWordsPresent.length) {
    const firstIndeces = numericWordsPresent
      .map((tuple): [number, string] => [input.indexOf(tuple[0]), tuple[0]])
      .sort((a, b) => a[0] - b[0]);
    const lastIndeces = numericWordsPresent
      .map((tuple): [number, string] => [input.lastIndexOf(tuple[0]), tuple[0]])
      .sort((a, b) => a[0] - b[0]);

    const [firstIndex, firstNumericWord] = firstIndeces[0];
    const [lastIndex, lastNumericWord] = lastIndeces.at(-1);
    input =
      input.slice(0, firstIndex) +
      digitMap.get(firstNumericWord) +
      input.slice(firstIndex, lastIndex) +
      digitMap.get(lastNumericWord) +
      input.slice(lastIndex);
  }

  const digits = input.replace(/\D/g, "");
  return parseInt(digits[0] + digits.at(-1));
};

const solve = async () => {
  const lines = getLines("day-1", "input.txt");
  let calibrationTotal = 0;
  for await (const line of lines) {
    calibrationTotal += getCalibrationValue(line);
  }
  console.log("Calibration Value Total (Including Numerical Words):", calibrationTotal);
  return calibrationTotal;
};

export default solve;
