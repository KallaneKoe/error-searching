<template>
  <div class="allContainer">
    <div v-if="sidebar_visible === true" class="styledContainer">
      <div class="styledHeader">
        <button title="Save and Open a new chat" @click="clearAllChats()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 32 32"
          >
            <defs>
              <path
                id="carbonNewTab0"
                fill="currentColor"
                d="M26 26H6V6h10V4H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V16h-2Z"
              />
            </defs>
            <use href="#carbonNewTab0" />
            <use href="#carbonNewTab0" />
            <path fill="currentColor" d="M26 6V2h-2v4h-4v2h4v4h2V8h4V6z" />
          </svg>
        </button>
        <h3 class="styledH3">Lịch sử Chat</h3>
        <button title="Close Sidebar" @click="toggleSidebar()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
            >
              <path d="M9 3.5v17m7-5.5l-3-3l3-3" />
              <path
                d="M3 9.4c0-2.24 0-3.36.436-4.216a4 4 0 0 1 1.748-1.748C6.04 3 7.16 3 9.4 3h5.2c2.24 0 3.36 0 4.216.436a4 4 0 0 1 1.748 1.748C21 6.04 21 7.16 21 9.4v5.2c0 2.24 0 3.36-.436 4.216a4 4 0 0 1-1.748 1.748C17.96 21 16.84 21 14.6 21H9.4c-2.24 0-3.36 0-4.216-.436a4 4 0 0 1-1.748-1.748C3 17.96 3 16.84 3 14.6z"
              />
            </g>
          </svg>
        </button>
      </div>
      <div></div>
      <div class="text">Mã lỗi người dùng tìm nhiều nhất</div>
      <div class="StyledChatList">
        <ul>
          <li
            v-for="session in sortedSessionsByPopular"
            :key="session.id"
            class="list"
          >
            <button
              @click="
                selectSession(
                  session.errCode,
                  session.errMessage,
                  session.cause
                )
              "
            >
              <h4 class="styledChatSelect" v-if="session.errCode !== ''">
                {{ session.errCode }}
              </h4>
              <h4
                class="styledChatSelect"
                v-else-if="session.errMessage !== ''"
              >
                {{ session.errMessage }}
              </h4>
              <h4 class="styledChatSelect" v-else>
                {{ session.cause }}
              </h4>
            </button>
          </li>
        </ul>
      </div>
      <div class="text">Mã lỗi người dùng tìm gần đây nhất</div>
      <div class="StyledChatList">
        <ul>
          <li
            v-for="session in sortedSessionsByDate"
            :key="session.id"
            class="list"
          >
            <button
              @click="
                selectSession(
                  session.errCode,
                  session.errMessage,
                  session.cause
                )
              "
            >
              <h4 class="styledChatSelect" v-if="session.errCode !== ''">
                {{ session.errCode }}
              </h4>
              <h4
                class="styledChatSelect"
                v-else-if="session.errMessage !== ''"
              >
                {{ session.errMessage }}
              </h4>
              <h4 class="styledChatSelect" v-else>
                {{ session.cause }}
              </h4>
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div class="closedSidebar">
      <div v-if="sidebar_visible === false" class="styledButtonContainers">
        <button
          title="Open Sidebar"
          @click="toggleSidebar()"
          class="styledButton"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            class="font-bold text-5xl mx-2"
          >
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
            >
              <path d="M15 3.5v17M8 9l3 3l-3 3" />
              <path
                d="M3 9.4c0-2.24 0-3.36.436-4.216a4 4 0 0 1 1.748-1.748C6.04 3 7.16 3 9.4 3h5.2c2.24 0 3.36 0 4.216.436a4 4 0 0 1 1.748 1.748C21 6.04 21 7.16 21 9.4v5.2c0 2.24 0 3.36-.436 4.216a4 4 0 0 1-1.748 1.748C17.96 21 16.84 21 14.6 21H9.4c-2.24 0-3.36 0-4.216-.436a4 4 0 0 1-1.748-1.748C3 17.96 3 16.84 3 14.6z"
              />
            </g>
          </svg>
        </button>
        <button
          title="Save and Open a new chat"
          @click="clearAllChats()"
          class="styledButton"
          className="border-l-2 border-black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 32 32"
            class="font-bold text-5xl ml-2"
          >
            <defs>
              <path
                id="carbonNewTab0"
                fill="currentColor"
                d="M26 26H6V6h10V4H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V16h-2Z"
              />
            </defs>
            <use href="#carbonNewTab0" />
            <use href="#carbonNewTab0" />
            <path fill="currentColor" d="M26 6V2h-2v4h-4v2h4v4h2V8h4V6z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="js" setup>
