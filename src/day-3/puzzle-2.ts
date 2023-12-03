import { benchmarkSolve } from "../util.js";
import { getEntireStringAndLineLength, getPartNumbers, getMultipleAdjacentIndeces, PartNumber } from "./puzzle-1.js";

type Gear = { index: number; adjacentPartNumbers: [PartNumber, PartNumber] };

const getPartNumberAdjacencyMap = (lineLength: number, partNumbers: PartNumber[], entireString: string) => {
  const adjacencyMap = new Map<number, PartNumber[]>();
  for (const partNumber of partNumbers) {
    for (const index of getMultipleAdjacentIndeces(lineLength, partNumber.indeces, entireString.length)) {
      if (entireString[index] !== "*") continue;

      const otherAdjacentPartNumbers = adjacencyMap.get(index) || [];
      adjacencyMap.set(index, [...otherAdjacentPartNumbers, partNumber]);
    }
  }

  return adjacencyMap;
};

const getGears = (lineLength: number, entireString: string, partNumbers: PartNumber[]): Gear[] => {
  const gears: Gear[] = [];

  for (const [index, adjacentPartNumbers] of getPartNumberAdjacencyMap(lineLength, partNumbers, entireString)) {
    if (adjacentPartNumbers.length !== 2) continue;
    gears.push({
      index,
      adjacentPartNumbers: [adjacentPartNumbers[0], adjacentPartNumbers[1]],
    });
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

export default () => benchmarkSolve("Day 3 Puzzle 2", "Sum of gear ratios:", solve);
