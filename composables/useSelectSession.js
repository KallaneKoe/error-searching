import { useFiltering } from "./useFiltering";
import { useChatSession } from "./useChatSession";

export const useSelectSession = () => {
  const { loadSession } = useChatSession();
  const {
    currentSession,
    filterByPlatform,
    filterByPlayer,
    filteredByProperties,
    search,
    step,
    filterArray,
    FilteredData,
    playerChoiceOption,
  } = useFiltering();
  function selectSession(data, errCode, errMessage, cause) {
    currentSession.value = loadSession(errCode, errMessage, cause) || {
      messages: [],
    };

    step.value = currentSession.value.state;

    filterByPlatform(
      playerChoiceOption,
      data,
      currentSession.value.filteringArray[0],
      false
    );
    filterByPlayer(FilteredData, currentSession.value.filteringArray[1], false);

    filteredByProperties(
      FilteredData,
      currentSession.value.filteringArray[2],
      false
    );

    const searchProperties = currentSession.value.filteringArray[2];

    if (searchProperties === "ErrCode") {
      search(FilteredData, errCode, false);
    } else if (searchProperties === "ErrMessage") {
      search(FilteredData, errMessage, false);
    } else {
      search(FilteredData, cause, false);
    }
    filterArray.value = [];
  }

  return { selectSession };
};
