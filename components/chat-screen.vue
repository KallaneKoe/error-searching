<template>
  <div v-if="isLoading">
    <div class="loader"></div>
  </div>
  <div v-else class="mainscreen" ref="scrollContainer">
    <HistorySidebar
      class="history-sidebar"
      :sessions="sessions"
      @sessionSelected="selectSession"
    />
    <div class="chatscreen">
      <div className=" ">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="chatbubbles"
          ref="messageContainer"
        >
          <div class="chat-bubble user" v-if="message.userMessage !== ''">
            <pre class="content user">{{ message.userMessage }}</pre>
          </div>
          <swiper
            v-if="Array.isArray(message.botMessage)"
            class="chat-bubble"
            :slides-per-view="1"
            space-between="20"
            :navigation="true"
            :modules="[Navigation, Pagination]"
            :pagination="true"
          >
            <swiper-slide
              v-for="(mess, index) in message.botMessage"
              :key="index"
            >
              <pre class="content bot">{{ mess }}</pre>
            </swiper-slide>
          </swiper>
          <div v-else class="chat-bubble">
            <pre class="content bot">{{ message.botMessage }}</pre>
          </div>
        </div>

        <div
          v-for="(option, index) in playerChoiceOption"
          v-if="step === 2"
          :key="index"
          class="options"
        >
          <button
            class="chat-bubble option-button"
            @click="filterByPlayer(option, true)"
          >
            <pre class="bot">{{ option }}</pre>
          </button>
        </div>
        <div
          v-for="(option, index) in searchChoiceOption"
          v-if="step === 3"
          :key="index"
          class="options"
        >
          <button
            class="chat-bubble option-button"
            @click="filteredByProperties(option, true)"
          >
            <pre class="bot">{{ option }}</pre>
          </button>
        </div>
        <div
          v-for="(option, index) in platformChoiceOption"
          v-if="step === 1"
          :key="index"
          class="options"
        >
          <button
            class="chat-bubble option-button"
            @click="filterByPlatform(option, true)"
          >
            <pre class="bot">{{ option }}</pre>
          </button>
        </div>
        <div v-if="step === 4" class="options">
          <button
            class="chat-bubble option-button"
            @click="
              sendMessage('', 'Xin chào, hôm nay tôi có thể giúp gì cho bạn?'),
                back()
            "
          >
            <pre class="bot">Quay lại</pre>
          </button>
        </div>
      </div>
      <div></div>
      <div class="input">
        <div class="input-zone">
          <input
            v-model="newMessage"
            type="text"
            rows="90"
            class="input_textbox"
            placeholder="Input your question here"
            @keyup.enter="search(newMessage, true)"
          />
        </div>
        <button class="input_button" @click="search(newMessage, true)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 32 32"
            class="text-4xl text-black"
          >
            <path
              fill="currentColor"
              d="m29.919 6.163l-4.225 19.925c-.319 1.406-1.15 1.756-2.331 1.094l-6.438-4.744l-3.106 2.988c-.344.344-.631.631-1.294.631l.463-6.556L24.919 8.72c.519-.462-.113-.719-.806-.256l-14.75 9.288l-6.35-1.988c-1.381-.431-1.406-1.381.288-2.044l24.837-9.569c1.15-.431 2.156.256 1.781 2.013z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="js" setup>
import { defineComponent, onMounted, ref, provide } from "vue";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css/pagination";
import HistorySidebar from "./history-sidebar.vue";
import { useChatSession } from "~/composables/useChatSession";
// import { v4 as uuidv4 } from "uuid";

const { sessions, saveSession, loadSession } = useChatSession();
// const currentSessionId = ref(uuidv4());
const newMessage = ref("");
const messages = ref([]);
const platformChoiceOption = ref([]);
const playerChoiceOption = ref([]);
const searchChoiceOption = ref(["ErrCode", "ErrMessage", "Cause"]);
let data;
let responseList = [];
let FilteredData;
let searchProperties = "empty";
const config = useRuntimeConfig();
const isLoading = ref(true);
let step = 1;
let filteringArray = ref([]);
let currentSession = ref({
  errCode: "",
  errMessage: "",
  cause: "",
  state: 4,
  date: new Date().toISOString(),
  numberOfSearch: 1,
  filteringArray: [],
});

