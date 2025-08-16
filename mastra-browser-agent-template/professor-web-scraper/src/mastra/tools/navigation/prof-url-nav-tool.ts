import { createTool } from "@mastra/core";
import z from "zod";
import { getStagehandInstance } from "../../utils/agent-utils";

export const profUrlNavTool = createTool({
  id: "prof-url-nav",
  description:
    "Navigate to a faculty member URL in the browser and return the html of the page.",
  inputSchema: z.object({
    url: z.string().describe("URL to navigate to a faculty member page"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string().optional(),
    html: z.string().optional(),
  }),
  execute: async ({ context }) => {
    try {
      const stagehand = await getStagehandInstance();
      // Navigate to the URL
      await stagehand.page.goto(context.url);

      return {
        success: true,
        html: await stagehand.page.evaluate(
          () => document.documentElement.outerHTML
        ),
      };
    } catch (error: any) {
      return {
        success: false,
        url: context.url,
        message: `Navigation failed: ${error.message}`,
      };
    }
  },
});
