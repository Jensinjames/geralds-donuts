export const VOICE_CHAT_CONFIG = {
  conversation_config_override: {
    agent: {
      prompt: {
        prompt: "You are a helpful AI assistant. You are cheerful and friendly."
      },
      first_message: "Hi! How can I help you today?",
      language: "en"
    },
    tts: {
      voice_id: "pNInz6obpgDQGcFmaJgB"
    }
  },
  custom_llm_extra_body: {
    temperature: 0.7,
    max_tokens: 150
  }
};