export function createFilePlan(task) {
  const normalized = task.toLowerCase();

  if (normalized.includes("backend") || normalized.includes("api")) {
    return [
      {
        path: "src/services/agentApi.js",
        action: "create",
        description: "Client wrapper for calling a real coding-agent backend.",
      },
      {
        path: "src/config/env.js",
        action: "create",
        description: "Central place for safe public runtime configuration.",
      },
    ];
  }

  if (normalized.includes("ui") || normalized.includes("screen")) {
    return [
      {
        path: "src/screens/AgentScreen.js",
        action: "create",
        description: "Main mobile coding-agent screen.",
      },
      {
        path: "src/components/MessageBubble.js",
        action: "create",
        description: "Reusable chat message component.",
      },
    ];
  }

  return [
    {
      path: "src/agent/mobileAgent.js",
      action: "update",
      description: "Agent orchestration, task routing, and response formatting.",
    },
    {
      path: "src/agent/taskPlanner.js",
      action: "update",
      description: "Rules that turn natural language tasks into implementation plans.",
    },
    {
      path: "src/agent/toolRunner.js",
      action: "create",
      description: "Future bridge for terminal, file editing, tests, and GitHub operations.",
    },
  ];
}
