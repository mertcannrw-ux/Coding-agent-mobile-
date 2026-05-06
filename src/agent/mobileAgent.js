import { createTaskPlan } from "./taskPlanner";
import { estimateRisk } from "./riskModel";
import { createFilePlan } from "./filePlanner";

export async function runMobileAgent(userTask) {
  const task = userTask.trim();
  if (!task) {
    throw new Error("Task cannot be empty.");
  }

  const trace = [
    "Perceive: read the user task and identify the likely coding goal.",
    "Orient: classify the request by scope, risk, and expected files.",
    "Decide: produce a safe implementation plan before editing files.",
    "Act: return structured steps that a real backend can execute later.",
  ];

  const steps = createTaskPlan(task);
  const files = createFilePlan(task);
  const riskLevel = estimateRisk(task);

  return {
    summary: `Plan created for: ${task}`,
    trace,
    steps,
    files,
    riskLevel,
  };
}