defineComponent({
  name: "CibTelegramPlane",
});

onMounted(async () => {
  try {
    data = await axios.get(config.public.apiBase);
    const platform = data.data.map((errorCode) => errorCode.Platform);

    platformChoiceOption.value = [...new Set(platform)];
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu:", error);
  } finally {
    isLoading.value = false;
  }
});

onMounted(() => {
  sendMessage("", "Xin chào, hôm nay tôi có thể giúp gì cho bạn?");

  scrollToBottom();
});

const clearChat = () => {
  messages.value = [];
  sendMessage("", "Xin chào, hôm nay tôi có thể giúp gì cho bạn?");
  step = 1;
};

provide("clearChat", clearChat);

const saveMessage = (errCode, errMessage, cause) => {
  currentSession.value = {};

  currentSession.value.errCode = errCode;

  currentSession.value.errMessage = errMessage;

  currentSession.value.cause = cause;

  console.log(errCode, errMessage, cause);

  currentSession.value.date = formatDateTime(new Date().toISOString());
  currentSession.value.state = 4;
  currentSession.value.numberOfSearch = 1;
  currentSession.value.filteringArray = filteringArray;

  const existingSessionIndex = sessions.value.findIndex((session) => {
    if (session.errCode !== undefined) {
      return JSON.stringify(session.errCode) === JSON.stringify(errCode);
    } else if (session.errMessage !== undefined) {
      return JSON.stringify(session.errMessage) === JSON.stringify(errMessage);
    } else {
      return JSON.stringify(session.cause) === JSON.stringify(cause);
    }
  });

  if (existingSessionIndex >= 0) {
    let chatSessions = JSON.parse(localStorage.getItem("chatSessions")) || [];
    chatSessions[existingSessionIndex].date = currentSession.value.date;
    chatSessions[existingSessionIndex].numberOfSearch++;

    localStorage.setItem("chatSessions", JSON.stringify(chatSessions));
  } else {
    saveSession(currentSession.value);
    console.log(currentSession.value);
  }
};

function selectSession(errCode, errMessage, cause) {
  currentSession.value = loadSession(errCode, errMessage, cause) || {
    messages: [],
  };
  console.log(currentSession.value);

  step = currentSession.value.state;

  filterByPlatform(currentSession.value.filteringArray[0], false);
  filterByPlayer(currentSession.value.filteringArray[1], false);

  filteredByProperties(currentSession.value.filteringArray[2], false);

  // if (errCode !== "") {
  //   console.log("Search By ErrCode");
  //   console.log(errCode);
  //   search(errCode, false);
  // } else if (errMessage !== "") {
  //   console.log("Search By ErrMessage");

  //   console.log(errMessage);
  //   search(errMessage, false);
  // } else {
  //   console.log("Search By Cause");
  //   console.log(cause);
  //   search(cause, false);
  // }

  if (searchProperties === "ErrCode") {
    search(errCode, false);
  } else if (searchProperties === "ErrMessage") {
    search(errMessage, false);
  } else {
    search(cause, false);
  }
  filteringArray.value = [];
}

