import { benchmarkSolve, getLines } from "../util.js";

export type Scratchcard = { id: number; winningNumbers: number[]; numbers: number[] };

export const parseCard = (scratchcardString: string): Scratchcard => {
  scratchcardString = scratchcardString.replace(/ +/g, " ");
  const [idString, allNumbersString] = scratchcardString.split(": ");
  const id = parseInt(idString.split(" ")[1]);
  const [winningNumbersString, numbersString] = allNumbersString.split(" | ");
  const winningNumbers = winningNumbersString.split(" ").map((digits) => parseInt(digits));
  const numbers = numbersString.split(" ").map((digits) => parseInt(digits));

  return { id, winningNumbers, numbers };
};

const getCardValue = (scratchcard: Scratchcard) => {
  const { winningNumbers, numbers } = scratchcard;
  const winCount = numbers.filter((number) => winningNumbers.includes(number)).length;
  const winPower = winCount - 1;
  return winCount ? 2 ** winPower : winCount;
};

const solve = async () => {
  const lines = getLines("day-4", "input.txt");

  let totalCardValue = 0;
  for await (const line of lines) {
    const card = parseCard(line);
    totalCardValue += getCardValue(card);
  }

  return totalCardValue;
};

export default () => benchmarkSolve("Day 4 Puzzle 1", "Total scratchcard value:", solve);
