import { fileURLToPath } from "url";
import { dirname } from "path";
import { createInterface } from "readline/promises";
import { createReadStream } from "fs";

type TextFileName = `${string}.txt`;

export async function* getLines(
  subdirectory: string,
  textFileName: TextFileName,
): AsyncGenerator<string, null, string> {
  let totalIOTime = 0;
  let start = performance.now();
  const src = dirname(fileURLToPath(import.meta.url));
  const directory = `${src}/${subdirectory}`;
  const filePath = `${directory}/${textFileName}`;

  const fileStream = createReadStream(filePath, "utf-8");
  const lineReader = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of lineReader) {
    if (!line) continue;
    totalIOTime += performance.now() - start;
    yield line;
    start = performance.now();
  }

  console.log("Read Time (ms):", totalIOTime);
  return null;
}

export const benchmarkSolve = async (timerLabel: string, resultLabel: string, solveFunction: () => Promise<any>) => {
  console.time(timerLabel);
  const result = await solveFunction();

  console.timeEnd(timerLabel);
  console.log(resultLabel, result);
  console.log("");
};
