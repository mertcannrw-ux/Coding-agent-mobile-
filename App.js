import React, { useMemo, useState } from "react";
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

export default function App() {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "agent",
      text:
        "Forge Mobile Agent is ready. Describe a coding task and I will turn it into a structured implementation plan.",
    },
  ]);

  const taskCount = useMemo(
    () => messages.filter((message) => message.role === "user").length,
    [messages]
  );

  async function sendTask() {
    const task = input.trim();
    if (!task || busy) return;

    setInput("");
    setBusy(true);
    setMessages((old) => [...old, { role: "user", text: task }]);

    try {
      const result = await runMobileAgent(task);
      setMessages((old) => [
        ...old,
        {
          role: "agent",
          text: formatAgentResult(result),
        },
      ]);
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
          Mobile-first coding assistant shell · {taskCount} task{taskCount === 1 ? "" : "s"}
        </Text>
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