import { inject, onMounted } from "vue";

import { defineProps, defineEmits } from "vue";
import { ref, watch, computed } from "vue";

const props = defineProps({
  sessions: Array,
});

defineOptions({
  inheritAttrs: false,
});

const emit = defineEmits(["sessionSelected"]);

function selectSession(errCode, errMessage, cause) {
  emit("sessionSelected", errCode, errMessage, cause);
}
//const windowWidth = ref(window.innerWidth);
const windowWidth = ref(window.matchMedia("(max-width: 768px)"));
const sidebar_visible = ref(true);
const sidebar_auto_hidden = ref(false);

onMounted(() => {
  window.addEventListener("resize", this.handleResize);
});

const handleResize = () => {
  windowWidth.value = window.matchMedia("(max-width: 768px)");
  if (windowWidth.value < 920 && sidebar_visible.value) {
    sidebar_visible.value = false;
    sidebar_auto_hidden.value = true;
  } else if (windowWidth.value >= 920 && sidebar_auto_hidden.value) {
    sidebar_visible.value = true;
    sidebar_auto_hidden.value = false;
  }
};

const toggleSidebar = () => {
  sidebar_auto_hidden.value = false;
  sidebar_visible.value = !sidebar_visible.value;
};

window.addEventListener("resize", handleResize);

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

const clearChat = inject("clearChat");

const clearAllChats = () => {
  clearChat();
};

function parseCustomDate(dateString) {
  const [day, month, year, hour, minute, second] = dateString
    .split(/[/\s:]/)
    .map(Number);
  return new Date(year, month - 1, day, hour, minute, second);
}

const sortedSessionsByDate = computed(() => {
  console.log("sortedSessionsByDate recomputed");
  return [...props.sessions].sort((a, b) => {
    return parseCustomDate(b.date) - parseCustomDate(a.date);
  });
});

const sortedSessionsByPopular = computed(() => {
  console.log("sortedSessionsByPopular recomputed");
  return [...props.sessions].sort((a, b) => {
    return b.numberOfSearch - a.numberOfSearch;
  });
});
</script>

<style>
.allContainer {
  position: sticky;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
}
.styledContainer {
  height: 100vh;
  min-width: 10vw;
  max-width: 20vw;
  position: sticky;
  top: 0;
  bottom: 0;
  width: 200vw;
  border-right: 2px solid black;
  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
  height: 100vh;
}

.styledHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 10vh;
  border-bottom: 2px solid black;

  top: 0;
  background-color: white;
  z-index: 1;
}

.styledH3 {
  word-break: break-all;
  color: black;
  font-weight: 500;
}

svg {
  width: 25px;
  height: 25px;
  color: black;
}

.styledChatSelect {
  border-radius: 900px;
  border: 2px black solid;
  margin: 8px;
  padding: 4px 10px;
  align-items: center;
  color: black;
  font-weight: 500;
  font-size: large;
  background-color: white;
}

.StyledChatList {
  background-color: white;
  height: 35vh;
  max-height: 35vh;
  padding-top: 2px;
  border-bottom: 2px solid black;
  overflow-x: hidden;
}

.styledButtonContainers {
  position: fixed;
  top: 8px;
  left: 8px;
  display: flex;
  flex-direction: row;
  background-color: white;
  padding: 10px;
  border-radius: 850px;
  border: 2px solid black;
}

.styledButton {
  flex: 1;
}

.text {
  color: black;
  font-weight: 500;
  border-bottom: 2px black solid;
  padding: 4px;
  text-align: center;
  background-color: white;
  height: 10vh;
  max-height: 10vh;
  align-content: center;
}

li {
  overflow-x: auto;
}

ul {
}

.closedSidebar {
}
</style>
