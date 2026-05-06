export function estimateRisk(task) {
  const normalized = task.toLowerCase();

  const highRiskTerms = ["delete", "payment", "auth", "database", "production", "secret", "token"];
  const mediumRiskTerms = ["refactor", "api", "backend", "migration", "dependency"];

  if (highRiskTerms.some((term) => normalized.includes(term))) {
    return "high — require confirmation before destructive or sensitive changes";
  }

  if (mediumRiskTerms.some((term) => normalized.includes(term))) {
    return "medium — review generated changes before applying";
  }

  return "low — safe to plan and prototype";
}
