import { extractFields, type ExtractionRequest } from "../lib/request";

function printUsage(): void {
  console.error(
    "Usage: npm run extract -- --url <url> --fields <field1,field2> [--fields <field3>]",
  );
}

function parseArguments(argumentsList: string[]): ExtractionRequest {
  let url = "";
  const fields: string[] = [];

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];

    if (argument === "--url") {
      url = argumentsList[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (argument === "--fields") {
      fields.push(
        ...(argumentsList[index + 1] ?? "")
          .split(",")
          .map((field) => field.trim())
          .filter(Boolean),
      );
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${argument}`);
  }

  return { url, fields };
}

export async function run(): Promise<void> {
  try {
    const request = parseArguments(process.argv.slice(2));
    const result = await extractFields(request);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    printUsage();
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

void run();
