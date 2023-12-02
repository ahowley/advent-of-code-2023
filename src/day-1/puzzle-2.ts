import { fileURLToPath } from "url";
import { dirname } from "path";
import { readFile } from "node:fs/promises";

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
  const inputString = await readFile(`${dirname(fileURLToPath(import.meta.url))}/input.txt`, { encoding: "utf-8" });
  const input = inputString.split("\n");
  const calibrationTotal = input.reduce((sum, current) => (current ? sum + getCalibrationValue(current) : sum), 0);
  console.log("Calibration Value Total (Including Numerical Words):", calibrationTotal);
  return calibrationTotal;
};

export default solve;
