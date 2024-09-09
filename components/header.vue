<template>
  <div class="header-main">
    <div class="closedSidebar">
      <div class="styledButtonContainers">
        <button
          title="Open Sidebar"
          @click="toggleSidebar"
          class="sidebar_button"
        >
          <i class="fa-regular fa-square-caret-right"></i>
        </button>
        <button
          title="Save and Open a new chat"
          @click="clearAllChats()"
          class="sidebar_button"
        >
          <i class="fa-regular fa-square-plus"></i>
        </button>
      </div>
    </div>
    <p class="header-title">Error searching program</p>
  </div>
</template>

<script lang="js" setup>
import { onMounted } from "vue";

const clearChat = inject("clearChat");
let sidebar_visible = inject("sidebar_visible");
let sidebar_auto_hidden = inject("sidebar_auto_hidden");
const toggleSidebar = inject("toggleSidebar");

const clearAllChats = () => {
  clearChat();
};
</script>

<style>
.header-main {
  width: 100vw;
  height: 71.2px;
  position: fixed;
  background-color: white;
  border-bottom: 2px black solid;
  color: black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
}
.styledButtonContainers {
  height: 100%;
  align-self: center;
  display: flex;
  margin-left: 10px;
}
.header-title {
  text-align: center;
  font-size: large;
  font-weight: bold;
  margin: 0 auto;
}
</style>
