import { Stagehand } from "@browserbasehq/stagehand";
import { sessionManager } from "../../lib/stage-hand";

export async function getStagehandInstance(): Promise<Stagehand> {
  const stagehand = await sessionManager.ensureStagehand();
  if (!stagehand) {
    console.error("Failed to get Stagehand instance");
    throw new Error("Failed to get Stagehand instance");
  }
  return stagehand;
}
