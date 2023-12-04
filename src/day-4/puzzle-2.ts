import { benchmarkSolve, getLines } from "../util.js";
import { Scratchcard, parseCard } from "./puzzle-1.js";

type ScratchcardPile = Scratchcard & { count: number };
type ScratchcardCollection = Map<number, ScratchcardPile>;

const getScratchcardPile = (scratchcardString: string): ScratchcardPile => {
  return { ...parseCard(scratchcardString), count: 1 };
};

const getCardIdsToCopy = (scratchcard: ScratchcardPile) => {
  const { winningNumbers, numbers } = scratchcard;
  const winCount = numbers.filter((number) => winningNumbers.includes(number)).length;
  return [...Array(winCount).keys()].map((index) => index + scratchcard.id + 1);
};

const solve = async () => {
  const lines = getLines("day-4", "input.txt");
  const cards: ScratchcardCollection = new Map();

  for await (const line of lines) {
    const card = getScratchcardPile(line);
    cards.set(card.id, card);
  }

  let totalCardCount = 0;
  for (const [_id, card] of cards) {
    totalCardCount += card.count;

    for (const idToCopy of getCardIdsToCopy(card)) {
      const cardBeforeCopy = cards.get(idToCopy);
      if (!cardBeforeCopy) break;

      cards.set(idToCopy, { ...cardBeforeCopy, count: cardBeforeCopy.count + card.count });
    }
  }

  return totalCardCount;
};

export default () => benchmarkSolve("Day 4 Puzzle 2", "Total number of scratchcards:", solve);
