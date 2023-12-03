import { benchmarkSolve } from "../util.js";
import { getEntireStringAndLineLength, getPartNumbers, getAdjacentIndeces, PartNumber } from "./puzzle-1.js";

type Gear = { index: number; adjacentPartNumbers: [PartNumber, PartNumber] };

const getGears = (lineLength: number, entireString: string, partNumbers: PartNumber[]): Gear[] => {
  const gears: Gear[] = [];

  for (let i = 0; i < entireString.length; i++) {
    const character = entireString[i];
    if (character !== "*") continue;

    const adjacentIndeces = getAdjacentIndeces(lineLength, i, entireString.length);
    const adjacentPartNumbers: PartNumber[] = [];
    for (const partNumber of partNumbers) {
      if (adjacentPartNumbers.length > 2) break;
      if (partNumber.indeces.some((index) => adjacentIndeces.includes(index))) {
        adjacentPartNumbers.push(partNumber);
      }
    }

    if (adjacentPartNumbers.length === 2) {
      const [partNumber1, partNumber2] = adjacentPartNumbers;
      gears.push({ index: i, adjacentPartNumbers: [partNumber1, partNumber2] });
    }
  }

  return gears;
};

const getGearRatio = (gear: Gear) => {
  const {
    adjacentPartNumbers: [firstPartNumber, secondPartNumber],
  } = gear;
  return firstPartNumber.value * secondPartNumber.value;
};

const solve = async () => {
  const [entireString, lineLength] = await getEntireStringAndLineLength();
  const partNumbers = getPartNumbers(lineLength, entireString);
  const gears = getGears(lineLength, entireString, partNumbers);

  return gears.reduce((sum, current) => sum + getGearRatio(current), 0);
};

export default () => benchmarkSolve("Day 3 Puzzle 2", "", solve);
