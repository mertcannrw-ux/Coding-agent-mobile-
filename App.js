import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { runMobileAgent } from "./src/agent/mobileAgent";
import { callOpenAiCodingAgent } from "./src/services/openAiClient";
import {
  clearApiKey,
  loadApiKey,
  loadModel,
  saveApiKey,
  saveModel,
} from "./src/storage/apiKeyStorage";

export default function App() {
  const [input, setInput] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-5-mini");
  const [useApi, setUseApi] = useState(false);
  const [busy, setBusy] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [messages, setMessages] = useState([
    {
      role: "agent",
      text:
        "Forge Mobile Agent is ready. Add your API key, then describe a coding task.",
    },
  ]);

  useEffect(() => {
    async function restoreSettings() {
      const [storedKey, storedModel] = await Promise.all([loadApiKey(), loadModel()]);
      if (storedKey) {
        setApiKey(storedKey);
        setUseApi(true);
        setSettingsOpen(false);
      }
      setModel(storedModel);
    }

    restoreSettings();
  }, []);

  const taskCount = useMemo(
    () => messages.filter((message) => message.role === "user").length,
    [messages]
  );

  async function handleSaveSettings() {
    await Promise.all([saveApiKey(apiKey), saveModel(model)]);
    setUseApi(Boolean(apiKey.trim()));
    setSettingsOpen(false);
    setMessages((old) => [
      ...old,
      {
        role: "agent",
        text: apiKey.trim()
          ? `API key saved locally. API mode is on using ${model || "gpt-5-mini"}.`
          : "API key cleared. Local demo mode is on.",
      },
    ]);
  }

  async function handleClearKey() {
    await clearApiKey();
    setApiKey("");
    setUseApi(false);
    setSettingsOpen(true);
    setMessages((old) => [
      ...old,
      {
        role: "agent",
        text: "API key cleared from this device. Local demo mode is on.",
      },
    ]);
  }

  async function sendTask() {
    const task = input.trim();
    if (!task || busy) return;

    setInput("");
    setBusy(true);
    setMessages((old) => [...old, { role: "user", text: task }]);

    try {
      if (useApi && apiKey.trim()) {
        const text = await callOpenAiCodingAgent({
          apiKey: apiKey.trim(),
          model: model.trim() || "gpt-5-mini",
          task,
        });
        setMessages((old) => [...old, { role: "agent", text }]);
      } else {
        const result = await runMobileAgent(task);
        setMessages((old) => [
          ...old,
          {
            role: "agent",
            text: formatAgentResult(result),
          },
        ]);
      }
    } catch (error) {
      setMessages((old) => [
        ...old,
        {
          role: "agent",
          text: `Agent error: ${error.message}`,
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>Forge Mobile Agent</Text>
        <Text style={styles.subtitle}>
          {useApi ? `API mode · ${model || "gpt-5-mini"}` : "Local demo mode"} · {taskCount} task
          {taskCount === 1 ? "" : "s"}
        </Text>
      </View>

      <View style={styles.settingsCard}>
        <TouchableOpacity onPress={() => setSettingsOpen((value) => !value)}>
          <Text style={styles.settingsTitle}>
            {settingsOpen ? "Hide API settings" : "Show API settings"}
          </Text>
        </TouchableOpacity>

        {settingsOpen ? (
          <View style={styles.settingsBody}>
            <Text style={styles.label}>OpenAI API key</Text>
            <TextInput
              style={styles.settingsInput}
              value={apiKey}
              onChangeText={setApiKey}
              placeholder="sk-..."
              placeholderTextColor="#8a8f98"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
            />
            <Text style={styles.label}>Model</Text>
            <TextInput
              style={styles.settingsInput}
              value={model}
              onChangeText={setModel}
              placeholder="gpt-5-mini"
              placeholderTextColor="#8a8f98"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.settingsActions}>
              <TouchableOpacity style={styles.smallButton} onPress={handleSaveSettings}>
                <Text style={styles.buttonText}>Save key</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleClearKey}>
                <Text style={styles.secondaryButtonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setUseApi((value) => !value)}
              >
                <Text style={styles.secondaryButtonText}>{useApi ? "Use local" : "Use API"}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.warningText}>
              For production, use a backend proxy instead of shipping API keys in a mobile app.
            </Text>
          </View>
        ) : null}
      </View>

      <ScrollView style={styles.chat} contentContainerStyle={styles.chatContent}>
        {messages.map((message, index) => (
          <View
            key={`${message.role}-${index}`}
            style={[
              styles.bubble,
              message.role === "user" ? styles.userBubble : styles.agentBubble,
            ]}
          >
            <Text style={styles.role}>{message.role === "user" ? "You" : "Agent"}</Text>
            <Text style={styles.message}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask it to build, fix, refactor, or explain code..."
          placeholderTextColor="#8a8f98"
          multiline
        />
        <TouchableOpacity
          style={[styles.button, busy && styles.buttonDisabled]}
          onPress={sendTask}
          disabled={busy}
        >
          <Text style={styles.buttonText}>{busy ? "..." : "Send"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function formatAgentResult(result) {
  return [
    result.summary,
    "",
    "Reasoning trace:",
    ...result.trace.map((item, index) => `${index + 1}. ${item}`),
    "",
    "Implementation plan:",
    ...result.steps.map((step, index) => `${index + 1}. ${step}`),
    "",
    "Planned files:",
    ...result.files.map(
      (file) => `• ${file.path} — ${file.action}: ${file.description}`
    ),
    "",
    `Risk level: ${result.riskLevel}`,
  ].join("\n");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0f17",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
  },
  title: {
    color: "#f8fafc",
    fontSize: 26,
    fontWeight: "800",
  },
  subtitle: {
    color: "#94a3b8",
    marginTop: 4,
    fontSize: 14,
  },
  settingsCard: {
    margin: 12,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#334155",
    backgroundColor: "#0f172a",
  },
  settingsTitle: {
    color: "#bfdbfe",
    fontWeight: "800",
    fontSize: 15,
  },
  settingsBody: {
    marginTop: 12,
    gap: 8,
  },
  label: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  settingsInput: {
    color: "#f8fafc",
    backgroundColor: "#020617",
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  settingsActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  smallButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  secondaryButton: {
    borderColor: "#475569",
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: "#dbeafe",
    fontWeight: "800",
  },
  warningText: {
    color: "#fbbf24",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  chat: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    gap: 12,
  },
  bubble: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  userBubble: {
    backgroundColor: "#172554",
    borderColor: "#1d4ed8",
    alignSelf: "flex-end",
    maxWidth: "90%",
  },
  agentBubble: {
    backgroundColor: "#111827",
    borderColor: "#374151",
    alignSelf: "flex-start",
    maxWidth: "95%",
  },
  role: {
    color: "#93c5fd",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  message: {
    color: "#e5e7eb",
    fontSize: 15,
    lineHeight: 22,
  },
  inputBar: {
    flexDirection: "row",
    padding: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "#1f2937",
    backgroundColor: "#0f172a",
  },
  input: {
    flex: 1,
    color: "#f8fafc",
    backgroundColor: "#020617",
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxHeight: 120,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 18,
    justifyContent: "center",
    borderRadius: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontWeight: "800",
  },
});
