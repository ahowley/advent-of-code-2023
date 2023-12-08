import { benchmarkSolve, getLines } from "../util.js";

type CamelCardsGame = {
  hand: string;
  bid: number;
  consecutiveCards: string[];
  cardValues: number[];
};

const FACE_VALUES = new Map([
  ["A", 14],
  ["K", 13],
  ["Q", 12],
  ["J", 11],
  ["T", 10],
]);

const HAND_VALUES = new Map([
  ["five of a kind", 7],
  ["four of a kind", 6],
  ["full house", 5],
  ["three of a kind", 4],
  ["two pair", 3],
  ["one pair", 2],
  ["high card", 1],
]);

const getCardValue = (card: string) => {
  if (card.length > 1) throw new TypeError("A card should be no longer than 1 character.");

  const faceValue = FACE_VALUES.get(card);
  if (faceValue) return faceValue;

  return parseInt(card);
};

const parseGame = (gameString: string): CamelCardsGame => {
  const [hand, bidString] = gameString.split(" ");
  const handArray = [...hand];
  const sortedHand = handArray.toSorted().join("");
  const bid = parseInt(bidString);
  const consecutiveCards = sortedHand.match(/([AQKJT0-9])\1*/g).filter((group) => group.length > 1);
  const cardValues = handArray.map((card) => getCardValue(card));

  return { hand, bid, consecutiveCards, cardValues };
};

const getHandValue = (game: CamelCardsGame) => {
  const [group1, group2] = game.consecutiveCards;

  if (!group1?.length) return HAND_VALUES.get("high card");

  if (group2?.length) {
    const maxLength = Math.max(group1.length, group2.length);

    if (maxLength === 3) return HAND_VALUES.get("full house");
    return HAND_VALUES.get("two pair");
  }

  switch (group1.length) {
    case 5:
      return HAND_VALUES.get("five of a kind");
    case 4:
      return HAND_VALUES.get("four of a kind");
    case 3:
      return HAND_VALUES.get("three of a kind");
    case 2:
      return HAND_VALUES.get("one pair");
  }
};

const compareByHighCard = (game1: CamelCardsGame, game2: CamelCardsGame) => {
  for (let i = 0; i < game1.cardValues.length; i++) {
    const valueComparison = game1.cardValues[i] - game2.cardValues[i];
    if (valueComparison) return valueComparison;
  }

  return 0;
};

const compareGames = (game1: CamelCardsGame, game2: CamelCardsGame) => {
  const game1Value = getHandValue(game1);
  const game2Value = getHandValue(game2);
  const gameValueComparison = game1Value - game2Value;

  if (gameValueComparison) return gameValueComparison;
  return compareByHighCard(game1, game2);
};

const solve = async () => {
  const lines = getLines("day-7", "input.txt");

  const games: CamelCardsGame[] = [];
  for await (const line of lines) {
    games.push(parseGame(line));
  }

  games.sort(compareGames);
  return games.reduce((sum, game, i) => sum + game.bid * (i + 1), 0);
};

export default () => benchmarkSolve("Day 7 Puzzle 1", "Sum of bids times ranks:", solve);
