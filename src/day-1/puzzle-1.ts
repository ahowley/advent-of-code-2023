import { fileURLToPath } from "url";
import { dirname } from "path";
import { readFile } from "node:fs/promises";

const getCalibrationValue = (input: string) => {
  const digits = input.replace(/\D/g, "");
  return parseInt(digits[0] + digits.at(-1));
};

const solve = async () => {
  const inputString = await readFile(`${dirname(fileURLToPath(import.meta.url))}/input.txt`, { encoding: "utf-8" });
  const input = inputString.split("\n");
  const calibrationTotal = input.reduce((sum, current) => (current ? sum + getCalibrationValue(current) : sum), 0);
  console.log("Calibration Value Total:", calibrationTotal);
  return calibrationTotal;
};

export default solve;
