import AsyncStorage from "@react-native-async-storage/async-storage";

const API_KEY_STORAGE_KEY = "forge-mobile-agent.openai-api-key";
const MODEL_STORAGE_KEY = "forge-mobile-agent.openai-model";

export async function saveApiKey(apiKey) {
  const trimmed = apiKey.trim();
  if (!trimmed) {
    await AsyncStorage.removeItem(API_KEY_STORAGE_KEY);
    return;
  }
  await AsyncStorage.setItem(API_KEY_STORAGE_KEY, trimmed);
}

export async function loadApiKey() {
  return AsyncStorage.getItem(API_KEY_STORAGE_KEY);
}

export async function clearApiKey() {
  await AsyncStorage.removeItem(API_KEY_STORAGE_KEY);
}

export async function saveModel(model) {
  await AsyncStorage.setItem(MODEL_STORAGE_KEY, model.trim() || "gpt-5-mini");
}

export async function loadModel() {
  return (await AsyncStorage.getItem(MODEL_STORAGE_KEY)) || "gpt-5-mini";
}
