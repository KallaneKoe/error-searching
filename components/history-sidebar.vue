<template>
  <div
    v-show="modalStore.sidebar_visible"
    class="sticky top-0 bottom-0 left-0 z-[100]"
    :key="modalStore.sidebar_visible"
    :class="[
      modalStore.isAnimating
        ? 'animate__animated animate__fadeOutLeft'
        : 'animate__animated animate__fadeInLeft',
    ]"
    @animationend="modalStore.handleAnimationEnd"
  >
    <div
      class="h-screen sticky top-0 bottom-0 max-w-[50vw] min-w-[10vw] w-[90vw] md:w-[50vw] lg:w-[20vw] border-r-gray-300 border-r-2 no-scrollbar"
    >
      <div
        class="flex justify-between items-center p-4 top-0 bg-white h-[10vh] border-b-gray-300 border-b-2"
      >
        <button
          title="Open a new chat"
          @click="clearAllChats()"
          class="text-3xl ml-1 mr-1 text-black"
        >
          <i class="fa-regular fa-square-plus"></i>
        </button>
        <h3 class="break-all text-black font-semibold">Lịch sử Chat</h3>
        <button
          title="Close Sidebar"
          @click="modalStore.toggleSidebar"
          class="text-3xl ml-1 mr-1 text-black"
        >
          <i class="fa-regular fa-square-caret-left"></i>
        </button>
      </div>
      <div></div>
      <div
        class="text-black font-medium p-1 text-center bg-white content-center h-[10vh] max-h-[10vh]"
      >
        Mã lỗi người dùng tìm nhiều nhất
      </div>
      <div
        class="bg-white pt-0 overflow-x-hidden h-[35vh] max-h-[35vh] border-b-gray-300 border-b-2"
      >
        <ul>
          <li v-for="session in sortedSessionsByPopular" class="contents">
            <button
              @click="
                handleSelectChat(
                  session.errCode,
                  session.errMessage,
                  session.cause
                )
              "
            >
              <h4
                class="m-2 items-center text-black font-medium bg-white rounded-full border-gray-500 border-2 px-[10px] py-[4px] text-large hover:text-white hover:bg-gray-300"
                v-if="session.errCode !== ''"
              >
                {{ session.errCode }}
              </h4>
              <h4
                class="m-2 items-center text-black font-medium bg-white rounded-full border-gray-500 border-2 px-[10px] py-[4px] text-large hover:text-white hover:bg-gray-300"
                v-else-if="session.errMessage !== ''"
              >
                {{ session.errMessage }}
              </h4>
              <h4
                class="m-2 items-center text-black font-medium bg-white rounded-full border-gray-500 border-2 px-[10px] py-[4px] text-large hover:text-white hover:bg-gray-300"
                v-else
              >
                {{ session.cause }}
              </h4>
            </button>
          </li>
        </ul>
      </div>
      <div
        class="text-black font-medium p-1 text-center bg-white content-center h-[10vh] max-h-[10vh]"
      >
        Mã lỗi người dùng tìm gần đây nhất
      </div>
      <div
        class="bg-white pt-0 overflow-x-hidden h-[35vh] max-h-[35vh] border-b-gray-300 border-b-2"
      >
        <ul>
          <li v-for="session in sortedSessionsByDate" class="contents">
            <button
              @click="
                handleSelectChat(
                  session.errCode,
                  session.errMessage,
                  session.cause
                )
              "
            >
              <h4
                class="m-2 items-center text-black font-medium bg-white rounded-full border-gray-500 border-2 px-[10px] py-[4px] text-large hover:text-white hover:bg-gray-300"
                v-if="session.errCode !== ''"
              >
                {{ session.errCode }}
              </h4>
              <h4
                class="m-2 items-center text-black font-medium bg-white rounded-full border-gray-500 border-2 px-[10px] py-[4px] text-large hover:text-white hover:bg-gray-300"
                v-else-if="session.errMessage !== ''"
              >
                {{ session.errMessage }}
              </h4>
              <h4
                class="m-2 items-center text-black font-medium bg-white rounded-full border-gray-500 border-2 px-[10px] py-[4px] text-large hover:text-white hover:bg-gray-300"
                v-else
              >
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

import { useCleanChat } from "~/composables/useCleanChat";
import { useSelectSession } from "~/composables/useSelectSession.js";

const { clearChat } = useCleanChat();
const { selectSession } = useSelectSession();

const props = defineProps({
  sessions: Array,
});

defineOptions({
  inheritAttrs: false,
});

import { useModalStore } from "~/stores/modal";

const modalStore = useModalStore();
const data = inject("data");

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

function handleSelectChat(errCode, errMessage, cause) {
  console.log(data.value);
  selectSession(data, errCode, errMessage, cause);
}
</script>

<style>
li {
  overflow-x: auto;
}

@media (max-width: 768px) {
  .styledContainer {
    width: 70vw;
  }
  .allContainer {
    z-index: 1000;
  }
}

@media (max-width: 965px) {
  .styledContainer {
    width: 50vw;
  }
  .allContainer {
    z-index: 1000;
  }
}
</style>
