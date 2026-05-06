# Forge Mobile Agent

A mobile-first coding agent prototype built with Expo and React Native.

The app currently includes:

- A chat-style mobile interface
- A local mock coding-agent engine
- Task planning rules
- File-change planning
- Basic risk estimation
- A placeholder tool runner for future backend integration

## Run locally

```bash
npm install
npm run start
```

Then open the app with Expo Go, Android emulator, iOS simulator, or web preview.

## Project structure

```text
App.js                     Main mobile UI
src/agent/mobileAgent.js   Agent orchestrator
src/agent/taskPlanner.js   Converts tasks into implementation steps
src/agent/filePlanner.js   Suggests files to create or update
src/agent/riskModel.js     Estimates task risk
src/agent/toolRunner.js    Placeholder for secure backend tool calls
```

## Next step

Do not run shell commands, edit repo files, or use secrets directly from the mobile app. For a real coding agent, connect this client to a secure backend that owns:

- GitHub access
- Sandboxed file editing
- Command execution
- Test running
- Pull request creation

The mobile app should send a task to the backend and display the agent trace, proposed patch, test output, and pull request link.
