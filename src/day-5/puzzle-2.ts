import { benchmarkSolve } from "../util.js";
import { FoodMap, IdMap, IdRange, getSeedsAndFoodMaps } from "./puzzle-1.js";

const getRangeIntersection = (range1: IdRange, range2: IdRange): IdRange | null => {
  const min = Math.max(range1.min, range2.min);
  const max = Math.min(range1.max, range2.max);

  return min <= max ? { min, max } : null;
};

const getSeedRangesAndFoodMaps = async (): Promise<[IdRange[], Map<string, FoodMap>]> => {
  const [seeds, maps] = await getSeedsAndFoodMaps();
  const seedRanges: IdRange[] = [];
  for (let i = 0; i < seeds.length; i += 2) {
    seedRanges.push({ min: seeds[i], max: seeds[i] + seeds[i + 1] });
  }

  return [seedRanges, maps];
};

const mapRanges = (sourceRanges: IdRange[], map: IdMap) => {
  const destinationRanges = map.ranges;
  const mappedRanges: IdRange[] = [];

  for (const sourceRange of sourceRanges) {
    let splitRanges: IdRange[] = [sourceRange];
    const intersections: IdRange[] = [];
    for (const destinationRange of destinationRanges) {
      let newSplitRanges: IdRange[] = [];
      for (const subRange of splitRanges) {
        const intersection = getRangeIntersection(subRange, destinationRange);
        if (!intersection) continue;

        if (subRange.min !== intersection.min) {
          newSplitRanges.push({ min: subRange.min, max: intersection.min - 1 });
        }
        if (subRange.max !== intersection.max) {
          newSplitRanges.push({ min: intersection.max + 1, max: subRange.max });
        }

        intersections.push({ min: map.get(intersection.min), max: map.get(intersection.max) });
        splitRanges = newSplitRanges;
      }
    }

    mappedRanges.push(...splitRanges, ...intersections);
  }

  return mappedRanges;
};

const mapSeedRangesToDestination = (
  seedRanges: IdRange[],
  maps: Map<string, FoodMap>,
  targetDestination = "location",
): IdRange[] => {
  let source = "seed";
  while (source !== targetDestination) {
    const foodMap = maps.get(source);
    if (!foodMap) throw new TypeError(`FoodMaps are missing source: ${source}`);

    const { destination, idMap } = foodMap;
    seedRanges = mapRanges(seedRanges, idMap);

    source = destination;
  }

  return seedRanges;
};

const solve = async () => {
  const [seedRanges, maps] = await getSeedRangesAndFoodMaps();
  const mappedRanges = mapSeedRangesToDestination(seedRanges, maps);
  return Math.min(...mappedRanges.map((range) => range.min));
};

export default () => benchmarkSolve("Day 5 Puzzle 2", "Minimum location number:", solve);
