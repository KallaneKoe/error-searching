<template>
  <div class="allContainer">
    <div v-if="sidebar_visible === true" class="styledContainer">
      <div class="styledHeader">
        <button
          title="Open a new chat"
          @click="clearAllChats()"
          class="sidebar_button"
        >
          <i class="fa-regular fa-square-plus"></i>
        </button>
        <h3 class="styledH3">Lịch sử Chat</h3>
        <button
          title="Close Sidebar"
          @click="toggleSidebar"
          class="sidebar_button"
        >
          <i class="fa-regular fa-square-caret-left"></i>
        </button>
      </div>
      <div></div>
      <div class="text">Mã lỗi người dùng tìm nhiều nhất</div>
      <div class="StyledChatList">
        <ul>
          <li v-for="session in sortedSessionsByPopular" class="history-list">
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
          <li v-for="session in sortedSessionsByDate" class="history-list">
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
  </div>
</template>

<script lang="js" setup>
import { inject, onMounted } from "vue";

import { ref, watch, computed } from "vue";

const props = defineProps({
  sessions: Array,
});

defineOptions({
  inheritAttrs: false,
});

const emit = defineEmits(["sessionSelected", "change_visible"]);

function selectSession(errCode, errMessage, cause) {
  emit("sessionSelected", errCode, errMessage, cause);
}

const clearChat = inject("clearChat");

let sidebar_visible = inject("sidebar_visible");
let sidebar_auto_hidden = inject("sidebar_auto_hidden");
const toggleSidebar = inject("toggleSidebar");

const clearAllChats = () => {
  clearChat();
};

function parseCustomDate(dateString) {
  const [day, month, year, hour, minute, second] = dateString
    .split(/[/\s:]/)
    .map(Number);
  return new Date(year, month - 1, day, hour, minute, second);
}

const sortedSessionsByDate = ref([]);
const sortedSessionsByPopular = ref([]);

watch(
  () => props.sessions,
  (newSessions) => {
    sortedSessionsByDate.value = [...newSessions].sort((a, b) => {
      return parseCustomDate(b.date) - parseCustomDate(a.date);
    });
    sortedSessionsByPopular.value = [...newSessions].sort((a, b) => {
      return b.numberOfSearch - a.numberOfSearch;
    });
  },
  { deep: true, immediate: true }
);
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
  max-width: 50vw;
  position: sticky;
  top: 0;
  bottom: 0;
  width: 20vw;
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
.history-list {
  display: contents;
}
@media (max-width: 920px) {
  .styledContainer {
    width: 50vw;
  }
  .allContainer {
    z-index: 1000;
  }
}
.sidebar_button i {
  font-size: 30px;
  margin-left: 5px;
  margin-right: 5px;
  color: black;
}
@media (max-width: 768px) {
  .styledContainer {
    width: 70vw;
  }
  .allContainer {
    z-index: 1000;
  }
}
</style>
