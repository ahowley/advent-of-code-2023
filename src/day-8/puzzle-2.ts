import { benchmarkSolve } from "../util.js";
import { Instructions, Node, getInstructionsAndNodes } from "./puzzle-1.js";

type NumberGenerator = Generator<number, never, number>;
type SetWithCounts = Map<number, number>;

const primeCache: number[] = [2, 3];
const instructionsCache: ("L" | "R")[] = [];

function* generatePrimes(): NumberGenerator {
  for (const prime of primeCache) {
    yield prime;
  }

  let num = primeCache.at(-1);
  while (true) {
    num += 2;

    let isPrime = true;
    for (let i = 0; i < primeCache.length; i++) {
      const prime = primeCache[i];
      if (prime > num / 3) break;

      if (num % prime === 0) {
        isPrime = false;
        break;
      }
    }

    if (isPrime) {
      primeCache.push(num);
      yield num;
    }
  }
}

const getPrimeFactors = (num: number, primeFactors: number[] = []): SetWithCounts => {
  const primes = generatePrimes();
  let currentPrime = primes.next().value;

  while (currentPrime <= num / 3) {
    if (num % currentPrime === 0) {
      primeFactors.push(currentPrime);
      return getPrimeFactors(num / currentPrime, primeFactors);
    }

    currentPrime = primes.next().value;
  }
  primeFactors.push(num);

  const primeFactorsSet: SetWithCounts = new Map();
  for (const prime of primeFactors) {
    primeFactorsSet.set(prime, (primeFactorsSet.get(prime) || 0) + 1);
  }

  return primeFactorsSet;
};

const setsWithCountsUnion = (set1: SetWithCounts, set2: SetWithCounts): SetWithCounts => {
  const union: SetWithCounts = new Map();
  for (const [value, count1] of set1) {
    const count2 = set2.get(value) || 0;
    union.set(value, Math.max(count1, count2));
  }
  for (const [value, count2] of set2) {
    if (union.has(value)) continue;
    union.set(value, count2);
  }

  return union;
};

const leastCommonMultiple = (numbers: number[]) => {
  const allPrimeFactors = numbers.map((num) => getPrimeFactors(num));

  let factorsUnion = allPrimeFactors.pop();
  while (allPrimeFactors.length) {
    const primeFactors = allPrimeFactors.pop();
    factorsUnion = setsWithCountsUnion(factorsUnion, primeFactors);
  }

  let lcm = 1;
  for (const [factor, count] of factorsUnion) {
    for (let _ = 0; _ < count; _++) {
      lcm *= factor;
    }
  }

  return lcm;
};

const solveStartingKey = (currentKey: string, instructions: Instructions, nodes: Map<string, Node>) => {
  let numberOfSteps = 0;

  while (!currentKey.endsWith("Z")) {
    let instruction: "L" | "R";
    if (instructionsCache[numberOfSteps]) {
      instruction = instructionsCache[numberOfSteps];
    } else {
      instruction = instructions.next().value as "L" | "R";
      instructionsCache.push(instruction);
    }

    const node = nodes.get(currentKey);
    if (!node) throw new EvalError(`The key ${currentKey} is missing from the nodes array.`);

    currentKey = node[instruction];
    numberOfSteps += 1;
  }

  return numberOfSteps;
};

const solve = async () => {
  const [instructions, nodes] = await getInstructionsAndNodes();
  const stepCountsToZ: number[] = [];

  for (const [key, _node] of nodes) {
    if (key.endsWith("A")) {
      stepCountsToZ.push(solveStartingKey(key, instructions, nodes));
    }
  }

  return leastCommonMultiple(stepCountsToZ);
};

export default () => benchmarkSolve("Day 8 Puzzle 2", "Total number of steps until all nodes end in Z:", solve);
