import { benchmarkSolve, getLines } from "../util.js";

export type Node = {
  L: string;
  R: string;
};

export type Instructions = Generator<string, void, string>;

function* generateInstructions(instructionsOrder: string[]): Instructions {
  let currentIndex = 0;

  while (true) {
    yield instructionsOrder[currentIndex];
    currentIndex += 1;
    if (currentIndex === instructionsOrder.length) {
      currentIndex = 0;
    }
  }
}

const parseNode = (inputString: string): [key: string, Node] => {
  const [key, valuesString] = inputString.split(" = ");
  const [L, R] = valuesString.replace(/[\(\)]/g, "").split(", ");

  return [key, { L, R }];
};

export const getInstructionsAndNodes = async () => {
  const lines = getLines("day-8", "input.txt");
  const instructionsOrder = [...(await lines.next()).value];
  const instructions = generateInstructions(instructionsOrder);

  const nodes = new Map<string, Node>();
  for await (const line of lines) {
    const [key, node] = parseNode(line);
    nodes.set(key, node);
  }

  return [instructions, nodes] as [Instructions, Map<string, Node>];
};

const solve = async () => {
  const [instructions, nodes] = await getInstructionsAndNodes();

  let numberOfSteps = 0;
  let currentKey = "AAA";
  while (currentKey !== "ZZZ") {
    const instruction = instructions.next().value as "L" | "R";
    const node = nodes.get(currentKey);
    if (!node) throw new EvalError(`The key ${currentKey} is missing from the nodes array.`);

    currentKey = node[instruction];
    numberOfSteps += 1;
  }

  return numberOfSteps;
};

export default () => benchmarkSolve("Day 8 Puzzle 1", "Total number of steps to reach ZZZ:", solve);
