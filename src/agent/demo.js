const { createTaskPlan } = require("./taskPlanner");

const task = process.argv.slice(2).join(" ") || "Build a mobile coding agent";
console.log("Task:", task);
console.log("Plan:");
createTaskPlan(task).forEach((step, index) => {
  console.log(`${index + 1}. ${step}`);
});
