<template>
  <div
    class="w-screen h-[71.2px] fixed bg-white text-black flex justify-between items-center z-[100] border-b-2 border-gray-300 shadow-md"
  >
    <div>
      <div class="h-full self-center flex ml-2.5">
        <button
          title="Open Sidebar"
          @click="modalStore.toggleSidebar"
          class="text-3xl text-[black] mx-5px"
        >
          <i class="fa-regular fa-square-caret-right"></i>
        </button>
        <button
          title="Save and Open a new chat"
          @click="clearAllChats()"
          class="text-3xl text-[black] mx-[5px]"
        >
          <i class="fa-regular fa-square-plus"></i>
        </button>
      </div>
    </div>
    <p class="text-center text-lg font-bold mx-auto my-0">
      Error searching program
    </p>
  </div>
</template>

<script lang="js" setup>
import { onMounted } from "vue";
import { useCleanChat } from "~/composables/useCleanChat";

const { clearChat } = useCleanChat;
import { useModalStore } from "~/stores/modal";

const modalStore = useModalStore();

const clearAllChats = () => {
  clearChat();
};
</script>
