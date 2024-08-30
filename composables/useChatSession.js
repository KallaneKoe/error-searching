import { ref } from "vue";

export function useChatSession() {
  const sessions = ref([]);

  if (import.meta.client) {
    const savedSessions = localStorage.getItem("chatSessions");
    if (savedSessions) {
      sessions.value = JSON.parse(savedSessions);
    }
  }

  function parseCustomDate(dateString) {
    const [day, month, year, hour, minute, second] = dateString
      .split(/[/\s:]/)
      .map(Number);
    return new Date(year, month - 1, day, hour, minute, second);
  }

  function deleteOldestSession() {
    if (sessions.value.length > 0) {
      let oldestSessionIndex = 0;
      let oldestDate = parseCustomDate(sessions.value[0].date);

      sessions.value.forEach((session, index) => {
        const sessionDate = parseCustomDate(session.date);
        if (sessionDate < oldestDate) {
          oldestDate = sessionDate;
          oldestSessionIndex = index;
        }
      });

      sessions.value.splice(oldestSessionIndex, 1);
      localStorage.setItem("chatSessions", JSON.stringify(sessions.value));
    }
  }

  function saveSession(newSession) {
    sessions.value.push(newSession);
    try {
      localStorage.setItem("chatSessions", JSON.stringify(sessions.value));
    } catch (e) {
      if (
        e.name === "QuotaExceededError" ||
        e.name === "NS_ERROR_DOM_QUOTA_REACHED"
      ) {
        deleteOldestSession();
        alert("Local storage is full, cannot save data.");
      } else {
        alert("An error occurred while saving to local storage.", e);
      }
    }
  }

  function loadSession(errCode, errMessage, cause) {
    return sessions.value.find((session) => {
      if (session.errCode !== undefined) {
        return session.errCode === errCode;
      }
      if (session.errMessage !== undefined) {
        return session.errMessage === errMessage;
      }
      if (session.cause !== undefined) {
        return session.cause === cause;
      }
    });
  }

  return {
    sessions,
    saveSession,
    loadSession,
  };
}
