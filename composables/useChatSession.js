import { ref } from "vue";

export function useChatSession() {
  const sessions = ref([]);

  if (import.meta.client) {
    const savedSessions = localStorage.getItem("chatSessions");
    if (savedSessions) {
      sessions.value = JSON.parse(savedSessions);
    }
  }

  function saveSession(newSession) {
    sessions.value.push(newSession);
    localStorage.setItem("chatSessions", JSON.stringify(sessions.value));
  }

  function loadSession(sessionId) {
    return sessions.value.find((session) => session.id === sessionId);
  }

  return {
    sessions,
    saveSession,
    loadSession,
  };
}
