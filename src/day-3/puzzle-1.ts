import { benchmarkSolve, getLines } from "../util.js";

export type PartNumber = { value: number; indeces: number[] };
type TwoDimensionalIndex = { row: number; column: number };

const isNumber = (character: string) => {
  if (character.length !== 1) throw new TypeError("isNumber expects a string with exactly 1 character.");
  return !!character.match(/^\d$/g);
};

const isSpecialCharacter = (character: string) => {
  if (character.length !== 1) throw new TypeError("isNumber expects a string with exactly 1 character.");
  return !!character.match(/^[^\d.]$/g);
};

const convert1dTo2dIndex = (lineLength: number, index: number): TwoDimensionalIndex => {
  const row = Math.floor(index / lineLength);
  const column = index % lineLength;
  return { row, column };
};

const convert2dTo1dIndex = (lineLength: number, index: TwoDimensionalIndex) => {
  const { row, column } = index;
  return row * lineLength + column;
};

const getHorizontalAdjacentIndeces = (
  lineLength: number,
  index: TwoDimensionalIndex,
  totalLength: number,
): TwoDimensionalIndex[] => {
  const { row, column } = index;
  const indeces: TwoDimensionalIndex[] = [];

  if (column > 0) {
    indeces.push({ row, column: column - 1 });
  }
  if (column < lineLength - 1 && convert2dTo1dIndex(lineLength, index) < totalLength - 1) {
    indeces.push({ row, column: column + 1 });
  }

  return indeces;
};

export const getAdjacentIndeces = (lineLength: number, index: number, totalLength: number): number[] => {
  const { row, column } = convert1dTo2dIndex(lineLength, index);
  const horizontalIndeces = getHorizontalAdjacentIndeces(lineLength, { row, column }, totalLength);
  const indecesAbove: TwoDimensionalIndex[] = [];
  const indecesBelow: TwoDimensionalIndex[] = [];

  if (row > 0) {
    const indexAbove = { row: row - 1, column };
    indecesAbove.push(indexAbove);
    indecesAbove.push(...getHorizontalAdjacentIndeces(lineLength, indexAbove, totalLength));
  }

  const { row: lastRow, column: lastColumn } = convert1dTo2dIndex(lineLength, totalLength - 1);
  if (row < lastRow && column <= lineLength - 1) {
    const indexBelow = { row: row + 1, column };
    if (row < lastRow - 1 || (row === lastRow - 1 && column <= lastColumn)) {
      indecesBelow.push(indexBelow);
    }
    indecesBelow.push(...getHorizontalAdjacentIndeces(lineLength, indexBelow, totalLength));
  }

  return [
    ...horizontalIndeces.map((index) => convert2dTo1dIndex(lineLength, index)),
    ...indecesAbove.map((index) => convert2dTo1dIndex(lineLength, index)),
    ...indecesBelow.map((index) => convert2dTo1dIndex(lineLength, index)),
  ];
};

const getMultipleAdjacentIndeces = (lineLength: number, indeces: number[], totalLength: number): number[] => {
  const allAdjacentIndeces = new Set<number>();
  for (const index of indeces) {
    for (const adjacent of getAdjacentIndeces(lineLength, index, totalLength)) {
      if (!indeces.includes(adjacent)) {
        allAdjacentIndeces.add(adjacent);
      }
    }
  }

  return Array.from(allAdjacentIndeces);
};

const getPossiblePartNumbers = (lineLength: number, entireString: string): PartNumber[] => {
  const possiblePartNumbers: PartNumber[] = [];
  const { row: lastRow, column: lastColumn } = convert1dTo2dIndex(lineLength, entireString.length - 1);

  let numberProcessing = "";
  for (let i = 0; i < entireString.length; i++) {
    const character = entireString[i];
    const { row, column } = convert1dTo2dIndex(lineLength, i);

    if (isNumber(character) && (column <= lastColumn || (row !== lastRow && column < lineLength))) {
      numberProcessing += character;
    } else if (numberProcessing) {
      const startIndex = i - numberProcessing.length;
      const indeces = [...Array(numberProcessing.length).keys()].map((num) => num + startIndex);
      const value = parseInt(numberProcessing);
      numberProcessing = "";

      possiblePartNumbers.push({ value, indeces });
    }
  }

  return possiblePartNumbers;
};

export const getPartNumbers = (lineLength: number, entireString: string): PartNumber[] => {
  const possiblePartNumbers = getPossiblePartNumbers(lineLength, entireString);
  const partNumbers: PartNumber[] = [];
  for (const partNumber of possiblePartNumbers) {
    for (const adjacentIndex of getMultipleAdjacentIndeces(lineLength, partNumber.indeces, entireString.length)) {
      const adjacentCharacter = entireString[adjacentIndex];
      if (isSpecialCharacter(adjacentCharacter)) {
        partNumbers.push(partNumber);
        break;
      }
    }
  }

  return partNumbers;
};

export const getEntireStringAndLineLength = async (): Promise<[string, number]> => {
  const lines = getLines("day-3", "input.txt");
  let entireString = "";
  let lineLength = 0;

  for await (const line of lines) {
    if (!entireString) {
      lineLength = line.length;
    }
    entireString += line;
  }

  return [entireString, lineLength];
};

const solve = async () => {
  const [entireString, lineLength] = await getEntireStringAndLineLength();
  const partNumberValues = getPartNumbers(lineLength, entireString).map(({ value }) => value);

  return partNumberValues.reduce((sum, current) => sum + current, 0);
};

export default () => benchmarkSolve("Day 3 Puzzle 1", "Sum of numbers adjacent to symbols:", solve);
