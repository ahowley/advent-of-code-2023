import { benchmarkSolve, getLines } from "../util.js";
import { CamelCardsGame, FACE_VALUES, compareGames } from "./puzzle-1.js";

const getCardValueWithJokers = (card: string) => {
  if (card.length > 1) throw new TypeError("A card should be no longer than 1 character.");

  const faceValuesWithJokers = new Map([...FACE_VALUES]);
  faceValuesWithJokers.set("J", 1);

  const faceValue = faceValuesWithJokers.get(card);
  if (faceValue) return faceValue;

  return parseInt(card);
};

const parseGameWithJokers = (gameString: string): CamelCardsGame => {
  const [hand, bidString] = gameString.split(" ");
  const handArray = [...hand];
  const sortedHand = handArray.toSorted().join("");
  const bid = parseInt(bidString);
  let consecutiveCards = sortedHand.match(/([AQKJT0-9])\1*/g).filter((group) => group.length > 1 && group[0] !== "J");
  const cardValues = handArray.map((card) => getCardValueWithJokers(card));

  const [group1, group2] = consecutiveCards;
  const numberOfJokers = handArray.filter((card) => card === "J").length;
  if (group1 && numberOfJokers) {
    consecutiveCards = [group1 + group1[0].repeat(numberOfJokers), group2];
  } else if (numberOfJokers === 5) {
    consecutiveCards = ["JJJJJ"];
  } else if (numberOfJokers) {
    const lowestCardValue = Math.min(...cardValues.filter((_card, i) => handArray[i] !== "J"));
    const lowestCardIndex = cardValues.indexOf(lowestCardValue);
    const lowestCard = handArray.find((_card, i) => i === lowestCardIndex);
    consecutiveCards = [lowestCard.repeat(numberOfJokers + 1)];
  }

  return { hand, bid, consecutiveCards, cardValues };
};

const solve = async () => {
  const lines = getLines("day-7", "input.txt");

  const games: CamelCardsGame[] = [];
  for await (const line of lines) {
    games.push(parseGameWithJokers(line));
  }

  games.sort(compareGames);
  return games.reduce((sum, game, i) => sum + game.bid * (i + 1), 0);
};

export default () => benchmarkSolve("Day 7 Puzzle 2", "Sum of bids times ranks with Jokers:", solve);