function formatDateTime(isoString) {
  const date = new Date(isoString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

const filterByPlatform = (platForm, flag) => {
  FilteredData = data.data;
  FilteredData = FilteredData.filter((item) => {
    if (item.Platform !== undefined) {
      return item.Platform.toLowerCase().includes(platForm.toLowerCase());
    }
    return false;
  });
  const player = FilteredData.map((errorCode) =>
    errorCode.Player.toLowerCase()
  );
  playerChoiceOption.value = [...new Set(player)];

  playerChoiceOption.value = playerChoiceOption.value.map((player) => {
    if (player !== "") {
      return player
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    } else {
      return "Không có";
    }
  });
  if (flag === true) {
    sendMessage(platForm, "Bạn đang tìm thông tin trên Player nào vậy?");
  }
  step = 2;
  filteringArray.value.push(platForm);
  console.log(FilteredData, platForm, filteringArray.value);
  nextTick(() => {
    scrollToBottom();
  });
};

const filterByPlayer = (player, flag) => {
  if (player === "Không có") {
    player = "";
  }
  FilteredData = FilteredData.filter((item) => {
    if (item.Player !== undefined) {
      return item.Player.toLowerCase().includes(player.toLowerCase());
    }
    return false;
  });
  if (flag === true) {
    sendMessage(player, "Bạn muốn tìm kiếm thông theo gì?");
  }
  step = 3;
  filteringArray.value.push(player);
  console.log(FilteredData, player, filteringArray.value);
  nextTick(() => {
    scrollToBottom();
  });
};
const filteredByProperties = (searchBy, flag) => {
  if (flag === true) {
    sendMessage(
      searchBy,
      "Bạn có thể bắt đầu tìm kiếm theo " + searchBy + " rồi"
    );
  }
  searchProperties = searchBy;
  step = 4;
  filteringArray.value.push(searchBy);
  console.log(FilteredData, searchBy, filteringArray.value);
  nextTick(() => {
    scrollToBottom();
  });
};

const search = (searchString, flag) => {
  let searchData = FilteredData;
  console.log(searchProperties, newMessage);
  if (searchProperties === "empty") {
    sendMessage(
      newMessage.value,
      "Xin bạn vui lòng chọn Platform, Player và thông tin bạn muốn tìm kiếm trước"
    );
  } else {
    if (searchProperties === "ErrCode") {
      searchData = searchData.filter((item) => {
        if (item.ErrCode !== undefined) {
          if (item.ErrCode.toLowerCase() === searchString.toLowerCase()) {
            return true;
          }
        }
        return false;
      });
    } else if (searchProperties === "ErrMessage") {
      searchData = searchData.filter((item) => {
        if (item.ErrMessage !== undefined) {
          return item.ErrMessage.toLowerCase().includes(
            searchString.toLowerCase()
          );
        }
        return false;
      });
    } else if (searchProperties === "Cause") {
      searchData = searchData.filter((item) => {
        if (item.Cause !== undefined) {
          return item.Cause.toLowerCase().includes(searchString.toLowerCase());
        }
        return false;
      });
    }
    if (flag) {
      for (let i = 0; i < searchData.length; i++) {
        saveMessage(
          searchData[i].ErrCode,
          searchData[i].ErrMessage,
          searchData[i].Cause
        );
      }
    }
    filteringArray = [];
    respondFormatter(searchData);
  }

  nextTick(() => {
    scrollToBottom();
  });
};

const respondFormatter = (searchData) => {
  const defaultValues = {
    Player: "Không có",
    ErrCode: "Không có",
    ErrMessage: "Không có",
    Cause: "Không có",
    CustomerSolution: "Không có",
    DeveloperSolution: "Không có",
    Note: "Không có",
  };

  if (searchData.length > 0) {
    const item = searchData[0];

    Object.keys(defaultValues).forEach((key) => {
      if (item[key] === undefined || item[key] === "") {
        item[key] = defaultValues[key];
      }
    });
    for (let i = 0; i < searchData.length; i++) {
      const resString = `Player: ${searchData[i].Player}\nMã lỗi: ${searchData[i].ErrCode}\nThông báo lỗi: ${searchData[i].ErrMessage}\nNguyên nhân:\n${searchData[i].Cause}\nHướng giải quyết cho khách hàng:\n${searchData[i].CustomerSolution}\nĐội xử lý:\n${searchData[i].DeveloperSolution}\nGhi chú thêm:\n${searchData[i].Note}`;

      responseList.push(resString);
    }

    sendMessage(newMessage.value, responseList);

    responseList = [];
  } else {
    sendMessage(newMessage.value, "Sorry, I don't understand the question.");
  }
};

const back = () => {
  step = 1;
  FilteredData = data.data;
  filteringArray.value = [];
  nextTick(() => {
    scrollToBottom();
  });
};

const sendMessage = (userMessage, botMessage) => {
  messages.value.push({ userMessage: userMessage, botMessage: botMessage });

  newMessage.value = "";
};

const scrollContainer = ref(null);

const scrollToBottom = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
  }
};
</script>

