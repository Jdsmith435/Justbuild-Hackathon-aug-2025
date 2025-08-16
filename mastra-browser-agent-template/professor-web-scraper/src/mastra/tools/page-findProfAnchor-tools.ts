import { createTool } from "@mastra/core";
import z from "zod";
import { sessionManager } from "../../lib/stage-hand";

export const pageFindProfAnchorTool = createTool({
  id: "web-findProfAnchor",
  description:
    "Find anchor elements on a webpage using Stagehand to navigate to",
  inputSchema: z.object({
    instruction: z
      .string()
      .describe("Find an achor element representing a faculty member page"),
  }),
  outputSchema: z.array(z.any()).describe("Array of navigation actions"),
  execute: async ({ context }) => {
    return await performWebObservation(context.instruction);
  },
});

const performWebObservation = async (instruction?: string) => {
  console.log(`Starting anchor finding with instruction: ${instruction}`);

  try {
    const stagehand = await sessionManager.ensureStagehand();
    if (!stagehand) {
      console.error("Failed to get Stagehand instance");
      throw new Error("Failed to get Stagehand instance");
    }

    const page = stagehand.page;
    if (!page) {
      console.error("Page not available");
      throw new Error("Page not available");
    }

    try {
      // Observe the page
      if (instruction) {
        console.log(`Observing with instruction: ${instruction}`);
        try {
          const actions = await page.observe(instruction);
          console.log(
            `Anchor finding successful, found ${actions.length} actions`
          );
          return actions;
        } catch (observeError) {
          console.error("Error during observation:", observeError);
          throw observeError;
        }
      }

      return [];
    } catch (pageError) {
      console.error("Error in page operation:", pageError);
      throw pageError;
    }
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Stagehand observation failed: ${errorMessage}`);
  }
};
