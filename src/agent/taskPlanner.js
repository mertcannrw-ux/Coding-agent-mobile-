export function createTaskPlan(task) {
  const normalized = task.toLowerCase();

  const baseSteps = [
    "Restate the target behavior in one sentence.",
    "Inspect the relevant files and project structure.",
    "Create a minimal implementation plan.",
    "Apply the smallest safe code change.",
    "Run checks or describe the checks that should be run.",
    "Summarize changed files and remaining risks.",
  ];

  if (normalized.includes("bug") || normalized.includes("fix")) {
    return [
      "Reproduce or describe the bug clearly.",
      "Identify the most likely failing module.",
      "Patch the root cause instead of hiding the symptom.",
      "Add a regression check if possible.",
      "Explain why the fix is safe.",
    ];
  }

  if (normalized.includes("ui") || normalized.includes("screen") || normalized.includes("button")) {
    return [
      "Define the screen state and user interactions.",
      "Build the React Native component structure.",
      "Add styling for small mobile screens first.",
      "Handle loading and empty states.",
      "Test the screen on mobile and web preview.",
    ];
  }

  if (normalized.includes("backend") || normalized.includes("api")) {
    return [
      "Define the API request and response shape.",
      "Create a typed client wrapper for the mobile app.",
      "Add error and timeout handling.",
      "Keep secrets out of the mobile bundle.",
      "Document the backend connection setup.",
    ];
  }

  return baseSteps;
}
