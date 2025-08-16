import { createTool } from "@mastra/core";
import z from "zod";
import { getStagehandInstance } from "../../utils/agent-utils";

export const directoryHtmlParsingTool = createTool({
  id: "directory-html-parsing",
  description: "Parse the HTML of a webpage to find all factulty member urls",
  inputSchema: z.object({
    instruction: z
      .string()
      .describe(
        "Look for all the anchor (<a>) elements that point to a faculty member page and append the href attribute to the current url."
      ),
  }),
  outputSchema: z
    .array(z.object({ link: z.string().url() }))
    .describe("Array of faculty member urls"),
  execute: async ({ context }) => {
    return await parseDirectoryHtml(context.instruction);
  },
});

const parseDirectoryHtml = async (instruction?: string) => {
  console.log(
    `Starting directory HTML parsing with instruction: ${instruction}`
  );

  try {
    const stagehand = await getStagehandInstance();

    const page = stagehand.page;
    if (!page) {
      console.error("Page not available");
      throw new Error("Page not available");
    }
    if (!instruction) {
      throw new Error("Instruction is required");
    }

    const extraction = await page.extract({
      instruction: instruction,
      schema: z.object({
        faculty_links: z.array(
          z.object({
            link: z.string().url(),
          })
        ),
      }),
    });
    console.log(
      `Observation successful, found ${extraction.faculty_links.length} faculty links`
    );
    return extraction.faculty_links;
  } catch (pageError) {
    console.error("Error in page extraction:", pageError);
    throw pageError;
  }
};
