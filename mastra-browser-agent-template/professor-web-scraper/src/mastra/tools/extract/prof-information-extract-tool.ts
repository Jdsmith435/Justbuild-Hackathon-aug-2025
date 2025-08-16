import { createTool } from "@mastra/core";
import z from "zod";
import { getStagehandInstance } from "../../utils/agent-utils";

export const profInformationExtractTool = createTool({
  id: "prof-information-extract",
  description: "Extract information from the html of a faculty member page",
  inputSchema: z.object({
    instruction: z.string().describe(
      `Extract Full name (including titles, suffixes)
        , Position/Title (Professor, Associate Professor, etc.)
        , Department/School affiliation
        , Email address
        , Profile photo URL (if available)
        , Website URL
        , Academic Information
        , Education background (degrees, institutions, years)
        , Research interests/areas of expertise
        , Biography/personal statement/Description if available`
    ),
  }),
  outputSchema: z
    .object({
      full_name: z.string(),
      position: z.string().optional(),
      department: z.string(),
      email: z.string(),
      profile_photo_url: z.string().url().optional(),
      website_url: z.string().url().optional(),
      academic_information: z.string().optional(),
      education_background: z.string().optional(),
      research_interests: z.string().optional(),
      biography: z.string().optional(),
    })
    .describe("Object containing the extracted information"),
  execute: async ({ context }) => {
    return await parseDirectoryHtml(context.instruction);
  },
});

const parseDirectoryHtml = async (instruction?: string) => {
  console.log(`Starting prof information extraction`);

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
        prof_information: z.object({
          full_name: z.string(),
          position: z.string().optional(),
          department: z.string(),
          email: z.string(),
          profile_photo_url: z.string().url().optional(),
          website_url: z.string().url().optional(),
          academic_information: z.string().optional(),
          education_background: z.string().optional(),
          research_interests: z.string().optional(),
          biography: z.string().optional(),
        }),
      }),
    });
    console.log(`Observation successful, found ${extraction.prof_information}`);
    return extraction.prof_information;
  } catch (pageError) {
    console.error("Error in page extraction:", pageError);
    throw pageError;
  }
};
