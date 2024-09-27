import { useFiltering } from "./useFiltering";
import { useSendMessage } from "~/composables/useSendMessage.js";

export const useCleanChat = () => {
  const { step } = useFiltering();
  const { sendMessage, messages } = useSendMessage();
  const clearChat = () => {
    messages.value = [];
    sendMessage("", "Xin chào, hôm nay tôi có thể giúp gì cho bạn?");
    step.value = 1;
  };
  return { clearChat };
};
