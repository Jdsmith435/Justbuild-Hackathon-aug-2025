import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { pageActTool } from "../tools/page-act-tool";
import { pageObserveTool } from "../tools/page-observe-tool";
import { pageExtractTool } from "../tools/page-extract-tool";
import { pageNavigateTool } from "../tools/page-navigate-tool";
import { TokenLimiter } from "@mastra/memory/processors";
import { pageFindProfAnchorTool } from "../tools/page-findProfAnchor-tools";

const memory = new Memory({
  processors: [new TokenLimiter(10000)],
});

export const webAgent = new Agent({
  name: "Web Assistant",
  instructions: `
      You are a helpful web assistant that can navigate websites and extract information.

      Your primary functions are:
      - Navigate to University faculty directory
      - Observe elements on on the directory page 
      - Perform action like clicking on faculty names to navigate to their individual pages
      - Extract the name, email, website, and photoUrl from webpages
      - Iterate through all faculty pages
      - Store the extracted data in a database
      - After the first iteration, store the faculty member page data in memory

      When responding:
      - Ask for a list of specific URLs if none are provided

      Use the pageActTool to perform actions on webpages.
      Use the pageFindProfAnchorTool to find anchor elements on webpages.
      Use the pageObserveTool to find elements on webpages.
      Use the pageExtractTool to extract data from webpages.
      Use the pageNavigateTool to navigate to a URL.
`,
  model: openai("gpt-4o"),
  tools: {
    pageActTool,
    pageObserveTool,
    pageExtractTool,
    pageNavigateTool,
    pageFindProfAnchorTool,
  },
  memory: memory,
});

// removed instructions

// When Responding
// - Be specific about what actions to perform
// - When extracting data, be clear about what information you need
