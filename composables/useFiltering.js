import { useSendMessage } from "~/composables/useSendMessage.js";

import { useChatSession } from "~/composables/useChatSession";

export const useFiltering = () => {
  const { sessions, saveSession, loadSession } = useChatSession();
  let step = useState("step", () => 1);
  const { sendMessage, newMessage, messages, respondFormatter } =
    useSendMessage();
  let filterArray = useState("filterArray", () => []);
  //const FilteredData = useState("FilteredData", () => []);
  let FilteredData = ref([]);
  let currentSession = ref({
    errCode: "",
    errMessage: "",
    cause: "",
    state: 4,
    date: new Date().toISOString(),
    numberOfSearch: 1,
    filteringArray: [],
  });
  const platformChoiceOption = useState("platformChoiceOption", () => []);
  const playerChoiceOption = useState("playerChoiceOption", () => []);
  const searchChoiceOption = ref(["ErrCode", "ErrMessage", "Cause"]);
  let searchProperties = useState("searchProperties", () => "empty");

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

  const saveMessage = (errCode, errMessage, cause) => {
    currentSession.value = {};

    currentSession.value.errCode = errCode;

    currentSession.value.errMessage = errMessage;

    currentSession.value.cause = cause;

    currentSession.value.date = formatDateTime(new Date().toISOString());
    currentSession.value.state = 4;
    currentSession.value.numberOfSearch = 1;

    currentSession.value.filteringArray = filterArray.value;

    const existingSessionIndex = sessions.value.findIndex((session) => {
      if (session.errCode !== undefined) {
        return JSON.stringify(session.errCode) === JSON.stringify(errCode);
      } else if (session.errMessage !== undefined) {
        return (
          JSON.stringify(session.errMessage) === JSON.stringify(errMessage)
        );
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
    }
  };

  const filterByPlatform = (playerChoiceOption, data, platForm, flag) => {
    FilteredData.value = data.value;

    FilteredData.value = FilteredData.value.filter((item) => {
      if (item.Platform !== undefined) {
        return item.Platform.toLowerCase().includes(platForm.toLowerCase());
      }
      return false;
    });

    const player = FilteredData.value.map((errorCode) =>
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
    step.value = 2;
    filterArray.value.push(platForm);
  };

  const filterByPlayer = (FilteredData, player, flag) => {
    if (player === "Không có") {
      player = "";
    }

    FilteredData.value = FilteredData.value.filter((item) => {
      if (item.Player !== undefined) {
        return item.Player.toLowerCase().includes(player.toLowerCase());
      }
      return false;
    });
    if (flag === true) {
      sendMessage(player, "Bạn muốn tìm kiếm thông theo gì?");
    }
    step.value = 3;
    filterArray.value.push(player);
  };
  const filteredByProperties = (FilteredData, searchBy, flag) => {
    if (flag === true) {
      sendMessage(
        searchBy,
        "Bạn có thể bắt đầu tìm kiếm theo " + searchBy + " rồi"
      );
    }
    searchProperties.value = searchBy;
    step.value = 4;
    filterArray.value.push(searchBy);
  };

  function toUnitedString(string) {
    return string
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/\s+/g, "");
  }

  const search = (FilteredData, searchString, flag) => {
    let searchData = FilteredData.value;

    if (searchProperties.value === "empty") {
      sendMessage(
        newMessage.value,
        "Xin bạn vui lòng chọn Platform, Player và thông tin bạn muốn tìm kiếm trước"
      );
    } else {
      if (searchProperties.value === "ErrCode") {
        searchData = searchData.filter((item) => {
          if (item.ErrCode !== undefined) {
            if (
              toUnitedString(item.ErrCode.toLowerCase()) ===
              toUnitedString(searchString.toLowerCase())
            ) {
              return true;
            }
          }

          return false;
        });
      } else if (searchProperties.value === "ErrMessage") {
        searchData = searchData.filter((item) => {
          if (item.ErrMessage !== undefined) {
            return toUnitedString(item.ErrMessage.toLowerCase()).includes(
              toUnitedString(searchString.toLowerCase())
            );
          }
          return false;
        });
      } else if (searchProperties.value === "Cause") {
        searchData = searchData.filter((item) => {
          if (item.Cause !== undefined) {
            return toUnitedString(item.Cause.toLowerCase()).includes(
              toUnitedString(searchString.toLowerCase())
            );
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

      respondFormatter(searchString, searchData);
    }
  };

  const back = (data) => {
    step.value = 1;
    FilteredData.value = data.value;
    filterArray.value = [];
    searchProperties.value = "empty";
  };

  return {
    filterByPlatform,
    filterByPlayer,
    filteredByProperties,
    search,
    FilteredData,
    filterArray,
    step,
    currentSession,
    back,
    platformChoiceOption,
    playerChoiceOption,
    searchChoiceOption,
  };
};