<style>
.mainscreen {
  height: 100vh;
  background-color: #bec7a5;
  overflow-x: hidden;
  display: flex;
  flex-direction: row;
}

.history-sidebar {
  flex: auto;
}

.chatscreen {
  display: flex;
  flex-direction: column;
  background-color: #bec7a5;
  align-content: space-between;
  min-width: 50%;
  flex: auto;
}

.input {
  padding: 20px;
  display: flex;
  flex-direction: row;
  bottom: 0;
  right: 0;
  left: 0;
  flex: 1;
  width: 100%;
  position: sticky;
  z-index: 10;
  flex-grow: 0;
  margin-top: auto;
}

.input_textbox {
  flex: auto;
  width: 100%;
  background-color: whitesmoke;
  border-radius: 900px;
  color: black;
  padding: 0px 16px 0px 16px;
  font-size: large;
  border: 2px solid black;
  font-weight: 600;
  min-height: 66px;
}

.input_button {
  border-radius: 100%;
  background-color: #d0f860;
  padding: 0px 0px 0px 2px;
  margin: 8px;
  border: 2px solid black;
  width: 50px;
  height: 50px;
  position: sticky;
  align-self: self-end;
}

.list {
  flex: 1;
  display: absolute;

  width: 100%;
  margin-top: 1px;
  min-width: 66px;

  border-radius: 16px;
  margin-bottom: 2px;
}

.list-detail {
  cursor: pointer;
  color: black;
  padding: 0px 16px 0px 16px;
  border: 2px black solid;
  margin-bottom: 3px;
  font-size: large;
  align-content: center;
  font-weight: 600;
  min-height: 66px;
  background: white;
  border-radius: 16px;
}

.list-detail:hover {
  background-color: rgb(223, 220, 220);
  border-radius: 16px;
}

.input-zone {
  flex: auto;
  width: 100vw;
  display: flex;
  flex-direction: column;
}

.chatbubbles {
  display: flex;
  flex-direction: column;
}

.loader {
  width: 50px;
  padding: 8px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #25b09b;
  --_m: conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box;
  -webkit-mask: var(--_m);
  mask: var(--_m);
  -webkit-mask-composite: source-out;
  mask-composite: subtract;
  animation: l3 1s infinite linear;
  position: fixed;
  top: 50%;
  left: 50%;
}

@keyframes l3 {
  to {
    transform: rotate(1turn);
  }
}

.chat-bubble {
  width: fit-content;
  height: fit-content;
  max-width: 70%;
  min-width: 30%;
  padding: 15px 15px 15px;

  margin: 10px;
  position: relative;

  overflow-y: auto;
  color: black;
}

.chat-bubble.user {
  margin-left: auto;
}

pre.user {
  background-color: #dcf8c6;
  color: black;
}

pre.bot {
  background-color: whitesmoke;
  margin-left: 45px;
  margin-right: 45px;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;

  border: 2px black solid;
  border-radius: 8px;
  padding: 14px;
}

.swiper-button-prev,
.swiper-button-next {
  color: black;
  background-color: whitesmoke;
  border-radius: 100%;
  border: 2px solid black;
  width: 45px;
  height: 45px;
}

.swiper-pagination-bullet-active {
  background: #000;
}

.options {
  display: flex;
  flex-direction: column;
}

.chat-bubble.option-button {
  padding-top: unset;
  padding-bottom: unset;
  margin-top: unset;
}
</style>
