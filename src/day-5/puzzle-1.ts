import { benchmarkSolve, getLines } from "../util.js";

export type IdRange = {
  min: number;
  max: number;
};

export type IdMap = {
  ranges: IdRange[];
  get: (sourceNumber: number) => number;
};

type FoodMapName = `${string}-to-${string}`;

export type FoodMap = {
  source: string;
  destination: string;
  idMap: IdMap;
};

const parseSpaceSeparatedNumbers = (numberString: string) => {
  return numberString.split(" ").map((numberString) => parseInt(numberString));
};

const parseRangeToMap = (rangeString: string): IdMap => {
  const [destinationStart, sourceStart, rangeLength] = parseSpaceSeparatedNumbers(rangeString);
  const sourceEnd = sourceStart + rangeLength - 1;

  return {
    ranges: [{ min: sourceStart, max: sourceEnd }],
    get: (sourceNumber: number) => {
      if (sourceNumber > sourceEnd || sourceNumber < sourceStart) {
        return sourceNumber;
      }

      const offset = sourceNumber - sourceStart;
      return destinationStart + offset;
    },
  };
};

const getFoodMap = (mapName: FoodMapName, idMaps: IdMap[]): FoodMap => {
  const [source, destination] = mapName.split("-to-");
  const ranges = idMaps.map((idMap) => idMap.ranges[0]);

  return {
    source,
    destination,
    idMap: {
      ranges: ranges,
      get: (sourceNumber: number) => {
        let destinationNumber = sourceNumber;
        for (const idMap of idMaps) {
          destinationNumber = idMap.get(sourceNumber);
          if (destinationNumber !== sourceNumber) break;
        }

        return destinationNumber;
      },
    },
  };
};

export const getSeedsAndFoodMaps = async (): Promise<[number[], Map<string, FoodMap>]> => {
  const lines = getLines("day-5", "input.txt");

  let currentMapParsing: "" | FoodMapName = "";
  let currentMapFunctions: IdMap[] = [];
  const seedsKey = "seeds: ";
  const seeds: number[] = [];
  const maps = new Map<string, FoodMap>();
  for await (const line of lines) {
    if (!line) continue;

    if (line.startsWith(seedsKey)) {
      const seedsString = line.slice(seedsKey.length);
      seeds.push(...parseSpaceSeparatedNumbers(seedsString));
      continue;
    }

    if (line.match(/[^\d ]/)) {
      if (currentMapParsing && currentMapFunctions.length) {
        const foodMap = getFoodMap(currentMapParsing, currentMapFunctions);
        maps.set(foodMap.source, foodMap);
        currentMapFunctions = [];
      }

      currentMapParsing = line.split(" ")[0] as FoodMapName;
      continue;
    }

    if (currentMapParsing) {
      currentMapFunctions.push(parseRangeToMap(line));
    }
  }
  if (currentMapParsing && currentMapFunctions.length) {
    const foodMap = getFoodMap(currentMapParsing, currentMapFunctions);
    maps.set(foodMap.source, foodMap);
  }

  return [seeds, maps];
};

const mapSeedsToDestination = (seeds: number[], maps: Map<string, FoodMap>, targetDestination = "location") => {
  let source = "seed";
  while (source !== targetDestination) {
    const foodMap = maps.get(source);
    if (!foodMap) throw new TypeError(`FoodMaps are missing source: ${source}`);

    seeds = seeds.map((seed) => foodMap.idMap.get(seed) || seed);
    source = foodMap.destination;
  }

  return seeds;
};

const solve = async () => {
  const [seeds, maps] = await getSeedsAndFoodMaps();
  const mappedSeeds = mapSeedsToDestination(seeds, maps);
  return Math.min(...mappedSeeds);
};

export default () => benchmarkSolve("Day 5 Puzzle 1", "Minimum location number:", solve);
