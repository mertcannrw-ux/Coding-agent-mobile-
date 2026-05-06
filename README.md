# Forge Mobile Agent

A mobile-first coding agent prototype built with Expo and React Native.

The app currently includes:

- A chat-style mobile interface
- API key settings inside the mobile app
- OpenAI API mode using the Responses API
- Local demo mode when no API key is saved
- Local API key persistence with AsyncStorage
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

## Use with an API key

1. Open the app.
2. Expand **API settings**.
3. Paste your OpenAI API key.
4. Keep the model as `gpt-5-mini` or enter another compatible model.
5. Tap **Save key**.
6. Ask the mobile agent to build, fix, refactor, or explain code.

The key is stored locally on the device with AsyncStorage for development convenience.

## Important security note

For a production mobile app, do not call the OpenAI API directly from the phone with a user or developer secret. Use a backend proxy that stores secrets server-side, applies rate limits, validates users, and performs GitHub/file operations safely.

## Project structure

```text
App.js                         Main mobile UI and API settings
src/services/openAiClient.js   OpenAI API client
src/storage/apiKeyStorage.js   Local API key and model storage
src/agent/mobileAgent.js       Local demo agent orchestrator
src/agent/taskPlanner.js       Converts tasks into implementation steps
src/agent/filePlanner.js       Suggests files to create or update
src/agent/riskModel.js         Estimates task risk
src/agent/toolRunner.js        Placeholder for secure backend tool calls
```

## Next step

Connect the mobile client to a secure backend that owns:

- GitHub access
- Sandboxed file editing
- Command execution
- Test running
- Pull request creation

The mobile app should send a task to the backend and display the agent trace, proposed patch, test output, and pull request link.
