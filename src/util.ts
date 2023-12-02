import { fileURLToPath } from "url";
import { dirname } from "path";
import { createInterface } from "readline/promises";
import { createReadStream } from "fs";

type TextFileName = `${string}.txt`;

export async function* getLines(
  subdirectory: string,
  textFileName: TextFileName,
): AsyncGenerator<string, null, string> {
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
    yield line;
  }

  return null;
}
