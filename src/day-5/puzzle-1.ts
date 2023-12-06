import { benchmarkSolve, getLines } from "../util.js";

type IdMapFunction = (sourceNumber: number) => number;

type FoodMapName = `${string}-to-${string}`;

type FoodMap = {
  source: string;
  destination: string;
  idMapFunction: IdMapFunction;
};

const parseSpaceSeparatedNumbers = (numberString: string) => {
  return numberString.split(" ").map((numberString) => parseInt(numberString));
};

const parseRangeToMapFunction = (rangeString: string): IdMapFunction => {
  const [destinationStart, sourceStart, rangeLength] = parseSpaceSeparatedNumbers(rangeString);

  return (sourceNumber: number) => {
    if (sourceNumber >= sourceStart + rangeLength || sourceNumber < sourceStart) {
      return sourceNumber;
    }

    const offset = sourceNumber - sourceStart;
    return destinationStart + offset;
  };
};

const getFoodMap = (mapName: FoodMapName, mapFunctions: IdMapFunction[]): FoodMap => {
  const [source, destination] = mapName.split("-to-");
  return {
    source,
    destination,
    idMapFunction: (sourceNumber: number) => {
      let destinationNumber = sourceNumber;
      for (const idMapFunction of mapFunctions) {
        destinationNumber = idMapFunction(sourceNumber);
        if (destinationNumber !== sourceNumber) break;
      }

      return destinationNumber;
    },
  };
};

const getSeedsAndFoodMaps = async (): Promise<[number[], Map<string, FoodMap>]> => {
  const lines = getLines("day-5", "input.txt");

  let currentMapParsing: "" | FoodMapName = "";
  let currentMapFunctions: IdMapFunction[] = [];
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
      currentMapFunctions.push(parseRangeToMapFunction(line));
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

    seeds = seeds.map((seed) => foodMap.idMapFunction(seed) || seed);
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
