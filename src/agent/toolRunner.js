export async function runTool(toolCall) {
  return {
    ok: false,
    tool: toolCall?.name ?? "unknown",
    message:
      "Tool execution is not enabled in the mobile client. Connect this to a secure backend before running file edits, shell commands, or git operations.",
  };
}

export const supportedTools = [
  "read_file",
  "write_file",
  "run_tests",
  "run_shell_command",
  "create_pull_request",
];
